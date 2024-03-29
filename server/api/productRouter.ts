import express from 'express';
const router = express.Router({ mergeParams: true });
import reviewRouter from './reviewRouter';
import { ImageData, Product, Tag } from '../database/index';
import { checkAuthenticated, requireAdmin } from './authMiddleware';
import { zodProduct } from '../utils';
import { IProduct, ITag } from '../database/index';

const createZodProduct = zodProduct.strict();
const updateZodProduct = zodProduct
  .deepPartial()
  .required({ tags: true })
  .strict();

router.get('/', async (req, res, next) => {
  const PRODUCTS_PER_PAGE = 9;

  try {
    let { page, sortKey, sortDir, filterKey } = req.query as {
      page: string | number;
      sortKey: string;
      sortDir: string;
      filterKey: string;
    };
    if (!page) page = 1;
    else page = +page;
    if (!sortKey) sortKey = 'productName';
    if (!sortDir) sortDir = 'asc';

    // do something with filterKey
    let productFilter = {};
    if (filterKey !== 'all') {
      productFilter = { tagName: filterKey };
      const filterTag = await Tag.findOne({ tagName: filterKey });
      if (filterTag) {
        productFilter = { tags: filterTag._id };
      } else productFilter = {};
    }

    const skip = (page - 1) * PRODUCTS_PER_PAGE;
    let sort = { [sortKey]: sortDir === 'asc' ? 1 : -1, _id: 1 };

    const allProducts = await Product.find(productFilter, null, {
      skip,
      limit: PRODUCTS_PER_PAGE,
      sort,
    }).populate({ path: 'tags' });

    const countAllProducts = await Product.countDocuments(productFilter);

    if (!allProducts.length) return res.status(404).send('No products found');

    res.status(200).json({
      products: allProducts,
      count: countAllProducts,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    let allProducts = await Product.find().populate('tags');

    if (!allProducts.length)
      return res
        .status(404)
        .json({ message: 'Troubles fetching all products' });

    allProducts = JSON.parse(JSON.stringify(allProducts)).map(
      (prod: IProduct) => {
        return { ...prod, productName: prod.productName.toUpperCase() };
      }
    );

    res.status(200).json(allProducts);
  } catch (err) {
    next(err);
  }
});

type ProductItem = {
  productId: string;
  productName: string;
  images: ImageData[];
};

type TagItem = {
  tagId: string;
  tagName: string;
};

export type TSearch = {
  products: ProductItem[];
  tags: TagItem[];
};

router.get('/search', async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    const allTags = await Tag.find();

    if (!allProducts.length || !allTags.length) {
      return res.status(404).send('No products available');
    }

    const searchData: TSearch = { products: [], tags: [] };

    allProducts.forEach((product: IProduct) => {
      searchData.products.push({
        productId: product._id?.toString()!,
        productName: product.productName,
        images: product.images,
      });
    });

    allTags.forEach((tag: ITag) => {
      searchData.tags.push({
        tagId: tag._id?.toString()!,
        tagName: tag.tagName,
      });
    });

    res.status(200).json(searchData);
  } catch (err) {
    next(err);
  }
});

/**
 * Pull a given product by its ID
 * Comes with related product suggestions
 */

router.get('/:productId', async (req, res, next) => {
  const RELATED_PRODUCTS_COUNT = 8;

  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate({
      path: 'tags',
    });

    if (!product) return res.status(404).send('Product does not exist');
    const tagList = product.tags.map((tag: any) => tag._id);
    // pull 4 products sharing same tag name
    const sameTagProducts = await Product.find(
      {
        tags: { $in: tagList },
        _id: { $ne: product._id },
      },
      {},
      { limit: 4 }
    ).populate('tags');

    let randomProductCount = RELATED_PRODUCTS_COUNT - sameTagProducts.length;

    const differentTagProducts = await Product.find(
      {
        tags: { $nin: tagList },
        _id: { $ne: product._id },
      },
      {},
      { limit: randomProductCount }
    ).populate('tags');

    let relatedProducts = [...sameTagProducts, ...differentTagProducts];

    randomProductCount -= differentTagProducts.length;
    if (randomProductCount > 0) {
      const existingProductList = [
        product._id,
        ...relatedProducts.map((prod) => prod._id),
      ];

      const fallbackProducts = await Product.find(
        {
          _id: {
            $nin: existingProductList,
          },
        },
        {},
        { limit: randomProductCount }
      ).populate('tags');

      relatedProducts = relatedProducts.concat(
        JSON.parse(JSON.stringify(fallbackProducts))
      );
    }

    // console.log(relatedProducts.sort(() => Math.random() - 0.5));

    const combinedProduct = {
      ...JSON.parse(JSON.stringify(product)),
      relatedProducts: relatedProducts.sort(() => Math.random() - 0.5),
    };

    res.status(200).json(combinedProduct);
  } catch (err) {
    next(err);
  }
});

/**
 * * Pull related products
 */

router.get('/:productId/related', async (req, res, next) => {
  try {
    const { productId } = req.params;
    res.send("We haven't written this route yet.");
  } catch (err) {
    next(err);
  }
});

router.post('/', checkAuthenticated, requireAdmin, async (req, res, next) => {
  try {
    const parsedBody = createZodProduct.parse(req.body);
    if (!parsedBody) return res.status(404).send('All fields required');

    const existingTag = await Tag.find({ tagName: parsedBody.tags });

    const tagLookup = existingTag.map((tag: any) => tag.tagName);

    const tagId = existingTag.map((tag: any) => tag.id);
    let newTag;
    for (let tag of parsedBody.tags) {
      if (!tagLookup.includes(tag)) {
        newTag = await Tag.create({ tagName: tag });
        tagId.push(newTag?.id);
      }
    }

    parsedBody.tags = tagId;

    const newProduct = await Product.create(parsedBody);

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/:productId',
  checkAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const parsedBody = updateZodProduct.parse(req.body);
      const existingTag = await Tag.find();
      const incomingTag = parsedBody.tags;
      let updateProduct;
      const tagId = [];
      if (!parsedBody) return res.status(400).send('No fields to update');

      // useless, but i like him
      if (!incomingTag || !incomingTag.length) {
        parsedBody.tags = [];
      }

      const existingTagName: string[] = existingTag.map(
        (tag: any) => tag.tagName
      );

      for (let tag of incomingTag!) {
        if (!existingTagName.includes(tag)) {
          const newTag = await Tag.create({ tagName: tag });
          tagId.push(newTag.id);
        } else {
          const oldTag = existingTag.find((tags: any) => tags.tagName === tag);
          tagId.push(oldTag._id);
        }
      }
      parsedBody.tags = tagId;
      updateProduct = await Product.findOneAndUpdate(
        { _id: productId },
        parsedBody
      );

      res.status(200).json(updateProduct);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:productId',
  checkAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      const deleteProduct = await Product.deleteOne({ _id: productId });
      if (deleteProduct.deletedCount === 0)
        return res
          .status(400)
          .send('Trouble deleting product, it might not exist');

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.use('/:productId/review', reviewRouter);

export default router;
