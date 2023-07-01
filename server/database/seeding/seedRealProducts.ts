import type { FileMetadataOutput } from './combineProductInfo';
import { Product, Tag, ITag } from '../index';
import type { IProduct, ImageData } from '../dbTypes';
import mongoose from 'mongoose';
import productMetadata from './_combinedProductInfo.json';
import { output_dir } from './imageDownloader';

function randomTags(tagArray: ITag[], count: number) {
  let res: mongoose.Types.ObjectId[] = [];
  let tags = [...tagArray];

  while (res.length < count) {
    let randomIdx = Math.floor(Math.random() * tags.length);
    res.push(tags.splice(randomIdx, 1)[0]._id!);
  }

  return res;
}

export async function seedRealProducts() {
  // const productMetadata: FileMetadataOutput[] = require('./_combinedProductInfo.json'); //! replaced w/import statement...can delete this if things turn out OK

  const productsToCreate: IProduct[] = [];

  const tags: ITag[] = await Tag.find();

  for (let product of productMetadata) {
    if (!product.productIngredients) console.log('NO INGREDIENTS:', product);

    if (!product.images || product.images.length === 0) {
      throw new Error('something to do with images');
    }

    let newProduct: IProduct = {
      productName: product.productName,
      productShortDesc: product.productShortDesc,
      productIngredients: product.productIngredients.trim(),
      price: Math.floor(Math.random() * (60 - 30) + 30),
      qty: Math.floor(Math.random() * (50 - 1) + 1),
      saleCount: 0,
      images: product.images as ImageData[],
      tags: product.categories
        .map(
          (cat) =>
            tags.find((tag) => tag.tagName.toLowerCase() === cat.toLowerCase())
              ?._id
        )
        .filter((cat) => cat !== undefined) as mongoose.Types.ObjectId[],
    };

    // convert hosted URL to public assets folder reference
    for (let img of newProduct.images) {
      let filename = img.imageURL.split('/').at(-1);
      let fileExtension = filename
        ?.split('.')
        .at(-1) as keyof typeof output_dir;
      if (!fileExtension) continue;

      img.imageURL = `/assets/${output_dir[fileExtension]}/${filename}`;
    }

    productsToCreate.push(newProduct);
  }

  return await Product.insertMany(productsToCreate);
}
