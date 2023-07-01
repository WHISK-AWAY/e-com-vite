import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { TProduct, selectAllProducts } from '../redux/slices/allProductSlice';
import { randomProduct } from './AllProducts/AllProducts';
import { useEffect, useState } from 'react';

import handLotion from '../assets/vid/homapage/hand-lotion.mp4';
import rainLeaves from '../assets/vid/homapage/rain-leaves.mp4';
import bwSeizure from '../assets/vid/homapage/bw-seizure.mp4';
import rainbowLady from '../assets/bg-img/homepage/rainbow-lady.jpg';
import beachLady from '../assets/bg-img/homepage/beach-lady.jpg';
import grapefrutButt from '../assets/bg-img/homepage/grapefruit-butt.jpg';
import ladyMask from '../assets/bg-img/homepage/lady-mask.jpg';
import ladyFacewash from '../assets/bg-img/homepage/lady-facewash.jpg';
import papaya from '../assets/bg-img/homepage/papaya.jpg';
import coconutHand from '../assets/bg-img/homepage/coconut-hand.jpg';
import melon from '../assets/bg-img/homepage/melon.jpg';
import legBrush from '../assets/vid/homapage/leg-brush.mp4';

export default function Homepage() {
  const allProducts = useAppSelector(selectAllProducts);
  const [randomProd, setRandomProd] = useState<TProduct>();

  useEffect(() => {
    setRandomProd(randomProduct(allProducts));
  }, [randomProd]);

  // console.log('AP', allProducts)
  if (!randomProd) return <p>...loading</p>;
  return (
    <div className='relative flex h-full w-screen flex-col justify-center overflow-hidden '>
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

      <div className='rainbow-lady relative mb-[25%]  flex h-full  w-screen items-start'>
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
            <Link to={'/product/' + randomProd!._id}>
              <img
                className='pt-[55%] '
                src={
                  randomProd!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd!.images[0].imageURL
                }
              />
            </Link>
          </div>
          <p className='absolute bottom-[5%] right-[9%] w-[50vw] font-aurora text-[2.5vw] leading-loose text-[#262625]'>
            during the summer months, it's essential to keep your skin
            moisturized and hydrated wherever possible. however, it's important
            to switch high-intensity heavy creams in favor of lighter
            formulations at this time of year.
          </p>
        </div>
      </div>

      <div className='flex  w-full flex-col items-center '>
        <div className='relative flex  w-full flex-col items-center bg-[#383838]'>
          <p className='absolute right-1/2 top-0 -translate-y-[70%] translate-x-[50%] font-yantramanav text-[15vw] font-bold uppercase leading-none tracking-[.5rem] text-light-brick '>
            beach
          </p>
          <p className='absolute right-1/2 top-0 flex -translate-y-[9%] translate-x-[50%] flex-col font-yantramanav text-[4vw] font-thin uppercase tracking-[.7rem] text-white '>
            ready
          </p>

          <div className='flex w-[45%] justify-center self-center  pt-[10%]'>
            <div className='flex  justify-center'>
              <Link
                to={'/product/' + randomProd!._id}
                className='flex justify-center'
              >
                <img
                  className='aspect-[4/6]  w-[80%] object-cover '
                  src={
                    randomProd!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd!.images[0].imageURL
                  }
                />
              </Link>
            </div>

            <div className='flex justify-center'>
              <Link
                to={'/product/' + randomProd!._id}
                className='flex justify-center'
              >
                <img
                  className='aspect-[4/6] w-[80%] object-cover'
                  src={
                    randomProd!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd!.images[0].imageURL
                  }
                />
              </Link>
            </div>
          </div>
          <p className='absolute top-0 z-10 flex w-[25%] translate-y-[144%] flex-col text-center font-aurora text-[2vw] text-black '>
            heavy moisturizers are ideal for cold climates or during winter when
            <span className='text-white'>
              the air is dryer but they can be too cloying during the heat of
              summer and don't provide adequate
            </span>
          </p>

          <div className='  w-[80%]  pt-[2%]'>
            <img
              src={beachLady}
              alt='lady with a big white hat is laying on the beach'
              className='aspect-[4/3] w-full object-cover'
            />
          </div>

          <div className=' relative flex h-full  w-[80%]  justify-center gap-10'>
            <div className='text-container flex w-full flex-col'>
              <div className='absolute left-0 top-0 h-[75%] w-[22%] -translate-y-[15%] translate-x-[40%] rounded-full bg-black/20'>
                <p className=' absolute right-0 top-0 w-[80%] -translate-x-[9%] translate-y-[120%] text-start font-aurora text-[1.4vw] leading-relaxed text-white'>
                  heavy moisturizers are ideal for cold climates or during
                  winter when the air is dryer but they can be too cloying
                  during the heat of summer and don't provide adequate
                </p>
              </div>
            </div>
            <div className='video-section flex  h-full  max-h-screen w-full -translate-x-[60%] -translate-y-[15%] justify-center'>
              <video
                src={bwSeizure}
                autoPlay={true}
                muted={true}
                loop={true}
                className='aspect-[4/6] w-[70%]   '
              />
            </div>
            <div className='product-section  absolute right-0 top-2 w-[50%] translate-x-[5%]'>
              {' '}
              <Link to={'/product/' + randomProd!._id} className=' flex flex-col items-center '>
                <img
                  className='aspect-[5/6] w-[50%] object-cover pt-[2%]'
                  src={
                    randomProd!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd!.images[0].imageURL
                  }
                />
                <p className='pt-2 font-hubbali text-[1.2vw] w-fit text-center self-center flex-wrap uppercase text-white'>
                  {randomProd.productName}
                </p>
              </Link>
            </div>
          </div>

          <div className='w-[55%] pb-[7%] text-center font-aurora text-[1.2vw] leading-loose text-white '>
            <p>
              heavy moisturizers are ideal for cold climates or during winter
              when the air is dryer but they can be too cloying during the heat
              of summer and don't provide adequate
            </p>
          </div>

          <div className='mb-[5%] flex w-full flex-col items-center'>
            <img
              src={grapefrutButt}
              alt='lady  wearing nude leotard holding  grapefruit cut in half pressed to her hips'
              className='z-10 aspect-square w-[30%] object-cover'
            />
            <div className=' h-full text-center'>
              <p className='-translate-y-[40%] pl-7 font-roboto text-[16vw] font-xbold uppercase  leading-none tracking-[2.5rem] text-white '>
                treat
              </p>
              <p className='-translate-y-[60%] font-bodoni text-[16vw] font-thin uppercase leading-none  text-white'>
                your skin
              </p>
              <p className='-translate-y-[390%] font-raleway text-[3vw] font-light uppercase leading-none  text-white/40'>
                to
              </p>
              <p className='right-1/2 -translate-y-[85%] whitespace-nowrap font-roboto text-[16vw] font-xbold uppercase leading-none  text-white'>
                something
              </p>
              <p className='-translate-y-[105%] font-roboto text-[16vw] font-bold uppercase leading-none text-white'>
                special
              </p>
            </div>
            <Link
              to='/shop-all'
              state={{ filterKey: 'body' }}
              className='relative -translate-y-[250%] border border-white bg-transparent px-[6vw] py-[1.1vw] font-raleway text-[1vw] font-light text-white'
            >
              shop body
            </Link>
          </div>
        </div>
      </div>

      <div className='flex w-full flex-col items-center'>
        <p className=' -translate-y-[50%]  font-yantramanav text-[10vw] font-xxbold uppercase tracking-widest text-charcoal/60 mix-blend-difference'>
          unleash{' '}
        </p>
        <p className='-translate-y-[550%] font-raleway text-[2vw] font-thin leading-none tracking-wide'>
          the power of
        </p>
      </div>

      <div className='flex w-[90%] max-w-[1940px] -translate-y-[6%] flex-row-reverse justify-center self-center '>
        <div className='flex w-full flex-row-reverse justify-center '>
          <img
            src={ladyMask}
            alt=''
            className='h-screen  w-[3/5] object-cover '
          />

          <div className=' relative flex w-2/5  flex-col justify-end gap-10'>
            <p className=' font-yantramanav text-[9vw] font-semibold uppercase 2xl:text-[9rem]'>
              <span className='absolute -right-4 top-0 translate-y-[60%]  tracking-[2.9rem] text-[#262626] 2xl:translate-y-0'>
                hyd
              </span>
              <span className='absolute right-0 top-0 translate-x-[102%] translate-y-[60%] tracking-[1rem] text-white  2xl:translate-y-0'>
                ration
              </span>
            </p>
            <Link
              to={'/product/' + randomProd!._id}
              className='flex w-[70%]  flex-col items-center self-end'
            >
              <img
                className='aspect-[1/2] w-fit object-cover md:h-[250px] lg:h-[350px] xl:h-[350px] 2xl:h-[550px] min-[1736px]:h-[800px]'
                src={
                  randomProd!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd!.images[0].imageURL
                }
              />
              <p className='w-[90%] pt-2 text-center font-hubbali text-[1.2vw]  uppercase text-charcoal'>
                {randomProd.productName}
              </p>
            </Link>

            <Link
              to='/shop-all'
              state={{ filterKey: 'body' }}
              className=' mr-8  w-[60%] self-end border border-[#262626] bg-transparent px-[3vw] py-[1vw] text-center font-raleway text-[1.1vw] font-light text-[#262626]'
            >
              shop body
            </Link>
          </div>
        </div>
      </div>

      <div className='relative flex  flex-col items-center justify-center pt-[25%]'>
        <div className='absolute right-0 top-0  flex w-[50%] -translate-x-[40%] translate-y-[55%] items-center justify-between gap-[10%] '>
          <p className='w-full text-center font-aurora text-[1.5vw] text-[#262626]'>
            heavy moisturizers are ideal for cold climates or during winter when
            the air is dryer but they can be too cloying during the heat of
            summer and don't provide adequate
          </p>

          <Link to={'/product/' + randomProd!._id} className='flex w-full '>
            <img
              className='aspect-[8/9] w-[90%] object-cover '
              src={
                randomProd!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd!.images[0].imageURL
              }
            />
          </Link>
        </div>

        <div className='flex w-full  flex-col '>
          <img
            src={ladyFacewash}
            alt=''
            className='aspect-[4/6] h-screen self-center'
          />
          <p className='w-[25%] -translate-x-[50%] -translate-y-[300%] self-end text-center font-aurora text-[1.5vw] text-[#262626]'>
            heavy moisturizers are ideal for cold climates or during winter when
            the air is dryer but they can be too cloying during the heat of
            summer and don't provide adequate
          </p>
        </div>
      </div>

      <div className='flex w-[90%] max-w-[1440px] self-center '>
        <div className='flex h-screen  w-[65%] border '>
          <img
            src={papaya}
            alt='ripe papaya cut in half'
            className='grow-1 aspect-[2/3] w-full shrink-0  object-cover'
          />
          <div className='relative flex w-[1/4] shrink-0 grow-0 flex-col whitespace-nowrap '>
            <p className='relative font-archivo text-[14vw] uppercase 2xl:text-[15rem]'>
              <span className='absolute left-0 top-0 -translate-x-[100%] text-white'>
                we u
              </span>
              <span className='absolute left-0 top-0  text-[#262626]'>se</span>
            </p>
          </div>
        </div>

        <div className=' relative flex w-[35%] max-w-[500px] flex-col items-center justify-end pl-[2%] '>
          <p className='absolute left-1 top-[16vw] whitespace-nowrap font-raleway text-[1.5vw] font-light 2xl:top-[270px]'>
            only best ingredients for best results
          </p>
          <Link
            to={'/product/' + randomProd!._id}
            className='flex w-full flex-col min-[2500px]:pb-[300px]'
          >
            <img
              className='aspect-[3/5]   max-h-[450px] object-cover  pl-[8%]'
              src={
                randomProd!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd!.images[0].imageURL
              }
            />
            <p className='pt-2 text-center font-hubbali text-[1.2vw] uppercase text-charcoal'>
              {randomProd.productName}
            </p>
          </Link>
        </div>
      </div>
      <div className='flex w-[80%] items-center justify-center self-center pb-[6%] pt-[5%] leading-loose'>
        <p className='text-center font-aurora text-[1.4vw]'>
          heavy moisturizers are ideal for cold climates or during winter when
          the air is dryer but they can be too cloying during the heat of summer
          and don't provide adequate{' '}
        </p>
      </div>

      <div className='flex h-[500px] w-[80%] justify-center gap-9 self-center pb-[4%]'>
        <img
          src={coconutHand}
          alt='hand is reaching for a coconut cut in half'
          className='aspect-[1/2] w-[30%] object-cover'
        />
        <img
          src={melon}
          alt='melon cut in half'
          className='aspect-[1/2] w-[30%] object-cover'
        />
        <video
          src={legBrush}
          muted={true}
          loop={true}
          autoPlay={true}
          className='aspect-[1/2] w-[30%] items-center justify-center object-cover'
        />
      </div>
      {/* <div className='pb-96'></div> */}
    </div>
  );
}
