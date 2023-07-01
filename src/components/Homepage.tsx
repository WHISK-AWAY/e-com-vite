import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  ProductState,
  TProduct,
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';
import { randomProduct } from './AllProducts/AllProducts';

import handLotion from '../assets/vid/homapage/hand-lotion.mp4';
import rainLeaves from '../assets/vid/homapage/rain-leaves.mp4';
import rainbowLady from '../assets/bg-img/homepage/rainbow-lady.jpg';
import { useEffect, useState } from 'react';

export default function Homepage() {
  const dispatch = useAppDispatch();

  const allProducts = useAppSelector(selectAllProducts);
  const [randomProd, setRandomProd] = useState<TProduct>();

  useEffect(() => {
    if (!allProducts.products.length) {
      dispatch(
        fetchAllProducts({
          page: 1,
          sort: { direction: 'asc', key: 'productName' },
          filter: 'all',
        })
      );
    } else {
      setRandomProd(randomProduct(allProducts));
    }
  }, [allProducts]);

  // console.log('AP', allProducts)
  if (!randomProd) return <p>...loading</p>;
  return (
    <div className='relative flex h-full w-screen flex-col justify-center  '>
      <div className=' relative flex h-[calc(100dvh_-_64px)] w-full justify-center  self-center px-5 lg:px-10'>
        <video
          src={handLotion}
          loop={true}
          autoPlay={true}
          className='aspect-[1/2] h-full basis-1/2 translate-x-1 items-center justify-center object-cover'
        />
        <video
          src={rainLeaves}
          loop={true}
          autoPlay={true}
          className='aspect-[1/2] h-full  basis-1/2 -translate-x-1  items-center justify-center object-cover'
        />

        <div className=' absolute right-1/2 top-1/2 flex -translate-y-[120%] translate-x-[50%] flex-col items-center justify-center mix-blend-difference'>
          <h1 className=' font-yantramanav font-xbold uppercase leading-none tracking-wide text-emerald-50 md:text-8xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[12rem]  '>
            discover
          </h1>
        </div>
        <div className=' absolute right-1/2 top-[45%] flex -translate-y-[5%] translate-x-[55%] flex-col items-center justify-center leading-none'>
          <h2 className='  items-center self-center font-raleway font-xtralight uppercase text-white md:text-4xl md:tracking-[3rem] lg:text-5xl lg:tracking-[5rem] xl:text-6xl xl:tracking-[5rem] 2xl:text-8xl 2xl:tracking-[7rem]'>
            skincare
          </h2>
          <h3 className=' absolute top-[120%] translate-x-[80%] font-raleway font-thin text-white lg:text-lg xl:text-xl 2xl:text-3xl'>
            your skin loves
          </h3>
        </div>
        <Link
          to='/shop-all'
          className='absolute bottom-0 right-[5%] -translate-y-[60%] rounded-sm border border-white px-[4%]  py-1 font-raleway font-thin text-white md:text-xs 2xl:text-lg'
        >
          shop now
        </Link>
      </div>

      <div className='flex flex-col py-[7%]'>
        <p className='self-center px-[11%] text-center font-aurora text-lg text-charcoal xl:text-2xl 2xl:text-5xl'>
          our philosophy is not to add anything to our products to make them
          stand out; instead we pare them back and distill each formula down to
          the most-essential, natural active ingredients.
        </p>
      </div>

      <div className='rainbow-lady relative flex  h-full w-screen  items-start  '>
        <img
          src={rainbowLady}
          alt='red haired ladys profile with reflection of a rainbow on her face'
          className='w-[60%] -translate-x-[15%]  '
        />
        <div className=''>
          <p className='absolute right-[50%] top-0 text-start font-yantramanav font-bold uppercase text-light-brick mix-blend-color-dodge md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10vw]'>
            protect
          </p>
          <p className='absolute left-[52%] top-[6%] whitespace-nowrap text-center font-yantramanav font-light  md:text-xl lg:text-2xl xl:text-3xl 2xl:text-[3vw]'>
            your skin
          </p>
          <p className='absolute left-[4%] top-[10%] whitespace-nowrap text-center font-yantramanav font-light uppercase tracking-wide text-[#262625]/80 md:text-5xl lg:text-[4rem] xl:text-[5rem] 2xl:text-[6vw]'>
            from harmful uva & uvb rays
          </p>
        </div>

        <div className='flex w-[40%] flex-col'>
          <div className=' flex w-[90%] flex-col items-center justify-center'>
            <img
              className='pt-[60%] '
              src={
                randomProd!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd!.images[0].imageURL
              }
            />
            <Link to={'/product/' + randomProd!._id}>
              <p className=' pb-3  pt-7 text-center font-hubbali  text-[2vw] uppercase'>
                {randomProd!.productName}
              </p>
            </Link>
            {/* <p className='text-center font-grotesque text-sm lg:text-lg  xl:text-2xl'>
              ${randomProd!.price}
            </p> */}
          </div>
          <p className='absolute right-[20%] top-[70%] w-[40vw] font-aurora leading-loose text-[#262625]'>
            during the summer months, it's essential to keep your skin
            moisturized and hydrated wherever possible. however, it's important
            to switch high-intensity heavy creams in favor of lighter
            formulations at this time of year.
          </p>
        </div>
      </div>

      {/* <div className='pb-96'></div> */}
    </div>
  );
}
