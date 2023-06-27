import type { FileMetadataOutput } from './combineProductInfo';
import { Product, Tag, ITag } from '../index';
import type { IProduct } from '../dbTypes';
import mongoose from 'mongoose';

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
  const productMetadata: FileMetadataOutput[] = require('./_combinedProductInfo.json');

  const productsToCreate: IProduct[] = [];

  const tags: ITag[] = await Tag.find();

  for (let product of productMetadata) {
    let tagIDs = randomTags(tags, 3);
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
      images: product.images,
      tags: tagIDs,
    };

    productsToCreate.push(newProduct);
  }

  return await Product.insertMany(productsToCreate);
}

// seedRealProducts();
