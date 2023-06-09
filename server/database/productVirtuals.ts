import Review from './Review';
import type { IProduct } from './dbTypes';
import { promise } from 'zod';

export type TProductRating = {
  overall: number;
  quality: number;
  value: number;
};
// ! switch from async/await to promise chaining
export function averageRating(this: IProduct) {
  // find all reviews for this product

  let productRating: TProductRating = {
    overall: 0,
    quality: 0,
    value: 0,
  };

  // const productReviews = await Review.find({ product: this._id });
  Review.find({ product: this._id })
    .then(
      (reviews) => {
        // console.log('averageRating virtual');

        if (reviews.length) {
          // find the sum of all those reviews
          for (let review of reviews) {
            // productRating.overall += review.rating.overall;
            // productRating.quality += review.rating.quality;
            // productRating.value += review.rating.value;
            productRating = {
              overall: productRating.overall + review.rating.overall,
              quality: productRating.quality + review.rating.quality,
              value: productRating.value + review.rating.value,
            };
          }

          // divide the sum by the count of all those reviews
          // productRating.overall = productRating.overall / reviews.length;
          // productRating.quality = productRating.quality / reviews.length;
          // productRating.value = productRating.value / reviews.length;
          productRating = {
            overall: productRating.overall / reviews.length,
            quality: productRating.quality / reviews.length,
            value: productRating.value / reviews.length,
          };
          productRating = productRating;
          return productRating;
        }
      },
      (err) => console.log('promise rejected: ', err)
    )
    .then((productRating) => productRating)
    .catch((err) => console.log(err));
  // productRating = { ...productRating, overall: 17 };
  return productRating;

  // return the resulting score
}
