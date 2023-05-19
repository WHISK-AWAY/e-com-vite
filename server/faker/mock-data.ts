import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import {
  IUser,
  IProduct,
  ITag,
  IOrder,
  IPromo,
  IReview,
} from '../database/index';
// import { IUser } from '../database/User';
// import { IProduct } from '../database/Product';
// import { ITag } from '../database/Tag';
// import { IOrder } from '../database/Order';
// import { IPromo } from '../database/Promo';
// import { IReview } from '../database/Review'; //you killed tippy toes :( idk what you're talking about

const SKIN_CONCERNS = [
  'oily skin',
  'aging skin',
  'acne prone skin',
  'normal skin',
  'dry skin',
  'sensitive skin',
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
    const password = faker.internet.password(8);
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
    const skinConcerns = faker.helpers.arrayElements(SKIN_CONCERNS, 2);

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
      skinConcerns,
    });
  }
  return users;
};

/**
 * * PRODUCT
 */

export const generateProduct = (count: number): IProduct[] => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const productName = faker.commerce.productName();
    const productLongDesc = faker.commerce.productDescription();
    const productShortDesc = faker.lorem.sentence(4);
    const brand = faker.company.name();
    const price = faker.datatype.float({ min: 20, max: 1000, precision: 0.01 });
    const qty = faker.datatype.number({ min: 4, max: 20 });
    const imageURL = faker.image.cats(300, 300, true);
    const tags = [new Types.ObjectId()];

    products.push({
      productName,
      productLongDesc,
      productShortDesc,
      brand,
      price,
      qty,
      imageURL,
      tags,
    });
  }

  return products;
};

/**
 * * TAG
 */

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
    let expDate:any = faker.date.future(4);
    expDate = `${expDate.getMonth()+1}/${expDate.getFullYear()}`

    const orderDetails = [
      {
        productId: new Types.ObjectId(),
        productName: faker.commerce.productName(),
        productLongDesc: faker.commerce.productDescription(),
        productShortDesc: faker.lorem.sentence(4),
        brand: faker.company.name(),
        imageURL: faker.image.cats(),
        price: faker.datatype.float({ min: 20, max: 1000, precision: 0.01 }),
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
    });
  }
  return reviews;
};
