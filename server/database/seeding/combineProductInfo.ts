import fs from 'fs';
import type { ImageData, ImageDesc } from '../dbTypes';

const WORKING_DIR = '../../../database/seeding/data/';
console.log('WORKING_DIR', fs.realpathSync(WORKING_DIR));
const OUTPUT_DIR = './';
console.log('OUTPUT_DIR', fs.realpathSync(OUTPUT_DIR));
const OUTPUT_FILENAME = '_combinedProductInfo.json';
// console.log('OUTPUT_FILENAME', fs.realpathSync(OUTPUT_FILENAME));

type FileMetadataInput = {
  productName: string;
  productShortDesc: string;
  productIngredients: string;
  images: string[];
  imageURL: string[];
  imageDesc: ImageDesc[];
  categories: string[];
};

export type FileMetadataOutput = Omit<
  FileMetadataInput,
  'images' | 'imageDesc' | 'imageURL'
> & {
  images: ImageData[];
};

export function combineProductInfo() {
  let files = fs
    .readdirSync(WORKING_DIR)
    .filter((file) => !['_imageDesc.json', OUTPUT_FILENAME].includes(file));

  let res: FileMetadataOutput[] = [];

  for (let file of files) {
    let {
      productName,
      productShortDesc,
      productIngredients,
      imageURL,
      imageDesc,
      categories,
    } = JSON.parse(
      fs.readFileSync(WORKING_DIR + file, { encoding: 'utf8' })
    ) as FileMetadataInput;
    let parsedFile: FileMetadataOutput = {
      productName,
      productShortDesc,
      productIngredients,
      categories,
      images: imageURL.map((image, idx) => {
        return {
          imageURL: image,
          image: image.split('/').pop()!,
          imageDesc: imageDesc[idx],
        };
      }),
    };

    res.push(parsedFile);
  }

  // console.dir(res, { depth: 10 });

  fs.writeFileSync(OUTPUT_DIR + OUTPUT_FILENAME, JSON.stringify(res));
  console.log('output:', fs.realpathSync(OUTPUT_DIR + OUTPUT_FILENAME));
}

combineProductInfo();
