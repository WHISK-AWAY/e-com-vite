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
import { toastGuestFavorite } from '../../utilities/toast';
import convertMediaUrl from '../../utilities/convertMediaUrl';
import { getMaxQty } from '../../utilities/helpers';
import {
  getRandomBackgroundImage,
  getRandomBackgroundVideo,
} from './randomBackground';
import MobileAddToCartHelper from './MobileAddToCartHelper';

export type SingleProductProps = {
  mobileMenu: boolean;
  isCartFavWrapperHidden: boolean;
  isSearchHidden: boolean;
  isMenuHidden: boolean;
  isSignFormHidden: boolean;
};

export default function SingleProduct({
  mobileMenu,
  isCartFavWrapperHidden,
  isSearchHidden,
  isMenuHidden,
  isSignFormHidden,
}: SingleProductProps) {
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
  const [mobileAddToCartHidden, setMobileAddToCartHidden] = useState(false);

  const ingredientBgImgWrapper = useRef(null);
  const ingredientSection = useRef(null);
  const mainImage = useRef<HTMLDivElement>(null);
  const prodImgWrapper = useRef(null);
  const prodInfoWrapper = useRef(null);

  // const changeImage = useRef<(newImage: string) => void>(imageChanger);

  // const isPresent = useIsPresent();

  function changeImage(newImage: string) {
    if (selectedImage === newImage) return;

    gsap
      .to('.fader', {
        opacity: 0,
        duration: 0.25,
        ease: 'expo.inOut',
      })
      .then(() => {
        setSelectedImage(newImage);
      });
  }

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

  const pinSpacerToggler =
    window.matchMedia('(orientation: portrait)').matches || mobileMenu;

  // console.log(pinSpacerToggler);
  useLayoutEffect(() => {
    // Animation: pin ingredients image while ingredients list scrolls
    if (
      !ingredientBgImgWrapper ||
      !ingredientSection ||
      !prodImgWrapper ||
      !prodInfoWrapper
    )
      return;

    const ctx = gsap.context((_) => {
      const scroller = ingredientBgImgWrapper.current;

      if (scroller) {
        gsap.to(scroller, {
          scrollTrigger: {
            trigger: scroller,
            pin: true,
            pinSpacing: mobileMenu ? false : true,
            endTrigger: ingredientSection.current,
            start: 'top 64px',
            end: mobileMenu ? 'bottom 40%' : 'bottom bottom',
          },
        });

        {
          mobileMenu
            ? ''
            : gsap.to(prodImgWrapper.current, {
                scrollTrigger: {
                  trigger: prodImgWrapper.current,
                  pin: true,
                  endTrigger: prodInfoWrapper.current,
                  start: 'top 64px',
                  end: 'bottom 80%',
                },
              });
        }
      }
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

  /**
   * * MOBILE ADD TO CART MENU HELPED
   */

  useEffect(() => {
    if (
      !isCartFavWrapperHidden ||
      isSearchHidden ||
      !isMenuHidden ||
      !isSignFormHidden
    )
      setMobileAddToCartHidden(true);
  }, []);

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
    setIsClicked(true);
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
    const text = singleProduct.productIngredients.split('\n');
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
      {mobileMenu &&
        isCartFavWrapperHidden &&
        isSearchHidden &&
        isMenuHidden &&
        isSignFormHidden && (
          <MobileAddToCartHelper
            qtyIncrementor={qtyIncrementor}
            qtyDecrementor={qtyDecrementor}
            count={count}
            productName={singleProduct.productName}
            price={singleProduct.price}
            handleAddToCart={handleAddToCart}
            maxQty={maxQty}
          />
        )}
      <main
        className={` ${
          mobileMenu
            ? 'max-w-[100svw] px-0 '
            : 'mt-8 max-w-[calc(100svw_-_20px)] px-12 '
        } single-product-main mx-auto mb-40 flex min-h-[calc(100vh_-_4rem)]  flex-col items-center   bg-white xl:mt-14 2xl:max-w-[1420px] portrait:md:px-5 portrait:lg:max-w-[95svw]`}
      >
        <section
          ref={prodInfoWrapper}
          className={` ${
            mobileMenu ? 'flex-col' : 'flex'
          } single-product-top-screen mb-16 w-full justify-center   md:w-full lg:mb-20 3xl:mb-44 4xl:mb-20 4xl:pb-36  short:pb-56 portrait:md:mb-0 portrait:md:pb-24 portrait:lg:pb-56 `}
        >
          {/* <section className='image-section relative flex flex-col items-center pt-14 lg:basis-2/5 xl:basis-[576px]'> */}
          <section
            ref={prodImgWrapper}
            className={` ${
              mobileMenu ? 'pl-0' : 'xl:pl-7 short:pl-24'
            } image-section relative flex h-full basis-2/5 flex-col items-center  align-top `}
          >
            <div className="relative z-10 flex flex-col items-center justify-between gap-3 align-top ">
              <div
                ref={mainImage}
                className={` ${
                  mobileMenu
                    ? 'w-[100svw] '
                    : 'w-[230px]  lg:w-[350px] xl:w-[400px] 2xl:w-[424px] 4xl:w-[450px] short:w-[350px]'
                } aspect-[3/4] portrait:md:w-[36svw]`}
              >
                {['gif', 'mp4'].includes(selectedImage.split('.').at(-1)!) ? (
                  <video
                    className="fader absolute -z-10 aspect-[3/4] w-[calc(100%_-_2px)] object-cover"
                    loop
                    autoPlay
                    muted
                    playsInline
                    controls={false}
                  >
                    <source
                      src={selectedImage}
                      type={
                        selectedImage.split('.').at(-1) === 'mp4'
                          ? 'video/mp4'
                          : 'image/gif'
                      }
                    />
                    <source
                      src={convertMediaUrl(selectedImage)}
                      type="video/webm"
                    />
                  </video>
                ) : (
                  <picture>
                    <source
                      srcSet={convertMediaUrl(selectedImage)}
                      type="image/webp"
                    />
                    <img
                      src={selectedImage}
                      height="1600"
                      width="1600"
                      alt={`product image: ${singleProduct.productName}`}
                      className="fader aspect-[3/4] w-full object-cover"
                    />
                  </picture>
                )}
                {userId ? (
                  itemIsFavorited ? (
                    <div
                      onClick={handleFavoriteRemove}
                      className="w-fit cursor-pointer"
                    >
                      <img
                        src={heartFilled}
                        className="fader x absolute right-[5%] top-[4%]  w-4 lg:w-5 xl:w-6 portrait:w-6"
                        height="17"
                        width="20"
                        alt="remove from favorites"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={handleFavoriteAdd}
                      className="w-fit cursor-pointer"
                    >
                      <img
                        src={heartBlanc}
                        className="fader absolute right-[5%] top-[4%] w-4  lg:w-5 xl:w-6 portrait:w-6"
                        height="17"
                        width="20"
                        alt="add to favorites"
                      />
                    </div>
                  )
                ) : (
                  <img
                    src={heartBlanc}
                    onClick={toastGuestFavorite}
                    className="fader absolute right-[5%] top-[4%] w-4 lg:w-5 xl:w-6 portrait:w-6"
                    height="17"
                    width="20"
                    alt="add to favorites"
                  />
                )}
              </div>
              <ImageCarousel
                num={3}
                product={singleProduct}
                changeImage={changeImage}
                mobileMenu={mobileMenu}
              />
            </div>
          </section>

          <section
            className={`${
              mobileMenu ? 'px-4' : 'px-8'
            } product-details flex basis-3/5 flex-col items-center `}
          >
            <div className="product-desc mb-5 flex flex-col items-center text-justify lg:mb-9">
              <h1 className="product-name pb-9 text-center font-grotesque text-[1.4rem] font-light uppercase xl:text-[1.5rem] portrait:pt-5 portrait:lg:text-[2rem]">
                {singleProduct.productName}
              </h1>

              <div
                className="star-bar-placement cursor-pointer self-start"
                onClick={() =>
                  reviewSection.current?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }
              >
                <StarsBar
                  score={overallReviewScore()}
                  option="count"
                  reviewCount={allReviews.reviews.length}
                />
              </div>
              <p className="product-long-desc font-grotesque text-xs font-light lg:text-sm xl:text-lg portrait:text-[1.1rem] portrait:leading-5 portrait:md:text-[1.2rem] portrait:lg:text-[1.8rem] portrait:lg:leading-7">
                {singleProduct.productShortDesc} Retinol stimulates the
                synthesis of collagen and elastin to combat loss of firmness and
                wrinkles. This retinol serum visibly improves fine lines and
                smooths skin. 99% naturally derived. Vegan. Made in France.
              </p>
            </div>
            <div className="cart-controls mb-24 w-full font-grotesque text-base font-light lg:mb-28 lg:text-lg xl:text-xl ">
              <div className="cart-section flex w-full flex-col items-center text-center">
                <div className="price-counter flex flex-col items-center">
                  <p className="price lg:text-lg xl:text-xl 2xl:text-2xl portrait:text-[1.2rem] portrait:md:text-[1.3rem] portrait:lg:text-[1.8rem]">
                    ${singleProduct.price}
                  </p>

                  <div className="qty-counter mt-3 flex h-fit w-fit items-center gap-2 rounded-full border border-charcoal/80 px-2">
                    <div
                      onClick={qtyDecrementor}
                      className="cursor-pointer"
                    >
                      <img
                        src={minus}
                        alt={`reduce quantity (currently ${count})`}
                        className="w-4 duration-100 ease-in-out active:scale-125 2xl:w-5 portrait:w-5 portrait:md:w-6 portrait:lg:w-8"
                      />
                    </div>
                    <div className="count translate-y-[-7%] px-1 text-center lg:px-[.5vw] portrait:py-1 portrait:text-[1.2rem] portrait:lg:text-[1.8rem]">
                      {count}
                    </div>

                    <div
                      onClick={qtyIncrementor}
                      className="incrementor cursor-pointer"
                    >
                      <img
                        src={plus}
                        alt={`increase quantity (currently ${count})`}
                        className="w-4 duration-100 ease-in-out active:scale-125 2xl:w-5 portrait:w-5 portrait:md:w-6 portrait:lg:w-8"
                      />
                    </div>
                  </div>
                  {maxQty <= 10 && (
                    <div className="font-grotesque text-xs text-red-800 lg:text-sm xl:text-lg portrait:text-[1rem]">
                      {maxQty === 0 ? 'out of stock' : 'limited stock'}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={maxQty === 0}
                  className={` ${
                    mobileMenu ? 'w-full' : 'w-4/5'
                  } group relative mt-[6%] inline-block  max-w-full  font-medium text-white focus:outline-none `}
                >
                  <span className="absolute inset-0  border border-primary-gray group-active:border-charcoal group-disabled:border-none"></span>
                  <span
                    className={` ${
                      mobileMenu ? 'py-2 text-[1.4rem]' : 'py-3 text-[2vw]'
                    } ease block rounded-sm border border-charcoal bg-charcoal px-12  font-poiret font-medium uppercase transition-transform duration-300 active:rounded-sm active:border-charcoal/90 active:bg-charcoal/90 group-hover:-translate-x-1 group-hover:-translate-y-1 group-disabled:-translate-x-0 group-disabled:-translate-y-0 group-disabled:border-none group-disabled:bg-charcoal/40 4xl:py-4 5xl:text-[1.3vw] 6xl:text-[1.1vw] `}
                  >
                    add to cart
                  </span>
                </button>
              </div>
            </div>

            <div className={`${mobileMenu ? 'hidden' : ''} why-we-love-it `}>
              <h2 className="mb-4 text-center font-grotesque text-base  uppercase lg:text-base xl:text-xl 2xl:text-xl short:pt-20 portrait:md:text-xl portrait:lg:text-3xl">
                why we love it
              </h2>
              <p className="text-center font-grotesque text-xs font-light lg:text-sm xl:text-base portrait:md:text-[1.2rem] portrait:md:leading-6 portrait:lg:text-[1.8rem] portrait:lg:leading-7">
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
          className={` ${
            mobileMenu ? 'gap-2' : 'gap-5'
          } ingredients-container mb-20 flex h-fit w-full flex-row-reverse justify-center   lg:mb-24 lg:gap-7 xl:gap-9 2xl:mb-32 portrait:md:mb-0 portrait:md:pb-56`}
        >
          <div
            className={`${
              mobileMenu
                ? 'aspect-square   basis-2/5 px-0'
                : 'h-screen basis-3/5  px-4'
            } bg-img  shrink-0 portrait:px-0 portrait:md:h-[70svh]`}
            ref={ingredientBgImgWrapper}
          >
            {bgVid ? (
              <video
                loop
                autoPlay
                muted
                playsInline
                controls={false}
                className={`${
                  mobileMenu ? 'h-[40svh]' : 'h-screen'
                }  w-full object-cover  portrait:md:h-full`}
              >
                <source
                  src={convertMediaUrl(bgVid)}
                  type="video/webm"
                />
                <source
                  src={bgVid}
                  type="video/mp4"
                />
              </video>
            ) : (
              <picture>
                <source
                  srcSet={convertMediaUrl(bgImg)}
                  type="image/webp"
                />
                <img
                  src={bgImg}
                  alt=""
                  className={`${
                    mobileMenu ? 'h-[40svh]' : 'h-screen'
                  }  w-full object-cover portrait:md:h-full `}
                />
              </picture>
            )}
          </div>
          <div
            className={` ${
              mobileMenu ? 'min-h-fit basis-3/5' : 'min-h-screen basis-2/5 '
            } ingredients mt-4 flex h-full   flex-col gap-6 lg:mt-6 lg:gap-8 xl:gap-12`}
          >
            <h3 className="font-aurora text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl portrait:pl-2 portrait:text-[1.5rem] portrait:md:pl-0 portrait:lg:text-3xl">
              key ingredients
            </h3>
            {parseIngredients().map((el, idx) => {
              return (
                <p
                  key={idx}
                  className="font-grotesque text-xs font-light lg:text-sm xl:text-lg 2xl:text-xl portrait:pl-2 portrait:text-[1.1rem] portrait:leading-5 portrait:md:pl-0 portrait:md:text-[1.2rem] portrait:lg:text-[1.8rem] portrait:lg:leading-7"
                >
                  <span className="font-grotesque font-bold uppercase">
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
          className="product-suggestions mb-20 flex flex-col items-center lg:mb-24 xl:mb-32 "
        >
          <h2 className="mb-5 font-grotesque text-xl lg:mb-8 lg:text-2xl xl:mb-12 xl:text-3xl portrait:text-[1.5rem] portrait:lg:pb-10 portrait:lg:text-[2.5rem]">
            YOU MAY ALSO LlKE
          </h2>

          {singleProduct.relatedProducts && (
            <ProductCarousel
              products={singleProduct.relatedProducts}
              num={mobileMenu ? 2 : 4}
              mobileMenu={mobileMenu}
            />
          )}
        </section>

        {/* REVIEWS */}
        <section
          id="review-container"
          ref={reviewSection}
          className="review-container flex w-full flex-col items-center border-t border-charcoal pt-8 font-grotesque lg:w-10/12 lg:pt-10 portrait:px-3"
        >
          <h2 className="self-start font-yantramanav  text-[3rem] font-bold  ">
            REVIEWS
          </h2>
          <div
            className={` ${
              mobileMenu ? 'items-center' : 'items-end'
            } review-subtitle-container flex flex-col justify-between `}
          >
            {allReviews.reviews?.length > 0 && (
              <div className="star-bar-placement self-start">
                <StarsBar
                  score={overallReviewScore()}
                  reviewCount={allReviews.reviews.length}
                />
              </div>
            )}
            {showReviewForm ? (
              <AddReview
                mobileMenu={mobileMenu}
                product={singleProduct}
                productId={productId!}
                setShowReviewForm={setShowReviewForm}
              />
            ) : allReviews.reviews?.length < 1 ? (
              <div className="self-end">
                <p className="mb-7 text-sm">
                  No reviews yet...be the first to leave one!
                </p>
                <button
                  className="rounded-sm border border-charcoal px-6 py-2  font-poiret text-sm uppercase lg:px-8 lg:text-base xl:rounded 2xl:px-10   landscape:-mt-36 landscape:mb-36"
                  onClick={() => setShowReviewForm((prev) => !prev)}
                >
                  write a review
                </button>
              </div>
            ) : userHasReviewed ? (
              ''
            ) : (
              <button
                className="self-end rounded-sm border border-charcoal px-6  py-2  font-poiret text-sm uppercase lg:px-8 lg:text-base xl:rounded 2xl:px-10 2xl:text-base  landscape:-mt-36 landscape:mb-36"
                onClick={() => setShowReviewForm((prev) => !prev)}
              >
                write a review
              </button>
            )}
            {allReviews.reviews.length > 0 && (
              <div className="reviews-wrapper mt-6">
                <div className="reviews-wrapper flex w-full flex-col items-center gap-4 lg:gap-6 xl:gap-8">
                  {allReviews.reviews.map((review) => (
                    <Review
                      mobileMenu={mobileMenu}
                      review={review}
                      key={review._id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
