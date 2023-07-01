import fs from 'fs';
import { fileURLToPath } from 'url';
import Downloader from 'nodejs-file-downloader';
import productData from './_combinedProductInfo.json';

const OUTPUT_DIR_BASE = '../src/public/assets/';
export const output_dir = {
  jpg: 'productImages',
  jpeg: 'productImages',
  png: 'productImages',
  mp4: 'productVideos',
  gif: 'productGifs',
};

async function imageDownloader() {
  let counter = 0;
  const max_downloads = Infinity;

  for (let prod of productData) {
    for (let img of prod.images) {
      if (counter < max_downloads) {
        let fileExtension = img.imageURL
          .split('.')
          .at(-1) as keyof typeof output_dir;

        if (!(fileExtension in output_dir)) {
          console.log(img.imageURL);
          continue;
        }

        let url = img.imageURL;
        const downloader = new Downloader({
          url,
          directory: OUTPUT_DIR_BASE + output_dir[fileExtension],
          skipExistingFileName: true,
        });

        try {
          let res = await downloader.download();
          if (res.downloadStatus !== 'ABORTED') {
            console.log('downloaded', url);
          }
          counter += 1;
        } catch (err) {
          console.log('downloader error ~~~~~~~~~~~~~~~~~~~~~~~~~');
          console.log(err);
        }
      } else return;
    }
  }
}

// http://localhost:5173/assets/productImages/serum_blanc.mp4

if (require.main?.filename.split('/').at(-1) === 'imageDownloader.js') {
  imageDownloader();
}
