import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchAllProducts,
  fetchSingleProduct,
  selectSingleProduct,
} from '../redux/slices/allProductSlice';
import { getUserId, selectAuth } from '../redux/slices/authSlice';
import { addToCart, selectCart } from '../redux/slices/cartSlice';
import {
  addToFavorites,
  removeFromFavorites,
  selectSingleUser,
} from '../redux/slices/userSlice';
import {
  selectReviewState,
  fetchAllReviews,
} from '../redux/slices/reviewSlice';
import Review from './Review/Review';
import AddReview from './Review/AddReview';
import { adminDeleteSingleProduct, adminFetchAllProducts } from '../redux/slices/admin/productsSlice';

export default function SingleProduct() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const singleProduct = useAppSelector(selectSingleProduct);
  const allReviews = useAppSelector(selectReviewState);
  const { user: thisUser } = useAppSelector(selectSingleUser);
  const { userId } = useAppSelector(selectAuth);
  const userCart = useAppSelector(selectCart);
  const [count, setCount] = useState<number>(1);
  const [itemIsFavorited, setItemIsFavorited] = useState(false);
  const [addReview, setAddReview] = useState<boolean>(false);
  const navigate = useNavigate();

  // console.log('user', thisUser)

  useEffect(() => {
    setCount(1);

    if (productId) {
      dispatch(getUserId());
      dispatch(fetchSingleProduct(productId));
      dispatch(fetchAllReviews(productId));
    }
  }, [productId]);

  useEffect(() => {
    // console.log('thisUser', thisUser);

    if (thisUser._id) {
      // console.log('favorites:', thisUser.favorites);
      const isFav = thisUser.favorites.some(({ _id: favId }) => {
        return favId.toString() === productId;
      });
      // console.log('isFav:', isFav);
      setItemIsFavorited(isFav);
    }
  }, [thisUser, productId]);

  // console.log('item is favorited?', itemIsFavorited);

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
    if (userId && productId) {
      dispatch(addToCart({ userId, productId, qty: count }));
    }
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
    return (score / allReviews.reviews.length || 0).toFixed(1);
  };

  const qualityAndValueAvg = () => {
    let quality = 0;
    let value = 0;

    if (!allReviews.reviews.length) return { quality: 0, value: 0 };
    for (let review of allReviews.reviews) {
      value += review.rating.value;
      quality += review.rating.quality;
    }

    return {
      quality: Math.floor(quality / allReviews.reviews.length).toFixed(),
      value: (value / allReviews.reviews.length).toFixed(),
    };
  };
  /**
   * * WRITE A REVEIW
   */

  const handleAddReview = () => {
    setAddReview(true);
  };

  /**
   * * MAIN RENDER
   */
  return (
    <section className='single-product-container'>
      {thisUser.role === 'admin' && (
        <>
          <Link to={`/admin/product/${productId}`} className='pr-2'>EDIT</Link>

          <button
            onClick={async () => {
              await dispatch(adminDeleteSingleProduct(productId!));
              navigate('/shop-all');
            }}
          >
            DELETE
          </button>
              </>
        )}
      <div className='single-product-info'>
        <p> {singleProduct.productName.toUpperCase()}</p>
        <img src={singleProduct.imageURL} alt='single product view' />
        <p>{singleProduct.productLongDesc}</p>
        <p>{singleProduct.price}</p>
      </div>
      <button onClick={qtyIncrementor}>+</button>
      <div>{count}</div>
      <button onClick={qtyDecrementor}>-</button>
      <br />
      <button onClick={handleClick}>add to cart</button>
      <br />
      {itemIsFavorited ? (
        <button onClick={handleFavoriteRemove}>&lt;/3</button>
      ) : (
        <button onClick={handleFavoriteAdd}>&lt;3</button>
      )}
      <br />

      {/* PRODUCT SUGGESTIONS */}
      <section className='product-suggestions'>
        <h2>YOU MAY ALSO LIKEEE</h2>
        {singleProduct.relatedProducts.map((prod) => (
          <article className='related-product-card' key={prod._id.toString()}>
            <h3>
              <Link to={`/product/${prod._id}`}>{prod.productName}</Link>
            </h3>
            <img src={prod.imageURL} alt='single product view' />
          </article>
        ))}
      </section>

      {/* REVIEWS */}
      <section className='review-container'>
        <h1>REVIEWS: ({allReviews.reviews.length})</h1>
        <h2>average customer rating:</h2>
        <p>average overall: {overallReviewScore()}</p>

        {allReviews.reviews.length ? (
          <div>
            <p>average value: {qualityAndValueAvg().value || 0}</p>
            <p>average quality: {qualityAndValueAvg().quality || 0}</p>
          </div>
        ) : (
          ''
        )}
        {allReviews.reviews.map((review) => (
          <Review review={review} key={review._id} />
        ))}
        {!allReviews.reviews
          .map((review) => review.user._id)
          .includes(userId!) ? (
          <>
            <button onClick={handleAddReview}>write a review</button>
            {addReview && (
              <AddReview
                productId={productId!}
                product={singleProduct}
                setAddReview={setAddReview}
              />
            )}
          </>
        ) : (
          ''
        )}
      </section>
    </section>
  );
}
