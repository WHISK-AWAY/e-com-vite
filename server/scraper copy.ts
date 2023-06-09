import axios, { AxiosError } from 'axios';
import Downloader from 'nodejs-file-downloader';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { string } from 'zod';

type Metadata = Map<string, Map<string, Set<string>>>;
type ProductMap = Map<string, Set<string>>;

type ParseCollectionParams = {
  collectionQueue: string[];
  productQueue: string[];
  visitedSites: Set<string>;
  metadata: Metadata;
  productMap: ProductMap;
};

type ParseLinksParams = ParseCollectionParams & {
  $: cheerio.CheerioAPI;
  collection: string;
};

export type ScraperCategory = {
  category: string;
  products: ScraperProductData[];
};

export type ScraperProductData = {
  title: string;
  shortDesc: string;
  longDesc: string;
  images: string[];
  imageURLs: string[];
};

const BAD_URLS = [
  '/collections/serums-imperfections',
  '/collections/serums-vegan',
  '/collections/serums-rides',
];

const BASE_URL = 'https://us.typology.com';

type PopulateCollectionImagesParams = Pick<
  ParseLinksParams,
  'metadata' | 'collection'
> & {
  $: cheerio.CheerioAPI;
};

async function parseCollection(params: ParseCollectionParams) {
  const { collectionQueue, productQueue, visitedSites, metadata, productMap } =
    params;
  let currentSite = collectionQueue.shift();

  if (!currentSite) return;

  if (visitedSites.has(currentSite!)) return;
  else visitedSites.add(currentSite);

  let collection = currentSite === '/' ? 'root' : currentSite.split('/')[2];
  console.log('collection:', collection); // ! make sure i'm looking @ the right split

  const { data: collectionSiteData } = await axios.get(
    currentSite[0] === '/' ? BASE_URL + currentSite : currentSite
  );

  const $ = cheerio.load(collectionSiteData);

  parseLinks({
    $,
    collection,
    metadata,
    collectionQueue,
    productQueue,
    visitedSites,
    productMap,
  });

  // TODO: parse collection images
}

function parseLinks(params: ParseLinksParams) {
  const {
    $,
    collection,
    metadata,
    collectionQueue,
    productQueue,
    visitedSites,
  } = params;
  const links = $('a').toArray();

  for (let link of links) {
    let target = link.attribs.href;

    const linkType = target.split('/')[1]; // either 'collection' or 'products' or some other thing we don't care about
    console.log('linkType:', linkType); // ! make sure I'm splitting correctly

    if (visitedSites.has(target)) continue;

    if (linkType === 'collections') {
      handleCollectionLink({ collectionQueue, target, metadata });
    } else if (linkType === 'products') {
      handleProductLink({ metadata, productQueue, target, collection });
    }
  }
}

type HandleCollectionLinkParams = Pick<
  ParseLinksParams,
  'metadata' | 'collectionQueue'
> & {
  target: string;
};

function handleCollectionLink(
  params: Pick<ParseLinksParams, 'metadata' | 'collectionQueue'> & {
    target: string;
  }
) {
  const { metadata, target, collectionQueue } = params;
  collectionQueue.push(target);
  addCollection({ metadata, collectionName: target.split('/')[2] });
}

function addCollection(
  params: Pick<ParseLinksParams, 'metadata'> & { collectionName: string }
) {
  const { metadata, collectionName } = params;
  if (!metadata.has(collectionName)) {
    metadata.set(collectionName, new Map<string, Set<string>>());
  }
}

// function addProduct(params) {
//   const { productMap } = params;
// }

// on a collection page:
// for each link found:
// if the link is to a product:
// add the link to product queue
// if the link contains an image:
// record that image URL under this collection (url segment) / that product (url segment)

// on a product page:
// for each link found:
// if the link is to a product:
// add the link to product queue
// if the link contains an image:
// record that image URL under 'unknown' collection / that product (url segment)
// if the link is to a collection:
// add the link to collection queue
// for each image found (.swiper-wrapper):
// record the image URL under this collection

function handleProductLink(
  params: Pick<ParseLinksParams, 'metadata' | 'productQueue' | 'collection'> & {
    target: string;
  }
) {
  const { metadata, productQueue, target } = params;
  const collection = params.collection || 'unknown';

  productQueue.push(target);

  if (collection === 'unknown' && !metadata.has(collection)) {
    metadata.set(collection, new Map<string, Set<string>>());
  }

  const metadataCollection = metadata.get(collection)!;
  if (!metadataCollection.has(target)) {
    metadataCollection.set(target, new Set<string>());
  }
}

function populateCollectionImages(params: PopulateCollectionImagesParams) {
  const { $, metadata, collection } = params;

  if (!metadata.has(collection)) {
    metadata.set(collection, new Map<string, Set<string>>());
  }

  const imagesAPI = $('img');
  const images = imagesAPI.toArray();
  // const imageLinks;
}

// async function parseProduct(params: ParserParams) {
//   const { collectionQueue, productQueue, visitedSites } = params;
// }

export async function typologyImageScraper() {
  let categoryQueue = ['/'];
  let productQueue: string[] = [];
  let visitedSites = new Set<string>();
  let metadata = new Map() as Metadata;
  let productMap = new Map() as ProductMap;

  while (categoryQueue.length > 0) {
    let currentSite = categoryQueue.shift();
    if (!currentSite || visitedSites.has(currentSite)) continue;

    visitedSites.add(currentSite);

    const { data: categorySiteData } = await axios.get(
      currentSite[0] === '/' ? BASE_URL + currentSite : currentSite
    );

    const $ = cheerio.load(categorySiteData);

    const siteLinks = $('a').toArray();

    for (let link of siteLinks) {
      let href = link.attribs.href;

      const linkType = href.split('/')[1];
      if (visitedSites.has(href)) continue;
      if (linkType === 'collections') {
        categoryQueue.push(href);
        metadata.set(href, new Map<string, Set<string>>());
      } else if (linkType === 'products') {
        console.log('currentSite:', currentSite);
        console.log('link:', href);
        metadata.get(currentSite)!.set(href, new Set<string>());
        productQueue.push(href);
      }
    }

    console.log(JSON.stringify(metadata));
  }
}
