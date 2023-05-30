import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import Downloader from 'nodejs-file-downloader';
// import fs from 'fs' // TODO: read filesystem to avoid downloading duplicates

const BAD_URLS = [
  '/collections/serums-imperfections',
  '/collections/serums-vegan',
  '/collections/serums-rides',
];

export async function typologyVideoScraper() {
  let visitedSites = new Set();
  let visitedVideos = new Set();
  let q = ['https://us.typology.com/'];

  while (q.length) {
    let currentSite = q.shift();

    if (visitedSites.has(currentSite) || currentSite == null) {
      console.log('already been here - skipping...');
      continue;
    }

    try {
      // pull current site w/axios
      const { data } = await axios.get(currentSite);
      const $ = cheerio.load(data);
      let linkArray = $('a').toArray();

      for (let link of linkArray) {
        let href = link.attribs.href;
        let branch = href.split('/')[1];
        if (
          branch === 'collections' &&
          !visitedSites.has(href) &&
          !BAD_URLS.includes(href)
        ) {
          visitedSites.add(href);
          q.push('https://us.typology.com' + href);
        }
      }

      let vidArray = $('video').toArray();

      for (let vid of vidArray) {
        // console.log('vid:', vid);
        if (!vid.attribs['data-twic-src']) continue;
        let src = vid.attribs['data-twic-src'].split('?')[0];

        // gifs start with "image:"
        let vidUrl = '';
        if (src.split(':')[0] === 'image') {
          // gif -- need to add https://media.typology.com/ to beginning of URL
          vidUrl = 'https://media.typology.com/' + src.split(':')[1];
        } else {
          // not a gif -- use URL as-is
          vidUrl = src;
          console.log('vidUrl:', vidUrl);
        }

        if (vidUrl.includes('video-storyblok') && !visitedVideos.has(vidUrl)) {
          visitedVideos.add(vidUrl);

          const downloader = new Downloader({
            url: vidUrl,
            directory: './server/scraperImages/typology/videos',
            cloneFiles: false,
          });

          await downloader.download();
        }
      }
    } catch (err) {
      // err
      console.log(
        'ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR'
      );
      console.log(err);
    }
  }

  console.log('logged videos:', visitedVideos);
}

export async function typologyImageScraper() {
  let visitedSites = new Set();
  let visitedImages = new Set();
  let q = ['https://us.typology.com/'];
  while (q.length) {
    let currentSite = q.shift();

    if (visitedSites.has(currentSite) || currentSite == null) {
      console.log('already been here - skipping...');
      continue;
    }

    try {
      console.log('fetching ' + currentSite);
      const { data } = await axios.get(currentSite);
      const $ = cheerio.load(data);
      let linkArray = $('a').toArray();
      for (let link of linkArray) {
        let href = link.attribs.href;
        let branch = href.split('/')[1];
        if (
          branch === 'collections' &&
          !visitedSites.has(href) &&
          !BAD_URLS.includes(href)
        ) {
          visitedSites.add(href);
          q.push('https://us.typology.com' + href);
          // console.log('https://us.typology.com' + href);
        }
      }

      let imgArray = $('img').toArray();

      for (let img of imgArray) {
        let src = img.attribs.src.split('?')[0];

        if (src.includes('storyblok') && !visitedImages.has(src)) {
          visitedImages.add(src);

          const downloader = new Downloader({
            url: img.attribs.src.split('?')[0],
            directory: './server/scraperImages/typology',
            cloneFiles: false,
          });

          await downloader.download();

          // const downloadReport = await downloader.download();
          // console.log('downloadReport', downloadReport);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError && err.status === 404) {
        console.log('404 at ' + err.request.path);
      }
      continue;
    }
  }

  console.log('Sites visited: ', visitedSites);
  console.log('Images downloaded: ', visitedImages);
}

// typologyImageScraper();
// typologyVideoScraper();
