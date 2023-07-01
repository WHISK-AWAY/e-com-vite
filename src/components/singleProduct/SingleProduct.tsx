import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleProduct,
  selectSingleProduct,
} from '../../redux/slices/allProductSlice';
import { getUserId, selectAuth } from '../../redux/slices/authSlice';
import { addToCart } from '../../redux/slices/cartSlice';
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
import plus from '../../../src/assets/icons/circlePlus.svg';
import minus from '../../../src/assets/icons/circleMinus.svg';
import heartBlanc from '../../../src/assets/icons/heart-blanc.svg';
import heartFilled from '../../../src/assets/icons/heart-filled.svg';
import ProductCarousel from './ProductCarousel';
import StarsBar from '../StarsBar';
import ImageCarousel from './ImageCarousel';

// * background images
import lemons from '../../../src/assets/bg-img/ingredient-bg/lemon-slice.jpg';
import coconut from '../../../src/assets/bg-img/ingredient-bg/coconut.jpg';
import bee from '../../../src/assets/bg-img/ingredient-bg/bee.jpg';
import flaxSpoons from '../../../src/assets/bg-img/ingredient-bg/flax-spoons.jpg';
import olives from '../../../src/assets/bg-img/ingredient-bg/hand-olives.jpg';
import honeyDrip from '../../../src/assets/bg-img/ingredient-bg/honey-drip.jpg';
import slicedCitrus from '../../../src/assets/bg-img/ingredient-bg/sliced-citrus.jpg';
import agave from '../../../src/assets/bg-img/ingredient-bg/agave-2.jpg';
import raspberry from '../../../src/assets/bg-img/ingredient-bg/green-raspberry.jpg';
import peonies from '../../../src/assets/bg-img/ingredient-bg/close-peonies.jpg';
import honeycomb from '../../../src/assets/bg-img/ingredient-bg/honeycomb.jpg';
import agaveAbstract from '../../../src/assets/bg-img/ingredient-bg/agave-abstract.jpg';
import aloeDew from '../../../src/assets/bg-img/ingredient-bg/aloe-dew.jpg';
import aloeGel from '../../../src/assets/bg-img/ingredient-bg/aloe-gel.jpg';
import closeFlower from '../../../src/assets/bg-img/ingredient-bg/close-flower.jpg';
import closePeonies from '../../../src/assets/bg-img/ingredient-bg/close-peonies.jpg';
import coffee from '../../../src/assets/bg-img/ingredient-bg/coffee.jpg';
import agave2 from '../../../src/assets/bg-img/ingredient-bg/agave-2.jpg';
import daisies from '../../../src/assets/bg-img/ingredient-bg/daisies.jpg';
import floatingFlowers from '../../../src/assets/bg-img/ingredient-bg/floating-flowers.jpg';
import flowerSpike from '../../../src/assets/bg-img/ingredient-bg/flower-spike.jpg';
import gingerPlate from '../../../src/assets/bg-img/ingredient-bg/ginger-plate.jpg';
import greenRaspberry from '../../../src/assets/bg-img/ingredient-bg/green-raspberry.jpg';
import handfulOfRaspberries from '../../../src/assets/bg-img/ingredient-bg/handful-of-raspberries.jpg';
import iceFlowers from '../../../src/assets/bg-img/ingredient-bg/ice-cube-flowers.jpg';
import littleWFlowers from '../../../src/assets/bg-img/ingredient-bg/little-purple-flowers.jpg';
import littlePFlowers from '../../../src/assets/bg-img/ingredient-bg/little-purple-flowers.jpg';
import pinkFlowerBunch from '../../../src/assets/bg-img/ingredient-bg/pink-flower-bunch.jpg';
import poppies from '../../../src/assets/bg-img/ingredient-bg/poppies.jpg';
import purpleFlowers from '../../../src/assets/bg-img/ingredient-bg/purple-flowers.jpg';
import tomatoes from '../../../src/assets/bg-img/ingredient-bg/tomatoes.jpg';
import turmeric from '../../../src/assets/bg-img/ingredient-bg/turmeric.jpg';
import whiteFlowers from '../../../src/assets/bg-img/ingredient-bg/white-flowers.jpg';
import coconuts from '../../../src/assets/bg-img/ingredient-bg/coconuts.jpg';
import papaya from '../../../src/assets/bg-img/ingredient-bg/papaya.jpg';
import smallFlowers from '../../../src/assets/bg-img/ingredient-bg/small-flowers.jpg';

// * test vid
import flowerShower from '../../../src/assets/vid/flower_shower.mp4';
import grapeLady from '../../../src/assets/vid/some-lady-twirling-grapes.mp4';
import flowerCloseUp from '../../../src/assets/vid/flower_closeup.mp4';
import honey from '../../../src/assets/vid/honey_dipper.mp4';

const bgImgs = [
  smallFlowers,
  coconuts,
  tomatoes,
  coffee,
  turmeric,
  whiteFlowers,
  poppies,
  purpleFlowers,
  pinkFlowerBunch,
  littlePFlowers,
  littleWFlowers,
  iceFlowers,
  handfulOfRaspberries,
  greenRaspberry,
  gingerPlate,
  flowerSpike,
  floatingFlowers,
  daisies,
  lemons,
  coconut,
  bee,
  flaxSpoons,
  olives,
  honeyDrip,
  slicedCitrus,
  agave,
  raspberry,
  peonies,
  honeycomb,
  agaveAbstract,
  agave2,
  aloeDew,
  aloeGel,
  closeFlower,
  closePeonies,
];

const bgVids = [flowerShower, grapeLady, flowerCloseUp, honey];

export default function SingleProduct() {
  const reviewSection = useRef<HTMLDivElement>(null);
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const singleProduct = useAppSelector(selectSingleProduct);
  const allReviews = useAppSelector(selectReviewState);
  const { user: thisUser } = useAppSelector(selectSingleUser);
  const { userId } = useAppSelector(selectAuth);

  const [count, setCount] = useState(1);
  const [itemIsFavorited, setItemIsFavorited] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [bgImg, setBgImg] = useState('');
  const [bgVid, setBgVid] = useState('');

  useEffect(() => {
    // * component initialization
    setCount(1);

    if (productId) {
      dispatch(getUserId());
      dispatch(fetchSingleProduct(productId));
      dispatch(fetchAllReviews(productId));
    }

    if (Math.random() < 0.5) {
      setBgImg(bgImgs[Math.floor(Math.random() * bgImgs.length)]);
      setBgVid('');
    } else {
      setBgVid(bgVids[Math.floor(Math.random() * bgVids.length)]);
      setBgImg('');
    }
  }, [productId]);

  useEffect(() => {
    // * determine whether item is in user's favorites & fill/clear heart icon
    if (thisUser._id) {
      const isFav = thisUser.favorites.some(({ _id: favId }) => {
        return favId.toString() === productId;
      });
      // console.log('isFav:', isFav);
      setItemIsFavorited(isFav);
    }
  }, [thisUser, productId]);

  useEffect(() => {
    // * initialize image as first 'product-front' image in product images array
    if (singleProduct?._id) {
      setSelectedImage(
        singleProduct.images.find(
          (image) => image.imageDesc === 'product-front'
        )?.imageURL || singleProduct.images[0].imageURL
      );
    }
  }, [singleProduct]);

  useEffect(() => {
    // * determine whether user has left a review on this product already
    if (userId) {
      if (
        allReviews.reviews.map((review) => review.user._id).includes(userId)
      ) {
        setUserHasReviewed(true);
      } else setUserHasReviewed(false);
    }
  }, [allReviews, userId]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
    if (productId) {
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

  // const qualityAndValueAvg = () => {
  //   let quality = 0;
  //   let value = 0;

  //   if (!allReviews.reviews.length) return { quality: 0, value: 0 };
  //   for (let review of allReviews.reviews) {
  //     value += review.rating.value;
  //     quality += review.rating.quality;
  //   }

  //   return {
  //     quality: Math.floor(quality / allReviews.reviews.length).toFixed(),
  //     value: (value / allReviews.reviews.length).toFixed(),
  //   };
  // };
  /**
   * * WRITE A REVIEW
   */

  // const handleAddReview = () => {
  //   setAddReview(true);
  // };

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
    <main className='single-product-main mx-auto mb-40 mt-8 flex min-h-[calc(100vh_-_4rem)] max-w-[calc(100vw_-_20px)] flex-col items-center px-12 xl:mt-14 2xl:max-w-[1420px]'>
      <section className='single-product-top-screen mb-11 flex w-full justify-center md:w-full lg:mb-20 xl:mb-24'>
        {/* <section className='image-section relative flex flex-col items-center pt-14 lg:basis-2/5 xl:basis-[576px]'> */}
        <section className='image-section relative mt-8 flex basis-2/5 flex-col items-center xl:mt-20'>
          <div className='relative z-10 flex flex-col items-center justify-between gap-3'>
            {itemIsFavorited ? (
              <div
                onClick={handleFavoriteRemove}
                className='w-fit cursor-pointer'
              >
                <img
                  src={heartFilled}
                  className='absolute right-[6%] top-[5%] w-3 lg:w-4 2xl:w-6'
                />
              </div>
            ) : (
              <div onClick={handleFavoriteAdd} className='w-fit cursor-pointer'>
                <img
                  src={heartBlanc}
                  className='absolute right-[6%] top-[5%] w-3 lg:w-4 2xl:w-6'
                />
              </div>
            )}
            <div className='aspect-[3/4] w-[230px] border border-charcoal lg:w-[300px] xl:w-[375px] 2xl:w-[424px]'>
              {['gif', 'mp4'].includes(selectedImage.split('.').at(-1)!) ? (
                <video
                  src={selectedImage}
                  className='absolute -z-10 aspect-[3/4] w-[calc(100%_-_2px)] object-cover'
                  muted={true}
                  autoPlay={true}
                  loop={true}
                />
              ) : (
                <img
                  src={selectedImage}
                  alt='product image'
                  className='aspect-[3/4] w-full object-cover'
                />
              )}
            </div>
            <ImageCarousel
              num={3}
              product={singleProduct}
              setSelectedImage={setSelectedImage}
            />
          </div>
        </section>

        <section className='product-details flex basis-3/5 flex-col items-center px-8'>
          <div className='product-desc mb-9 flex flex-col items-center text-justify'>
            <h1 className='product-name pb-9 text-center font-federo text-[1rem] uppercase xl:text-[1.5rem]'>
              {singleProduct.productName}
            </h1>
            <div
              className='star-bar-placement cursor-pointer self-start'
              onClick={() =>
                reviewSection.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <StarsBar
                score={overallReviewScore()}
                option='count'
                reviewCount={allReviews.reviews.length}
              />
            </div>
            <p className='product-long-desc font-grotesque text-xs lg:text-sm xl:text-lg 2xl:text-xl'>
              {singleProduct.productShortDesc} Retinol stimulates the synthesis
              of collagen and elastin to combat loss of firmness and wrinkles.
              This retinol serum visibly improves fine lines and smooths skin.
              99% naturally derived. Vegan. Made in France.
            </p>
          </div>
          <div className='cart-controls mb-24 w-full font-grotesque text-base font-medium lg:mb-28 lg:text-lg xl:text-xl 2xl:text-2xl'>
            <div className='cart-section flex w-full flex-col items-center text-center'>
              <div className='price-counter flex flex-col items-center'>
                <p className='price'>${singleProduct.price}</p>

                <div className='qty-counter mt-4 flex h-fit w-fit items-center gap-2 rounded-full border border-charcoal px-2'>
                  <div onClick={qtyDecrementor} className='cursor-pointer'>
                    <img src={minus} className='w-4 2xl:w-5' />
                  </div>
                  <div className='count translate-y-[-7%] px-4 text-center'>
                    {count}
                  </div>

                  <div
                    onClick={qtyIncrementor}
                    className='incrementor cursor-pointer'
                  >
                    <img src={plus} className='w-4 2xl:w-5' />
                  </div>
                </div>
                {singleProduct.qty <= 10 && (
                  <div className='font-grotesque text-xs text-red-800 lg:text-sm xl:text-lg 2xl:text-xl'>
                    {singleProduct.qty === 0 ? 'out of stock' : 'limited stock'}
                  </div>
                )}
              </div>
              <button
                onClick={handleClick}
                disabled={singleProduct.qty === 0}
                className='mt-14 w-4/5 max-w-[255px] rounded-sm bg-charcoal py-2 font-italiana text-lg uppercase text-white disabled:bg-charcoal/40 lg:max-w-[400px] lg:text-2xl xl:max-w-[475px] xl:py-3 xl:text-3xl 2xl:py-4'
              >
                add to cart
              </button>
            </div>
          </div>

          <div className='why-we-love-it text-sm lg:text-base xl:text-lg 2xl:text-xl'>
            <h2 className='mb-4 text-center font-federo uppercase'>
              why we love it
            </h2>
            <p className='text-center font-grotesque'>
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
      <section className='ingredients-container mb-20 flex w-full flex-row-reverse justify-center gap-5 lg:mb-24 lg:gap-7 xl:gap-9 2xl:mb-32'>
        <div className='bg-img basis-3/5 px-4'>
          {bgVid ? (
            <video
              autoPlay={true}
              loop={true}
              muted={true}
              src={bgVid}
              className='aspect-[2/3] w-full object-cover'
            />
          ) : (
            <img src={bgImg} className='aspect-[2/3] object-cover' />
          )}
        </div>
        <div className='ingredients mt-4 flex basis-2/5 flex-col gap-6 lg:mt-6 lg:gap-8 xl:gap-12'>
          <h3 className='font-aurora text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>
            key ingredients
          </h3>
          {parseIngredients().map((el, idx) => {
            return (
              <p
                key={idx}
                className='font-grotesque text-base xl:text-xl 2xl:text-2xl'
              >
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
      <section className='product-suggestions mb-20 flex flex-col items-center lg:mb-24 xl:mb-32'>
        <h2 className='mb-5 font-marcellus text-2xl lg:mb-8 lg:text-4xl xl:mb-12 xl:text-5xl'>
          YOU MAY ALSO LIKE
        </h2>
        <ProductCarousel products={singleProduct.relatedProducts} num={4} />
      </section>

      {/* REVIEWS */}
      <section
        id='review-container'
        ref={reviewSection}
        className='review-container flex w-full flex-col items-center border-t border-charcoal pt-8 font-marcellus lg:w-10/12 lg:pt-10'
      >
        <h2 className='self-start font-gayathri text-[4.25rem] lg:text-[5.7rem] xl:text-[7rem] 2xl:text-[8rem]'>
          REVIEWS
        </h2>
        <div className='review-subtitle-container flex flex-col items-center justify-between'>
          {allReviews.reviews?.length > 0 && (
            <div className='star-bar-placement self-start'>
              <StarsBar
                score={overallReviewScore()}
                reviewCount={allReviews.reviews.length}
              />
            </div>
          )}
          {showReviewForm ? (
            <AddReview
              product={singleProduct}
              productId={productId!}
              setShowReviewForm={setShowReviewForm}
            />
          ) : allReviews.reviews?.length < 1 ? (
            <>
              <p className='mb-7'>
                No reviews yet...be the first to leave one!
              </p>
              <button
                className='rounded-sm border border-charcoal px-6 py-2 font-italiana text-sm uppercase lg:px-8 lg:text-base xl:rounded 2xl:px-10 2xl:py-4 2xl:text-xl'
                onClick={() => setShowReviewForm((prev) => !prev)}
              >
                write a review
              </button>
            </>
          ) : userHasReviewed ? (
            ''
          ) : (
            <button
              className='self-end rounded-sm border border-charcoal px-6 py-2 font-italiana text-sm uppercase lg:px-8 lg:text-base xl:rounded 2xl:px-10 2xl:py-4 2xl:text-xl'
              onClick={() => setShowReviewForm((prev) => !prev)}
            >
              write a review
            </button>
          )}
          {allReviews.reviews.length > 0 && (
            <div className='reviews-wrapper mt-6'>
              <div className='reviews-wrapper flex w-full flex-col items-center gap-4 lg:gap-6 xl:gap-8'>
                {allReviews.reviews.map((review, idx) => (
                  <Review
                    review={review}
                    key={review._id}
                    last={allReviews.reviews.length - 1 === idx}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
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
