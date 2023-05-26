import express from 'express';
const router = express.Router({ mergeParams: true });
import reviewRouter from './reviewRouter';
import { Product, Tag } from '../database/index';
import { checkAuthenticated, requireAdmin } from './authMiddleware';
import { z } from 'zod';
import mongoose from 'mongoose';
import { zodProduct } from '../utils';

const createZodProduct = zodProduct.strict();
const updateZodProduct = zodProduct
  .deepPartial()
  .required({ tags: true })
  .strict();

router.get('/', async (req, res, next) => {
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

    const numProds = 9;

    // do something with filterKey
    let productFilter = {};
    if (filterKey !== 'all') {
      productFilter = { tagName: filterKey };
      const filterTag = await Tag.findOne({ tagName: filterKey });
      if (filterTag) {
        productFilter = { tags: filterTag._id };
      } else productFilter = {};
    }

    const skip = (page - 1) * numProds;
    const allProducts = await Product.find(productFilter, null, {
      skip,
      limit: numProds,
      sort: { [sortKey]: sortDir === 'asc' ? 1 : -1 },
    }).populate({ path: 'tags' });

    const countAllProducts = await Product.countDocuments(productFilter);

    if (!allProducts.length) return res.status(404).send('No products found');

    res.status(200).json({ products: allProducts, count: countAllProducts });
  } catch (err) {
    next(err);
  }
});

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

    const relatedProducts = [...sameTagProducts, ...differentTagProducts];

    // product.relatedProducts = relatedProducts;
    const combinedProduct = {
      ...JSON.parse(JSON.stringify(product)),
      relatedProducts: relatedProducts,
    };

    // console.log('sameTagProducts', sameTagProducts);
    // console.log('matching tag:', sameTagProducts.length);
    // pull 4 products from not the same tag name
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
      updateProduct = await Product.updateOne(parsedBody);

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
