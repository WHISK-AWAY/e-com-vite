import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { IUser, IProduct, ITag, IOrder, IPromo, IReview } from '../../index';
// import { IUser } from '../database/User';
// import { IProduct } from '../database/Product';
// import { ITag } from '../database/Tag';
// import { IOrder } from '../database/Order';
// import { IPromo } from '../database/Promo';
// import { IReview } from '../database/Review'; //you killed tippy toes :( idk what you're talking about

const SKIN_CONCERN_OPTIONS = [
  { value: 'oily skin', label: 'Oily skin' },
  { value: 'aging skin', label: 'Aging skin' },
  { value: 'acne prone skin', label: 'Acne-prone skin' },
  { value: 'normal skin', label: 'Normal skin' },
  { value: 'dry skin', label: 'Dry skin' },
  { value: 'hyperpigmentation', label: 'Hyperpigmentation' },
  { value: 'rosacea', label: 'Rosacea' },
  { value: 'dark circles', label: 'Dark circles' },
  { value: 'enlarged pores', label: 'Enlarged pores' },
  { value: 'dull skin', label: 'Dull skin' },
  { value: 'redness', label: 'Redness' },
  { value: 'clogged pores', label: 'Clogged pores' },
  { value: 'blackheads', label: 'Blackheads' },
  { value: 'fine lines', label: 'Fine lines' },
  { value: 'eczema', label: 'Eczema' },
  { value: 'uneven skin tone', label: 'Uneven skin tone' },
];

/**
 * *USER
 */

export const generateUser = (count: number): Partial<IUser>[] => {
  const users: Partial<IUser>[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const password = 'seeduser';
    const address = {
      address_1: faker.address.streetAddress(),
      address_2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      zip: faker.address.zipCode(),
    };
    const favorites = [
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
    ];
    const cart = {
      products: [
        {
          product: new Types.ObjectId(),
          price: faker.datatype.float({ min: 1, max: 100, precision: 0.01 }),
          qty: faker.datatype.number(2),
        },
      ],
    };
    const role = faker.helpers.arrayElement(['admin', 'user', 'guest']) as
      | 'admin'
      | 'user'
      | 'guest';

    const reviewCount = faker.datatype.number({ min: 0, max: 15 });
    const voteCount = faker.datatype.number({ min: 0, max: 15 });

    users.push({
      firstName,
      lastName,
      email,
      password,
      address,
      favorites,
      cart,
      role,
      reviewCount,
      voteCount,
    });
  }
  return users;
};

/**
 * * PRODUCT
 */

function randomCatImages(num = 10) {
  const images = [];

  for (let i = 0; i < num; i++) {
    images.push(faker.image.cats(300, 300, true));
  }

  return images;
}

export const generateProduct = (count: number): IProduct[] => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const productName = faker.commerce.productName();
    const productIngredients = faker.commerce.productDescription();
    const productShortDesc = faker.lorem.sentence(4);
    const price = faker.datatype.number({ min: 20, max: 70 });
    const qty = faker.datatype.number({ min: 4, max: 20 });
    const imageURL = randomCatImages();
    const tags = [new Types.ObjectId()];
    const saleCount = 0;

    products.push({
      productName,
      productIngredients,
      productShortDesc,
      price,
      qty,
      imageURL,
      tags,
      saleCount,
    });
  }

  return products;
};

/**
 * * TAG
 */

export const tagList = [
  { tagName: 'moisturizers' },
  { tagName: 'oils' },
  { tagName: 'spf' },
  { tagName: 'eye care' },
  { tagName: 'acne' },
  { tagName: 'cleansers' },
  { tagName: 'exfoliators' },
  { tagName: 'essence' },
  { tagName: 'serums' },
  { tagName: 'lip care' },
  { tagName: 'creams' },
];

export const generateTag = (count: number): ITag[] => {
  const tags = [];

  for (let i = 0; i < count; i++) {
    const tagName = faker.helpers.unique(faker.commerce.department);
    tags.push({ tagName });
  }

  return tags;
};

/**
 * * ORDER
 */

export const generateOrder = (count: number): IOrder[] => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    let expDate: any = faker.date.future(4);
    expDate = `${expDate.getMonth() + 1}/${expDate.getFullYear()}`;

    const orderDetails = [
      {
        productId: new Types.ObjectId(),
        productName: faker.commerce.productName(),
        productShortDesc: faker.lorem.sentence(4),
        imageURL: randomCatImages(2),
        price: faker.datatype.float({ min: 20, max: 60, precision: 1 }),
        qty: faker.datatype.number({ min: 1, max: 5 }),
      },
    ];
    const user = {
      userId: faker.datatype.uuid(),
      shippingInfo: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        address_1: faker.address.streetAddress(),
        address_2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zip: faker.address.zipCode(),
      },
      paymentInfo: {
        paymentType: faker.finance.creditCardIssuer(),
        cardNum: faker.finance.creditCardNumber(),
        exp: expDate,
        cvv: faker.finance.creditCardCVV(),
      },
    };
    const promoCode = {
      promoCodeName: faker.random.word(),
      promoCodeRate: faker.datatype.number({
        min: 0.01,
        max: 0.2,
        precision: 0.01,
      }),
    };
    const date = faker.date.recent(20);

    const orderStatus = faker.helpers.arrayElement([
      'pending',
      'confirmed',
      'canceled',
    ]) as 'pending' | 'confirmed' | 'canceled';

    orders.push({
      orderDetails,
      user,
      promoCode,
      date,
      orderStatus,
    });
  }

  return orders;
};

/**
 * * PROMOS
 */

export const generatePromo = (count: number): IPromo[] => {
  const promos = [];

  for (let i = 0; i < count; i++) {
    const promoCodeName = faker.helpers.unique(faker.random.word);
    const promoRate = faker.datatype.number({
      max: 0.2,
      min: 0.02,
      precision: 0.01,
    });

    promos.push({
      promoCodeName,
      promoRate,
    });
  }

  return promos;
};

/**
 * * REVIEW
 */

export const generateReview = (count: number): Partial<IReview>[] => {
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const product = new Types.ObjectId();
    const title = faker.word.conjunction();
    const content = faker.lorem.sentence();
    const date = faker.date.recent();
    const rating = {
      overall: faker.datatype.number({ min: 1, max: 5 }),
      quality: faker.datatype.number({ min: 1, max: 5 }),
      value: faker.datatype.number({ min: 1, max: 5 }),
    };
    const user = faker.datatype.uuid();
    const nickname = faker.internet.userName();
    const verifiedPurchase = faker.datatype.boolean();
    const location = `${faker.address.cityName()},  ${faker.address.stateAbbr()}`;
    const upvote = faker.datatype.number({ min: 0, max: 14 });

    let skinConcernOptions = [];

    for (let i = 0; i < 3; i++) {
      skinConcernOptions.push(
        SKIN_CONCERN_OPTIONS[
          Math.floor(Math.random() * SKIN_CONCERN_OPTIONS.length)
        ]
      );
    }

    reviews.push({
      product,
      title,
      content,
      date,
      rating,
      user,
      nickname,
      location,
      upvote,
      skinConcernOptions,
    });
  }
  return reviews;
};
