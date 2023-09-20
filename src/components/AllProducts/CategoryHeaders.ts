const RANDOM_IMAGE_COUNT = 28;

const namedImageUrls = {
  cleansers: '/assets/bg-img/category/cleansers01.jpg',
  'exfoliators & peelings': '/assets/bg-img/category/exfoliator01.jpg',
  masks: '/assets/bg-img/category/masks01.jpg',
  spf: '/assets/bg-img/category/spf01.jpg',
  all: '/assets/bg-img/all-prods.jpg',
};

export function getRandomImageUrl() {
  const randomImageNumber = Math.ceil(Math.random() * RANDOM_IMAGE_COUNT);

  // zero-pad a random 2-digit integer
  return `/assets/bg-img/category/random_${('00' + randomImageNumber).slice(
    -2
  )}.jpg`;
}

// Helper functions

// pull a category-specific image if one has been nominated; otherwise,
// provide a randomly-generated one
export function getCategoryImage(categoryName: string): string {
  if (Object.hasOwn(namedImageUrls, categoryName)) {
    return namedImageUrls[categoryName as keyof typeof namedImageUrls];
  } else {
    return randomCategoryImage();
  }
}

export function randomCategoryImage() {
  const randomImageNumber = Math.ceil(Math.random() * RANDOM_IMAGE_COUNT);

  // zero-pad a random 2-digit integer
  return `/assets/bg-img/category/random_${('00' + randomImageNumber).slice(
    -2
  )}.jpg`;
}

// Title map
// Used to manually split the category title such that a certain portion appears on
// top of the image, with the remainder falling alongside the image

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

  return {
    category: categoryName,
    image: getCategoryImage(categoryName),
    splitTitle,
  };
}
