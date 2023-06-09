import fs from 'fs';

const WORKING_DIR = '../../../../src/assets/fuck me/';
console.log('WORKING_DIR', fs.realpathSync(WORKING_DIR));
const OUTPUT_DIR = './';
console.log('OUTPUT_DIR', fs.realpathSync(OUTPUT_DIR));
const OUTPUT_FILENAME = '_combinedProductInfo.json';
// console.log('OUTPUT_FILENAME', fs.realpathSync(OUTPUT_FILENAME));

type ImageDesc =
  | 'product-front'
  | 'product-close'
  | 'product-packaging-back'
  | 'product-texture'
  | 'video-usage';

type FileMetadataInput = {
  productName: string;
  productShortDesc: string;
  productIngredients: string;
  images?: string[];
  imageURL: string[];
  imageDesc: ImageDesc[];
};

export type FileMetadataOutput = Omit<
  FileMetadataInput,
  'images' | 'imageDesc'
> & {
  images: {
    image: string;
    imageURL: string;
    imageDesc: string;
  }[];
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
    } = JSON.parse(
      fs.readFileSync(WORKING_DIR + file, { encoding: 'utf8' })
    ) as FileMetadataInput;
    let parsedFile: FileMetadataOutput = {
      productName,
      productShortDesc,
      productIngredients,
      imageURL,
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
