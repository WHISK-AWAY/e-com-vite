import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchSingleProduct,
  selectSingleProduct,
} from '../redux/slices/allProductSlice';
import { getUserId, selectAuth } from '../redux/slices/authSlice';
import { addToCart, selectCart } from '../redux/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../redux/slices/userSlice';
import {
  selectReviewState,
  fetchAllReviews,
} from '../redux/slices/reviewSlice';
import Review from './Review';

export default function SingleProduct() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const singleProduct = useAppSelector(selectSingleProduct);
  const allReviews = useAppSelector(selectReviewState);
  const { userId } = useAppSelector(selectAuth);
  const userCart = useAppSelector(selectCart);
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    if (productId) {
      dispatch(getUserId());
      dispatch(fetchSingleProduct(productId));
      dispatch(fetchAllReviews(productId));
    }
  }, [productId]);

  const qtyIncrementor = () => {
    let userQty: number = count;
    const totalQty: number = singleProduct!.qty!;
    if (userQty! >= totalQty) setCount(totalQty);
    else setCount(count + 1);
  };

  const qtyDecrementor = () => {
    let userQty: number = count;
    if (userQty! <= 1) setCount(count);
    else setCount(count - 1);
  };

  const handleClick = () => {
    if (userId && productId)
      dispatch(addToCart({ userId, productId, qty: count }));
  };

  if (!singleProduct) return <p>...Loading</p>;

  const handleFavoriteAdd = () => {
    dispatch(
      addToFavorites({
        userId: userId!,
        productId: singleProduct._id.toString(),
      })
    );
  };

  const handleFavoriteRemove = () => {
    dispatch(
      removeFromFavorites({
        userId: userId!,
        productId: String(singleProduct._id),
      })
    );
  };

  /**
   * * ALL REVIEWS FETCH
   */

  const overallReviewScore = () => {
    let score = 0;
    for (let review of allReviews.reviews) {
      let reviewScore = Object.values(review.rating).reduce(
        (total, rating) => total + rating,
        0
      );
      score += reviewScore / 3;
    }
    return score / allReviews.reviews.length || 0;
  };

  /**
   * * MAIN RENDER
   */
  return (
    <section className="single-product-container">
      <div className="single-product-info">
        <p> {singleProduct.productName.toUpperCase()}</p>
        <img src={singleProduct.imageURL} alt="single product view" />
        <p>{singleProduct.productLongDesc}</p>
        <p>{singleProduct.price}</p>
      </div>
      <div onClick={qtyIncrementor}>+</div>
      <div>{count}</div>
      <div onClick={qtyDecrementor}>-</div>
      <button onClick={handleClick}>add to cart</button>
      <br />
      <button onClick={handleFavoriteAdd}>&lt;3</button>
      <br />
      <button onClick={handleFavoriteRemove}>remove from favorite</button>
      {/* PRODUCT SUGGESTIONS */}
      <section className="product-suggestions">
        <h2>YOU MAY ALSO LIKEEE</h2>
        {singleProduct.relatedProducts.map((prod) => (
          <article className="related-product-card" key={prod._id.toString()}>
            <h3>
              <Link to={`/product/${prod._id}`}>{prod.productName}</Link>
            </h3>
            <img src={prod.imageURL} alt="single product view" />
            {/* <button
              onClick={() =>
                dispatch(
                  addToCart({
                    userId: userId!,
                    productId: prod._id.toString(),
                    qty: 1,
                  })
                )
              }
            >
              Add to cart
            </button> */}
          </article>
        ))}
      </section>
      {/* REVIEWS */}
      <section className="review-container">
        <h1>REVIEWS: {allReviews.reviews.length}</h1>
        <p>average: {overallReviewScore()}</p>
        {allReviews.reviews.map((review) => (
          <Review review={review} key={review._id} />
        ))}
      </section>
    </section>
  );
}
