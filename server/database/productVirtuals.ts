import Review from './Review';
import type { IProduct } from './Product';
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
        console.log(
          `Product: ${this.productName}; # reviews: ${reviews.length}`
        );

        if (reviews.length) {
          // find the sum of all those reviews
          for (let review of reviews) {
            console.log('review:', review.rating);
            // productRating.overall += review.rating.overall;
            // productRating.quality += review.rating.quality;
            // productRating.value += review.rating.value;
            productRating = {
              overall: productRating.overall + review.rating.overall,
              quality: productRating.quality + review.rating.quality,
              value: productRating.value + review.rating.value,
            };
          }
          console.log('innerProdRating:', productRating);

          // divide the sum by the count of all those reviews
          // productRating.overall = productRating.overall / reviews.length;
          // productRating.quality = productRating.quality / reviews.length;
          // productRating.value = productRating.value / reviews.length;
          productRating = {
            overall: productRating.overall / reviews.length,
            quality: productRating.quality / reviews.length,
            value: productRating.value / reviews.length,
          };
          console.log('innerProdRating after avg calc:', productRating);
          productRating = productRating;
          return productRating;
        }
      },
      (err) => console.log('promise rejected: ', err)
    )
    .then((productRating) => productRating)
    .catch((err) => console.log(err));
  console.log('productRating before return:', productRating);
  // productRating = { ...productRating, overall: 17 };
  return productRating;

  // return the resulting score
}
