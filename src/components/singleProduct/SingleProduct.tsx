import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import {
  fetchSingleProduct,
  selectSingleProduct,
} from '../../redux/slices/allProductSlice';
import { selectAuth } from '../../redux/slices/authSlice';
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

import 'lazysizes';
import { motion } from 'framer-motion';
import { toastGuestFavorite } from '../../utilities/toast';
import convertMediaUrl from '../../utilities/convertMediaUrl';
import { getMaxQty } from '../../utilities/helpers';
import { getRandomBackgroundImage, getRandomBackgroundVideo } from './randomBackground';

export default function SingleProduct() {
  const reviewSection = useRef<HTMLDivElement>(null);
  const youMayAlsoLikeRef = useRef<HTMLDivElement>(null);
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const singleProduct = useAppSelector(selectSingleProduct);
  const allReviews = useAppSelector(selectReviewState);
  const { user: thisUser } = useAppSelector(selectSingleUser);
  const { userId } = useAppSelector(selectAuth);

  const maxQty = useMemo(
    () => getMaxQty(singleProduct, userId),
    [singleProduct!, userId]
  );
  const [count, setCount] = useState(0);
  const [itemIsFavorited, setItemIsFavorited] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [bgImg, setBgImg] = useState('');
  const [bgVid, setBgVid] = useState('');

  const ingredientBgImgWrapper = useRef(null);
  const ingredientSection = useRef(null);
  const mainImage = useRef<HTMLDivElement>(null);
  const prodImgWrapper = useRef(null);
  const prodInfoWrapper = useRef(null);


  const changeImage = useRef<((newImage: string) => void) | null>(null);

  // const isPresent = useIsPresent();

  function imageChanger(newImage: string) {
    gsap
      .to('.fader', {
        opacity: 0,
        duration: 0.05,
        ease: 'expo.inOut'
      })
      .then(() => {
        setSelectedImage(newImage);
      });
  }

  changeImage.current = imageChanger;

  useLayoutEffect(() => {
    // Fade in animation - triggered upon new image load
    if (!selectedImage || !mainImage?.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.fader', {
        opacity: 0,
        duration: 0.25,
      });
    }, mainImage.current);

    return () => {
      ctx.revert();
    };
  }, [selectedImage, mainImage]);

  useLayoutEffect(() => {
    // Animation: pin ingredients image while ingredients list scrolls
    if (!ingredientBgImgWrapper || !ingredientSection || !prodImgWrapper || !prodInfoWrapper) return;

    const ctx = gsap.context((_) => {
      const scroller = ingredientBgImgWrapper.current;

      gsap.to(scroller, {
        scrollTrigger: {
          trigger: scroller,
          pin: true,
          pinSpacing: true,
          endTrigger: ingredientSection.current,
          end: 'bottom bottom',
        },
      });

      gsap.to(prodImgWrapper.current, {
        scrollTrigger: {
          trigger: prodImgWrapper.current,
          pin: true,
          endTrigger: ingredientSection.current,
          start: 'top 20%',
          end: 'top bottom'
        }
      })
    });

    return () => ctx.revert();
  });

  useEffect(() => {
    // * component initialization

    if (!productId) return;

    dispatch(fetchSingleProduct(productId)).then(() =>
      window.scrollTo({ top: 0 })
    );
    dispatch(fetchAllReviews(productId));

    if (Math.random() < 0.5) {
      setBgImg(getRandomBackgroundImage());
      setBgVid('');
    } else {
      // setBgVid(bgVids[Math.floor(Math.random() * bgVids.length)]);
      setBgVid(getRandomBackgroundVideo());
      setBgImg('');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  useEffect(() => {
    // Set counter to 1 if quantity is available.
    if (singleProduct?._id) {
      setCount(Math.min(1, maxQty));
    } else {
      setCount(0);
    }
  }, [singleProduct]);

  useEffect(() => {
    // Determine whether item is in user's favorites & fill/clear heart icon
    if (thisUser._id) {
      const isFav = thisUser.favorites.some(({ _id: favId }) => {
        return favId.toString() === productId;
      });
      // console.log('isFav:', isFav);
      setItemIsFavorited(isFav);
    }
  }, [thisUser, productId]);

  useEffect(() => {
    // Initialize image as first 'product-front' image in product images array
    if (!singleProduct?._id) return;
    setSelectedImage(
      singleProduct.images.find((image) => image.imageDesc === 'product-front')
        ?.imageURL || singleProduct?.images[0].imageURL
    );

    if (count > maxQty) {
      setCount(maxQty);
    }
  }, [singleProduct]);

  useEffect(() => {
    // Determine whether user has left a review on this product already (prevents additional reviews)
    if (userId) {
      if (
        allReviews.reviews.map((review) => review.user._id).includes(userId)
      ) {
        setUserHasReviewed(true);
      } else setUserHasReviewed(false);
    }
  }, [allReviews, userId]);

  // Add-to-cart quantity counter
  const qtyIncrementor = () => {
    if (maxQty <= 1) {
      setCount(maxQty);
      return;
    }

    // Limit add-to-cart qty to max available qty
    if (count >= maxQty) setCount(maxQty);
    else setCount((prev) => prev + 1);
  };

  // Add-to-cart quantity counter
  const qtyDecrementor = () => {
    if (count <= 1) return;
    setCount((prev) => prev - 1);
  };


  const [isClicked, setIsClicked] = useState(false);
  // Add selected quantity to cart.
  const handleAddToCart = () => {
    setIsClicked(true)
    if (count < 1) return;

    setCount(1);

    if (productId) {
      dispatch(addToCart({ userId, productId, qty: count })).then(() =>
        dispatch(fetchSingleProduct(productId))
      );
    }
  };

  // ! early return: await single product availability
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
   * * WRITE A REVIEW
   */

  const parseIngredients = () => {
    const text = singleProduct.productIngredients.split('\n')
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
    <>
      <motion.div
        className='slide-in fixed left-0 top-0 z-50 h-screen w-screen origin-bottom bg-[#131313]'
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* <motion.span
        className='hidden font-notable  text-red-600 fixed top-1/2 right-0 h-[10vh] w-[20vw]  z-[60]'
        initial={{ opacity: 0,  display: 'hidden' }}
        animate={{ opacity: 100, display: 'block', }}
        exit={{ display: 'hidden'}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        astoria
      </motion.span> */}
      <motion.div
        className='slide-out  fixed left-0 top-0 z-50 h-screen w-screen origin-top bg-[#131313]'
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <main className=' single-product-main mx-auto mb-40 mt-8 flex min-h-[calc(100vh_-_4rem)] max-w-[calc(100vw_-_20px)] flex-col items-center px-12 xl:mt-14 2xl:max-w-[1420px]'>
        <section
          ref={prodInfoWrapper}
          className='single-product-top-screen mb-11 flex w-full justify-center md:w-full lg:mb-20 xl:mb-24'
        >
          {/* <section className='image-section relative flex flex-col items-center pt-14 lg:basis-2/5 xl:basis-[576px]'> */}
          <section
            ref={prodImgWrapper}
            className='image-section relative mt-8 flex basis-2/5 flex-col items-center xl:mt-20'
          >
            <div className='relative z-10 flex flex-col items-center justify-between gap-3'>
              <div
                ref={mainImage}
                className='aspect-[3/4] w-[230px]  lg:w-[300px] xl:w-[375px] 2xl:w-[424px]'
              >
                {['gif', 'mp4'].includes(selectedImage.split('.').at(-1)!) ? (
                  <video
                    className='fader absolute -z-10 aspect-[3/4] w-[calc(100%_-_2px)] object-cover'
                    muted={true}
                    autoPlay={true}
                    loop={true}
                  >
                    <source src={selectedImage} type={selectedImage.split('.').at(-1) === 'mp4' ? 'video/mp4' : 'image/gif'} />
                    <source src={convertMediaUrl(selectedImage)} type='video/webm' />
                  </video>
                ) : (
                  <picture>
                    <source srcSet={convertMediaUrl(selectedImage)} type="image/webp" />
                    <img
                      src={selectedImage}
                      height='1600'
                      width='1600'
                      alt={`product image: ${singleProduct.productName}`}
                      className='fader aspect-[3/4] w-full object-cover'
                    />
                  </picture>
                )}
                {userId ? (
                  itemIsFavorited ? (
                    <div
                      onClick={handleFavoriteRemove}
                      className='w-fit cursor-pointer'
                    >
                      <img
                        src={heartFilled}
                        className='fader absolute right-[5%] top-[9%] w-4 lg:top-[8%] lg:w-5 xl:top-[7%] xl:w-6'
                        height='17'
                        width='20'
                        alt='remove from favorites'
                      />
                    </div>
                  ) : (
                    <div
                      onClick={handleFavoriteAdd}
                      className='w-fit cursor-pointer'
                    >
                      <img
                        src={heartBlanc}
                        className='fader absolute right-[5%] top-[9%] w-4 lg:top-[8%] lg:w-5 xl:top-[7%] xl:w-6'
                        height='17'
                        width='20'
                        alt='add to favorites'
                      />
                    </div>
                  )
                ) : (
                  <img
                    src={heartBlanc}
                    onClick={toastGuestFavorite}
                    className='fader absolute right-[5%] top-[4%] w-4 lg:w-5 xl:w-6'
                    height='17'
                    width='20'
                    alt='add to favorites'
                  />
                )}
              </div>
              {changeImage?.current && (
                <ImageCarousel
                  num={3}
                  product={singleProduct}
                  changeImage={changeImage.current}
                />
              )}
            </div>
          </section>

          <section className='product-details flex basis-3/5 flex-col items-center px-8'>
            <div className='product-desc mb-5 flex flex-col items-center text-justify lg:mb-9'>
              <h1 className='product-name pb-9 text-center font-grotesque font-light text-[1.4rem] uppercase xl:text-[1.5rem]'>
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
              <p className='product-long-desc font-grotesque font-light text-xs lg:text-sm xl:text-lg 2xl:text-xl'>
                {singleProduct.productShortDesc} Retinol stimulates the
                synthesis of collagen and elastin to combat loss of firmness and
                wrinkles. This retinol serum visibly improves fine lines and
                smooths skin. 99% naturally derived. Vegan. Made in France.
              </p>
            </div>
            <div className='cart-controls mb-24 w-full font-grotesque text-base font-light lg:mb-28 lg:text-lg xl:text-xl 2xl:text-2xl'>
              <div className='cart-section flex w-full flex-col items-center text-center'>
                <div className='price-counter flex flex-col items-center'>
                  <p className='price'>${singleProduct.price}</p>

                  <div className='qty-counter mt-3 flex h-fit w-fit items-center gap-2 rounded-full border border-charcoal/80 px-2'>
                    <div onClick={qtyDecrementor} className='cursor-pointer'>
                      <img
                        src={minus}
                        className='w-4 duration-100 ease-in-out active:scale-125 2xl:w-5'
                      />
                    </div>
                    <div className='count translate-y-[-7%] px-1 text-center lg:px-[.5vw]'>
                      {count}
                    </div>

                    <div
                      onClick={qtyIncrementor}
                      className='incrementor cursor-pointer'
                    >
                      <img
                        src={plus}
                        className='w-4 duration-100 ease-in-out active:scale-125 2xl:w-5 '
                      />
                    </div>
                  </div>
                  {maxQty <= 10 && (
                    <div className='font-grotesque text-xs text-red-800 lg:text-sm xl:text-lg 2xl:text-xl'>
                      {maxQty === 0 ? 'out of stock' : 'limited stock'}
                    </div>
                  )}
                </div>
                {/* <button
                onClick={handleAddToCart}
                disabled={maxQty === 0}
                className='mt-14 w-4/5 max-w-[255px] rounded-sm bg-charcoal py-2 font-italiana text-lg  uppercase text-white outline outline-slate-800 hover:outline-offset-4 disabled:bg-charcoal/40 lg:max-w-[400px] lg:text-2xl xl:max-w-[475px] xl:py-3 xl:text-3xl 2xl:py-4 active:border border-red-500 '
              >
                add to cart
              </button> */}

                <button
                  onClick={handleAddToCart}
                  disabled={maxQty === 0}
                  className='group relative mt-[6%] w-4/5 max-w-full overflow-hidden rounded-sm  border-charcoal bg-charcoal py-[2%] font-poiret text-[2vw] font-medium uppercase  text-white transition-all  hover:scale-[1.01] active:bg-red-300 hover:duration-00 active:ease-in-out disabled:bg-charcoal/40 5xl:text-[1.1vw]'
                >
                  <span className='ease absolute left-0 top-0 h-0 w-0 border-t-4 border-white transition-all duration-1000  group-hover:w-full '></span>
                  <span className='ease absolute bottom-0 right-0 h-0 w-0 border-b-4 border-white transition-all duration-500  group-hover:w-full'></span>
                  <span className='ease absolute left-0 top-0 h-0 w-full bg-gray-400 transition-all  delay-200 duration-1000  group-hover:h-full'></span>
                  <span className='ease absolute bottom-0 left-0 h-0 w-full bg-gray-400 transition-all delay-200 duration-1000  group-hover:h-full'></span>
                  <span className='absolute inset-0 h-full w-full border border-charcoal/80 bg-[#383838] active:bg-yellow-400 opacity-0 delay-500 duration-700 group-hover:opacity-100'></span>

                  <span className='ease relative transition-colors delay-200 duration-1000  '>
                    add to cart
                  </span>
                </button>
              </div>
            </div>

            <div className='why-we-love-it text-sm lg:text-base xl:text-lg 2xl:text-xl'>
              <h2 className='mb-4 text-center font-federo uppercase'>
                why we love it
              </h2>
              <p className='text-center font-grotesque'>
                CEO 15% Vitamin C Brightening Serum, is targeted to quickly
                fight the look of dullness, dark spots, and discolorations at
                the source, while diminishing the signs of premature aging. Skin
                looks firmer and plumper, as youthful skin bounce and even-tone
                are restored. CEO 15% Vitamin C Brightening Serum, uses a
                sophisticated, ultra-powerful form of Vitamin C called THD
                Ascorbate. Both highly stable and oil-soluble, THD Ascorbate
                rapidly absorbs into the skin for visible anti-aging benefits,
                including visual improvement in loss of firmness, the appearance
                of lines and wrinkles, and dark spots and dullness. This
                hydrating antioxidant formula instantly illuminates the
                complexion with bright radiance, while phytosterols help to
                reduce the signs of skin sensitivity. Saccharide Isomerate
                extract diminishes the appearance of pores and reinforces the
                skin’s moisture barrier for a skin-smoothing glow. Rapidly
                brighten the appearance of the skin and boost vital skin bounce,
                in a flash!
              </p>
            </div>
          </section>
        </section>
        <section
          ref={ingredientSection}
          className='ingredients-container mb-20 flex h-fit w-full flex-row-reverse justify-center gap-5 lg:mb-24 lg:gap-7 xl:gap-9 2xl:mb-32'
        >
          <div
            className='bg-img h-screen shrink-0 basis-3/5 px-4'
            ref={ingredientBgImgWrapper}
          >
            {bgVid ? (
              <video
                autoPlay={true}
                controls={false}
                loop={true}
                muted={true}
                className='h-screen w-full object-cover'
              >
                <source src={convertMediaUrl(bgVid)} type="video/webm" />
                <source src={bgVid} type="video/mp4" />
              </video>
            ) : (
              <picture>
                <source srcSet={convertMediaUrl(bgImg)} type="image/webp" />
                <img src={bgImg} className='h-screen w-full object-cover' />
              </picture>
            )}
          </div>
          <div className='ingredients mt-4 flex h-full min-h-screen basis-2/5 flex-col gap-6 lg:mt-6 lg:gap-8 xl:gap-12'>
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
        <section
          ref={youMayAlsoLikeRef}
          className='product-suggestions mb-20 flex flex-col items-center lg:mb-24 xl:mb-32'
        >
          <h2 className='mb-5 font-marcellus text-2xl lg:mb-8 lg:text-4xl xl:mb-12 xl:text-5xl'>
            YOU MAY ALSO LIKE
          </h2>
          {singleProduct.relatedProducts && (
            <ProductCarousel products={singleProduct.relatedProducts} num={4} />
          )}
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
      {/**
       * 
       * 
      <motion.div
        className='slide-in fixed left-0 top-0 z-50 h-screen w-screen bg-[#0f0f0f]'
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        style={{ originY: isPresent ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
       */}
    </>
  );
}
