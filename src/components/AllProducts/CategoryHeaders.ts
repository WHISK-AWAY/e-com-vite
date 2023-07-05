// Named image imports
import cleanser from '../../assets/bg-img/category/cleansers01.jpg';
import exfoliator from '../../assets/bg-img/category/exfoliator01.jpg';
import mask from '../../assets/bg-img/category/masks01.jpg';
import spf from '../../assets/bg-img/category/spf01.jpg';
import allProductsBG from '../../assets/bg-img/all-prods.jpg';

const namedImages = {
  cleansers: cleanser,
  'exfoliators & peelings': exfoliator,
  masks: mask,
  spf: spf,
  all: allProductsBG,
};

// Random images

import random_01 from '../../assets/bg-img/category/random_01.jpg';
import random_02 from '../../assets/bg-img/category/random_02.jpg';
import random_03 from '../../assets/bg-img/category/random_03.jpg';
import random_04 from '../../assets/bg-img/category/random_04.jpg';
import random_05 from '../../assets/bg-img/category/random_05.jpg';
import random_06 from '../../assets/bg-img/category/random_06.jpg';
import random_07 from '../../assets/bg-img/category/random_07.jpg';
import random_08 from '../../assets/bg-img/category/random_08.jpg';
import random_09 from '../../assets/bg-img/category/random_09.jpg';
import random_10 from '../../assets/bg-img/category/random_10.jpg';
import random_11 from '../../assets/bg-img/category/random_11.jpg';
import random_12 from '../../assets/bg-img/category/random_12.jpg';
import random_13 from '../../assets/bg-img/category/random_13.jpg';
import random_14 from '../../assets/bg-img/category/random_14.jpg';
import random_15 from '../../assets/bg-img/category/random_15.jpg';
import random_16 from '../../assets/bg-img/category/random_16.jpg';
import random_17 from '../../assets/bg-img/category/random_17.jpg';
import random_18 from '../../assets/bg-img/category/random_18.jpg';
import random_19 from '../../assets/bg-img/category/random_19.jpg';
import random_20 from '../../assets/bg-img/category/random_20.jpg';
import random_21 from '../../assets/bg-img/category/random_21.jpg';
import random_22 from '../../assets/bg-img/category/random_22.jpg';
import random_23 from '../../assets/bg-img/category/random_23.jpg';
import random_24 from '../../assets/bg-img/category/random_24.jpg';
import random_25 from '../../assets/bg-img/category/random_25.jpg';
import random_26 from '../../assets/bg-img/category/random_26.jpg';
import random_27 from '../../assets/bg-img/category/random_27.jpg';
import random_28 from '../../assets/bg-img/category/random_28.jpg';

const randomImages = [
  random_01,
  random_02,
  random_03,
  random_04,
  random_05,
  random_06,
  random_07,
  random_08,
  random_09,
  random_10,
  random_11,
  random_12,
  random_13,
  random_14,
  random_15,
  random_16,
  random_17,
  random_18,
  random_19,
  random_20,
  random_21,
  random_22,
  random_23,
  random_24,
  random_25,
  random_26,
  random_27,
  random_28,
];

// Helper functions

export function getCategoryImage(categoryName: string): string {
  if (Object.hasOwn(namedImages, categoryName)) {
    return namedImages[categoryName as keyof typeof namedImages];
  } else {
    return randomCategoryImage();
  }
}

function randomCategoryImage() {
  const idx = Math.floor(Math.random() * randomImages.length);
  return randomImages[idx];
}

// Title map

const baseStyles = 'absolute right-0 whitespace-nowrap';
const leftStyles = baseStyles + ' ' + 'text-white';
const rightStyles = baseStyles + ' ' + 'translate-x-full';
const twoLinerStyles = 'top-14 lg:top-20 2xl:top-28'; // Additional styles for when we need to wrap a title onto a second line.

const categorySplitTitles = {
  all: `<span class='${leftStyles}'>all</span><span class='${rightStyles}'>products</span>`,
  moisturizers: `<span class='${leftStyles}'>moistu</span><span class='${rightStyles}'>rizers</span>`,
  body: `<span class='${leftStyles}'>bo</span><span class='${rightStyles}'>dy</span>`,
  face: `<span class='${leftStyles}'>fa</span><span class='${rightStyles}'>ce</span>`,
  oils: `<span class='${leftStyles}'>oi</span><span class='${rightStyles}'>ls</span>`,
  'tinted care': `<span class='${leftStyles}'>tinted</span><span class='${rightStyles}'>care</span>`,
  spf: `<span class='${leftStyles}'>summer</span><span class='${rightStyles}'>care</span>`,
  masks: `<span class='${leftStyles}'>mas</span><span class='${rightStyles}'>ks</span>`,
  'nighttime skincare': `<span class='${leftStyles}'>night</span><span class='${rightStyles}'>time</span><span class='${baseStyles} ${twoLinerStyles} text-white'>skincare</span>`,
  'eye care': `<span class='${leftStyles}'>eye</span><span class='${rightStyles}'>care</span>`,
  acne: `<span class='${leftStyles}'>ac</span><span class='${rightStyles}'>ne</span>`,
  cleansers: `<span class='${leftStyles}'>clean</span><span class='${rightStyles}'>sers</span>`,
  'exfoliators & peelings': `<span class='${leftStyles}'>exfolia</span><span class='${rightStyles}'>tors &amp;</span><span class='${baseStyles} ${twoLinerStyles} text-white'>peelings</span>`,
  essences: `<span class='${leftStyles}'>esse</span><span class='${rightStyles}'>nces</span>`,
  serums: `<span class='${leftStyles}'>ser</span><span class='${rightStyles}'>ums</span>`,
  'lip care': `<span class='${leftStyles}'>lip</span><span class='${rightStyles}'>care</span>`,
  creams: `<span class='${leftStyles}'>cre</span><span class='${rightStyles}'>ams</span>`,
  toners: `<span class='${leftStyles}'>ton</span><span class='${rightStyles}'>ers</span>`,
};

// * Main header function

export type CategoryHeaderInfo = {
  category: string;
  image: string;
  splitTitle: string;
};

export function getCategoryHeaderInfo(
  categoryNameInput: string
): CategoryHeaderInfo {
  let splitTitle = '';
  const categoryName = categoryNameInput.toLowerCase();

  if (Object.hasOwn(categorySplitTitles, categoryName)) {
    splitTitle =
      categorySplitTitles[categoryName as keyof typeof categorySplitTitles];
  } else {
    const midpoint = Math.floor(categoryName.length / 2);
    const left = categoryName.slice(0, midpoint);
    const right = categoryName.slice(midpoint);

    splitTitle = `<span className=${leftStyles}>${left}</span><span className=${rightStyles}>${right}</span>`;
  }

  const headerInfo: CategoryHeaderInfo = {
    category: categoryName,
    image: getCategoryImage(categoryName),
    splitTitle,
  };

  return headerInfo;
}
