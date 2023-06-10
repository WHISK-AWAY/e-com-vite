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
import {
  adminDeleteSingleProduct,
  adminFetchAllProducts,
} from '../redux/slices/admin/adminProductsSlice';
import starBlanc from '../../src/assets/icons/star-blanc.svg';
import starFilled from '../../src/assets/icons/star-filled.svg';
import plus from '../../src/assets/icons/circlePlus.svg';
import minus from '../../src/assets/icons/circleMinus.svg';
import heartBlanc from '../../src/assets/icons/heart-blanc.svg';
import heartFilled from '../../src/assets/icons/heart-filled.svg';


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

  useEffect(() => {
    setCount(1);

    if (productId) {
      dispatch(getUserId());
      dispatch(fetchSingleProduct(productId));
      dispatch(fetchAllReviews(productId));
    }
  }, [productId]);

  useEffect(() => {
    if (thisUser._id) {
      const isFav = thisUser.favorites.some(({ _id: favId }) => {
        return favId.toString() === productId;
      });
      // console.log('isFav:', isFav);
      setItemIsFavorited(isFav);
    }
  }, [thisUser, productId]);

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
    <section className='single-product-container w-full  px-12 pt-10'>
      {thisUser.role === 'admin' && (
        <>
          <Link to={`/admin/product/${productId}`} className='pr-2'>
            EDIT
          </Link>

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
      <div className='single-product-container flex w-full'>
        <section className='image-section flex basis-2/5 flex-col items-center pt-14'>
          {/* <img src={h2} className='h-5 ' />
          <img src={h1} className='h-5' /> */}
          {itemIsFavorited ? (
            <div onClick={handleFavoriteRemove}>
              <img src={heartFilled} className='h-5' />
            </div>
          ) : (
            <div onClick={handleFavoriteAdd}>
              <img src={heartBlanc} className='h-5' />
            </div>
          )}
          <img
            src={
              singleProduct.images.find(
                (image) => image.imageDesc === 'product-front'
              )?.imageURL || singleProduct.images[0].imageURL
            }
            alt='single product view'
          />
        </section>

        <section className='product-details flex basis-3/5 flex-col items-center '>
          <div className='product-desc flex flex-col items-center'>
            <h1 className='product-name pb-8 text-[1.5rem] font-federo'>
              {singleProduct.productName.toUpperCase()}
            </h1>

            <div className='star-section flex self-start'>
              <img src={starFilled} className=' h-3' />
              <img src={starFilled} className='h-3' />
              <img src={starFilled} className='h-3' />
              <img src={starFilled} className='h-3' />
              <img src={starFilled} className='h-3' />
              <p className='pl-2 font-grotesque'> {overallReviewScore()}</p>
            </div>

            <div className='flex flex-col items-center text-center'>
              <p className='product-long-desc py-5 text-lg font-grotesque'>
                {/* {singleProduct.productLongDesc} */}
                "Retinol stimulates the synthesis of collagen and elastin to
                combat loss of firmness and wrinkles. This retinol serum visibly
                improves fine lines and smooths skin. 99% naturally derived.
                Vegan. Made in France.", 
              </p>

              <div className='price-counter my-5 flex flex-col items-center'>
                <p className='price font-grotesque font-medium text-lg'>${singleProduct.price}</p>

                <div className='qty-counter mt-4 flex h-fit w-fit items-center gap-2 rounded-full border border-black px-2 py-1'>
                  <div
                    onClick={qtyIncrementor}
                    className='incrementor cursor-pointer'
                  >
                    <img src={plus} className='w-5' />
                  </div>

                  <div className='count px-4 font-grotesque text-lg'>{count}</div>
                  <div onClick={qtyDecrementor}>
                    <img src={minus} className='w-5' />
                  </div>
                </div>
                <br />
                <button
                  onClick={handleClick}
                  className='text-md bg-charcoal px-24 py-2 uppercase text-white rounded-sm font-italiana'
                >
                  add to cart
                </button>
              </div>
            </div>
          </div>

          <div>
            <h1>why we love it(soon to be)</h1>
          </div>

          <br />

          <br />
        </section>
      </div>

      {/* PRODUCT SUGGESTIONS */}
      <section className='product-suggestions'>
        <h2>YOU MAY ALSO LIKEEE</h2>
        {singleProduct.relatedProducts.map((prod) => (
          <article className='related-product-card' key={prod._id.toString()}>
            <h3>
              <Link to={`/product/${prod._id}`}>{prod.productName}</Link>
            </h3>
            <img
              src={
                prod.images.find((image) => image.imageDesc === 'product-front')
                  ?.imageURL || prod.images[0].imageURL
              }
              alt='single product view'
            />
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
