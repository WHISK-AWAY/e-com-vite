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

  // {singleProduct.productIngredients.split(/[\n]/g).forEach(( text) => console.log(text.match(':')))}

  const func = () => {
    const text = singleProduct.productIngredients.split('\n');
    // console.log( 'etxt', text)
    let arr = [];
    let header;
    for (let i = 0; i < text.length; i++) {
    // let t= text[i].trim().split('\n').join(':');

    arr.push(text[i].trim().split(':'))
   
    }

    let evens = [];
    let odds = [];
    for (let i =  0; i < arr.length; i++) {

       if(i % 2) {
        odds.push(arr[i])
       } else {
        evens.push(arr[i]);
       }
    }
// console.log('evens', evens);
let res =[]
for (let i = 0; i < evens.length; i++) {
  // for (let j = 0; j < evens[i].length; j++) {
  //   console.log('j', evens[i][j])
   
  // }
   res.push(evens[i][0] + ': ' + odds[i][0])
}



    console.log('res', res);
    return res;
  };


  // func();


  /**
   * * MAIN RENDER
   */
  return (
    <section className='single-product-container flex  w-full flex-col items-center px-12 pt-16'>
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
      <div className='single-product-container flex w-full justify-center '>
        <section className='image-section relative flex flex-col items-center pt-14 lg:basis-2/5 xl:basis-[576px]'>
          {/* <img src={h2} className='h-5 ' />
          <img src={h1} className='h-5' /> */}
          <div className='relative flex w-fit flex-col items-center'>
            {itemIsFavorited ? (
              <div onClick={handleFavoriteRemove}>
                <img src={heartFilled} className='absolute right-7 top-6 h-5' />
              </div>
            ) : (
              <div onClick={handleFavoriteAdd} className='w-fit'>
                <img src={heartBlanc} className='absolute right-7 top-6 h-5' />
              </div>
            )}
            <div className='min-h-[560px] w-[424px] '>
              <img
                src={
                  singleProduct.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || singleProduct.images[0].imageURL
                }
                alt='single product view'
                className='h-[560px] w-[424px] border border-black object-cover'
              />
            </div>
          </div>
        </section>

        <section className='product-details flex max-w-[900px] basis-3/5 flex-col items-center px-12'>
          <div className='product-desc flex flex-col items-center'>
            <h1 className='product-name pb-9 font-federo text-[1.5rem]'>
              {singleProduct.productName.toUpperCase()}
            </h1>

            <div className='star-section flex self-start pb-8'>
              <img src={starFilled} className=' h-4' />
              <img src={starFilled} className='h-4' />
              <img src={starFilled} className='h-4' />
              <img src={starFilled} className='h-4' />
              <img src={starFilled} className='h-4' />
              <p className='pl-2 font-grotesque'> {overallReviewScore()}</p>
            </div>

            <div className='flex flex-col items-center text-center'>
              <p className='product-long-desc py-5 pb-20 font-grotesque text-lg'>
                {singleProduct.productShortDesc} Retinol stimulates the
                synthesis of collagen and elastin to combat loss of firmness and
                wrinkles. This retinol serum visibly improves fine lines and
                smooths skin. 99% naturally derived. Vegan. Made in France.
              </p>

              <div className='price-counter my-5 flex flex-col items-center'>
                <p className='price font-grotesque text-xl font-medium'>
                  ${singleProduct.price}
                </p>

                <div className='qty-counter mb-14 mt-4 flex h-fit w-fit items-center gap-2 rounded-full border border-black px-2'>
                  <div onClick={qtyDecrementor}>
                    <img src={minus} className='w-5' />
                  </div>
                  <div className='count px-4 font-grotesque text-lg font-medium'>
                    {count}
                  </div>

                  <div
                    onClick={qtyIncrementor}
                    className='incrementor cursor-pointer'
                  >
                    <img src={plus} className='w-5' />
                  </div>
                </div>

                <button
                  onClick={handleClick}
                  className='rounded-sm bg-charcoal px-32 py-2 font-italiana text-[1.5rem] uppercase text-white'
                >
                  add to cart
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className='pb-5 pt-32 text-center font-federo text-lg uppercase'>
              why we love it
            </h2>
            <p className='pb-36 text-center font-grotesque'>
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
      </div>

      <section className='ingredients-container flex max-w-[1400px] flex-row-reverse justify-center gap-5'>
        <div className='bg-img basis-3/5 px-12'>
          <img src={bgImg} />
        </div>
        <div className='ingredients flex basis-2/5 flex-col gap-6 pt-16'>
          <h3 className='font-aurora text-3xl'>key ingredients</h3>
          {func().map((el) => {
           return (
             <p className="font-grotesque text-xl">
               {' '}
               <span className='font-grotesque font-bold uppercase text-xl'>{el.split(':')[0]}</span>:  {el.split(':')[1]}
             </p>
           );
          })}
        </div>
      </section>

      {/* PRODUCT SUGGESTIONS */}
      <section className='product-suggestions pt-52'>
        <ProductCarousel products={singleProduct.relatedProducts} num={4}/>
        <h2 className='text-5xl font-marcellus'>YOU MAY ALSO LIKE</h2>
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
