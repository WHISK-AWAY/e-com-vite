import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAllProducts,
  fetchSingleProduct,
  selectSingleProduct,
} from '../../redux/slices/allProductSlice';
import { getUserId, selectAuth } from '../../redux/slices/authSlice';
import { addToCart, selectCart } from '../../redux/slices/cartSlice';
import {
  addToFavorites,
  removeFromFavorites,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import {
  selectReviewState,
  fetchAllReviews,
} from '../../redux/slices/reviewSlice';
import Review from '../Review/Review';
import AddReview from '../Review/AddReview';
import {
  adminDeleteSingleProduct,
  adminFetchAllProducts,
} from '../../redux/slices/admin/adminProductsSlice';
import starBlanc from '../../../src/assets/icons/star-blanc.svg';
import starFilled from '../../../src/assets/icons/star-filled.svg';
import plus from '../../../src/assets/icons/circlePlus.svg';
import minus from '../../../src/assets/icons/circleMinus.svg';
import heartBlanc from '../../../src/assets/icons/heart-blanc.svg';
import heartFilled from '../../../src/assets/icons/heart-filled.svg';
import bgImg from '../../../src/assets/bg-img/pexels-bogdan-krupin-3986706.jpg';
import ProductCarousel from './ProductCarousel';
import StarsBar from '../StarsBar';

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
    return score / allReviews.reviews.length || 0;
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
   * * WRITE A REVIEW
   */

  const handleAddReview = () => {
    setAddReview(true);
  };

  const parseIngredients = () => {
    const text = singleProduct.productIngredients.split('\n');
    // console.log( 'etxt', text)
    let arr = [];
    for (let i = 0; i < text.length; i++) {
      arr.push(text[i].trim().split(':'));
    }

    let evens = [];
    let odds = [];
    for (let i = 0; i < arr.length; i++) {
      if (i % 2) {
        odds.push(arr[i]);
      } else {
        evens.push(arr[i]);
      }
    }
    let res = [];
    for (let i = 0; i < evens.length; i++) {
      res.push(evens[i][0] + ': ' + odds[i][0]);
    }

    return res;
  };

  /**
   * * MAIN RENDER
   */
  return (
    <main className='single-product-main mx-auto mb-40 mt-8 flex min-h-[calc(100vh_-_4rem)] max-w-[calc(100vw_-_20px)] flex-col items-center px-12'>
      <section className='single-product-top-screen mb-11 flex w-full justify-center md:w-full lg:mb-20'>
        {/* <section className='image-section relative flex flex-col items-center pt-14 lg:basis-2/5 xl:basis-[576px]'> */}
        <section className='image-section relative mt-8 flex basis-2/5 flex-col items-center xl:basis-[576px]'>
          {/* <img src={h2} className='h-5 ' />
          <img src={h1} className='h-5' /> */}
          <div className='relative flex w-fit flex-col items-center'>
            {itemIsFavorited ? (
              <div onClick={handleFavoriteRemove} className='w-fit'>
                <img
                  src={heartFilled}
                  className='absolute right-[6%] top-[3.33%] w-3 lg:w-4'
                />
              </div>
            ) : (
              <div onClick={handleFavoriteAdd} className='w-fit'>
                <img
                  src={heartBlanc}
                  className='absolute right-[6%] top-[3.33%] w-3 lg:w-4'
                />
              </div>
            )}
            <div className='w-[230px] lg:w-[300px] xl:min-h-[560px] xl:w-[424px]'>
              <img
                src={
                  singleProduct.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || singleProduct.images[0].imageURL
                }
                alt='single product view'
                className='aspect-[3/4] border  border-charcoal object-cover'
              />
            </div>
            {/* carousel goes here */}
          </div>
        </section>

        <section className='product-details flex max-w-[750px] basis-3/5 flex-col items-center px-12'>
          <div className='product-desc mb-9 flex flex-col items-center'>
            <h1 className='product-name pb-9 font-federo text-[1rem] uppercase'>
              {singleProduct.productName}
            </h1>
            <div className='star-bar-placement self-start'>
              <StarsBar
                score={overallReviewScore()}
                option='count'
                reviewCount={allReviews.reviews.length}
              />
            </div>
            <p className='product-long-desc font-grotesque text-xs lg:text-sm'>
              {singleProduct.productShortDesc} Retinol stimulates the synthesis
              of collagen and elastin to combat loss of firmness and wrinkles.
              This retinol serum visibly improves fine lines and smooths skin.
              99% naturally derived. Vegan. Made in France.
            </p>
          </div>
          <div className='cart-controls mb-24 w-full font-grotesque text-base font-medium lg:mb-28 lg:text-lg'>
            <div className='cart-section flex w-full flex-col items-center text-center'>
              <div className='price-counter flex flex-col items-center'>
                <p className='price font-bold'>${singleProduct.price}</p>

                <div className='qty-counter mb-14 mt-4 flex h-fit w-fit items-center gap-2 rounded-full border border-charcoal px-2'>
                  <div onClick={qtyDecrementor}>
                    <img src={minus} className='w-4' />
                  </div>
                  <div className='count translate-y-[-7%] px-4 text-center'>
                    {count}
                  </div>

                  <div
                    onClick={qtyIncrementor}
                    className='incrementor cursor-pointer'
                  >
                    <img src={plus} className='w-4' />
                  </div>
                </div>
              </div>
              <button
                onClick={handleClick}
                className='w-4/5 max-w-[255px] rounded-sm bg-charcoal py-2 font-italiana text-lg uppercase text-white lg:max-w-[400px] lg:text-2xl'
              >
                add to cart
              </button>
            </div>
          </div>

          <div className='why-we-love-it'>
            <h2 className='mb-4 text-center font-federo text-sm uppercase lg:text-base'>
              why we love it
            </h2>
            <p className='text-center font-grotesque text-xs lg:text-base'>
              CEO 15% Vitamin C Brightening Serum, is targeted to quickly fight
              the look of dullness, dark spots, and discolorations at the
              source, while diminishing the signs of premature aging. Skin looks
              firmer and plumper, as youthful skin bounce and even-tone are
              restored. CEO 15% Vitamin C Brightening Serum, uses a
              sophisticated, ultra-powerful form of Vitamin C called THD
              Ascorbate. Both highly stable and oil-soluble, THD Ascorbate
              rapidly absorbs into the skin for visible anti-aging benefits,
              including visual improvement in loss of firmness, the appearance
              of lines and wrinkles, and dark spots and dullness. This hydrating
              antioxidant formula instantly illuminates the complexion with
              bright radiance, while phytosterols help to reduce the signs of
              skin sensitivity. Saccharide Isomerate extract diminishes the
              appearance of pores and reinforces the skin’s moisture barrier for
              a skin-smoothing glow. Rapidly brighten the appearance of the skin
              and boost vital skin bounce, in a flash!
            </p>
          </div>
        </section>
      </section>
      <section className='ingredients-container mb-20 flex w-full flex-row-reverse justify-center gap-5 lg:mb-24 lg:gap-7'>
        <div className='bg-img basis-3/5 px-4'>
          <img src={bgImg} className='aspect-[2/3] object-cover' />
        </div>
        <div className='ingredients mt-4 flex basis-2/5 flex-col gap-6 lg:mt-6 lg:gap-8'>
          <h3 className='font-aurora text-xl lg:text-2xl'>key ingredients</h3>
          {parseIngredients().map((el) => {
            return (
              <p className='font-grotesque text-base'>
                <span className='font-grotesque font-xbold uppercase'>
                  {el.split(':')[0]}:
                </span>
                {el.split(':')[1]}
              </p>
            );
          })}
        </div>
      </section>

      {/* // * PRODUCT SUGGESTIONS */}
      <section className='product-suggestions mb-20 flex flex-col items-center lg:mb-24'>
        <h2 className='mb-5 font-marcellus text-2xl lg:mb-8 lg:text-4xl'>
          YOU MAY ALSO LIKE
        </h2>
        <ProductCarousel products={singleProduct.relatedProducts} num={4} />
      </section>

      {/* REVIEWS */}
      <section className='review-container flex w-full flex-col border-t border-charcoal pt-8 lg:pt-10'>
        <h2 className='font-gayathri text-[4.25rem] lg:text-[5.7rem]'>
          REVIEWS
        </h2>
        {allReviews.reviews.length > 0 ? (
          <>
            <div className='star-bar-placement'>
              <StarsBar
                score={overallReviewScore()}
                reviewCount={allReviews.reviews.length}
              />
            </div>
            {!allReviews.reviews
              .map((review) => review.user._id)
              .includes(userId!) && (
              <div className='add-review-container mb-12 self-end lg:mb-20'>
                <button
                  className='rounded-sm border border-charcoal px-6 py-2 font-italiana text-sm uppercase lg:px-8 lg:text-base'
                  onClick={handleAddReview}
                >
                  write a review
                </button>
                {addReview && (
                  <AddReview
                    productId={productId!}
                    product={singleProduct}
                    setAddReview={setAddReview}
                  />
                )}
              </div>
            )}
            <div className='reviews-wrapper flex w-full flex-col items-center gap-4 lg:gap-6'>
              {allReviews.reviews.map((review, idx) => (
                <Review
                  review={review}
                  key={review._id}
                  last={allReviews.reviews.length - 1 === idx}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className='add-review-container mb-12 self-end'>
              {!addReview ? (
                <>
                  <p>No reviews yet...be the first to leave one!</p>{' '}
                  <button
                    className='rounded-sm border border-charcoal px-6 py-2 font-italiana text-sm uppercase'
                    onClick={handleAddReview}
                  >
                    write a review
                  </button>
                </>
              ) : (
                <AddReview
                  productId={productId!}
                  product={singleProduct}
                  setAddReview={setAddReview}
                />
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

{
  /*{thisUser.role === 'admin' && (
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
          )}*/
}

{
  /*{singleProduct.relatedProducts.map((prod) => (
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
            ))}*/
}
