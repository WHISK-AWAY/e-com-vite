import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  TProduct,
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';
import { randomProduct } from './AllProducts/AllProducts';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lazysizes';

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

gsap.registerPlugin(ScrollTrigger);

export default function Homepage() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectAllProducts);
  const [randomProd, setRandomProd] = useState<TProduct>();
  const grapefruitButtRef = useRef(null);
  const specialRef = useRef(null);
  const treatRef = useRef<HTMLDivElement>(null);
  const shopBodyRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!allProducts.products.length) {
      dispatch(
        fetchAllProducts({
          filter: 'all',
          page: 1,
          sort: { direction: 'asc', key: 'productName' },
        })
      );
    } else {
      setRandomProd(randomProduct(allProducts));
    }
  }, [allProducts]);

  useLayoutEffect(() => {
    if (
      !grapefruitButtRef.current ||
      !treatRef.current ||
      !specialRef.current ||
      !shopBodyRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({});
      tl.to(grapefruitButtRef.current, {
        scrollTrigger: {
          trigger: grapefruitButtRef.current,
          pin: true,
          start: 'top 64px',
          endTrigger: treatRef.current,
          end: 'bottom 45%',
        },
      });

      tl.from('p', {
        duration: 4,
        opacity: 0,
        ease: 'power4.out',
        y: 20,
        scrollTrigger: {
          scrub: 1,
          trigger: treatRef.current,
          start: 'top 70%',
          end: 'bottom center',
        },
      });
    }, treatRef);

    return () => {
      ctx.revert();
    };
  }, [
    grapefruitButtRef.current,
    shopBodyRef.current,
    specialRef.current,
    treatRef.current,
  ]);

  if (!randomProd) return <p>...loading</p>;
  return (
    <div
      className=' relative flex h-full w-screen flex-col justify-center overflow-hidden '
      onLoad={() => ScrollTrigger.refresh()}
    >
      <div className=' relative flex h-[calc(100dvh_-_64px)] w-full justify-center  self-center px-5 lg:px-10'>
        <video
          data-src={handLotion}
          data-sizes='auto'
          loop={true}
          autoPlay={true}
          muted={true}
          className='lazyload -z-10 aspect-[1/2] h-full basis-1/2 translate-x-1 items-center justify-center object-cover'
        />
        <video
          data-src={rainLeaves}
          data-sizes='auto'
          loop={true}
          autoPlay={true}
          muted={true}
          className='lazyload -z-10 aspect-[1/2] h-full  basis-1/2 -translate-x-1  items-center justify-center object-cover'
        />

        <div className=' absolute right-1/2 top-1/2 flex -translate-y-[120%] translate-x-[50%] flex-col items-center justify-center mix-blend-difference'>
          <h1 className=' font-yantramanav font-xbold uppercase leading-none tracking-wide text-emerald-50 md:text-8xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[12rem]  '>
            discover
          </h1>
        </div>
        <div className=' absolute right-1/2 top-[45%] flex -translate-y-[5%] translate-x-[55%] flex-col items-center justify-center leading-none'>
          <h2 className='  items-center self-center font-raleway font-light uppercase text-white md:text-4xl md:tracking-[3rem] lg:text-5xl lg:tracking-[5rem] xl:text-6xl xl:tracking-[5rem] 2xl:text-8xl 2xl:tracking-[7rem]'>
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
        <p className='self-center px-[11%] text-center font-aurora text-[1.5vw] text-charcoal'>
          our philosophy is not to add anything to our products to make them
          stand out; instead we pare them back and distill each formula down to
          the most-essential, natural active ingredients.
        </p>
      </div>

      <div className='rainbow-lady relative mb-[25%]  flex h-full  w-screen items-start'>
        <img
          data-src={rainbowLady}
          data-sizes='auto'
          alt='red haired ladys profile with reflection of a rainbow on her face'
          className='lazyload w-[60%] -translate-x-[15%]  '
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
                className='lazyload pt-[55%] '
                data-src={
                  randomProd!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd!.images[0].imageURL
                }
                data-sizes='auto'
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
          <p className='absolute right-1/2 top-0 -translate-y-[70%] translate-x-[50%] font-yantramanav text-[15vw] font-bold uppercase leading-none tracking-[.5rem] text-light-brick mix-blend-screen'>
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
                  className='lazyload aspect-[4/6]  w-[80%] object-cover '
                  data-src={
                    randomProd!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd!.images[0].imageURL
                  }
                  data-sizes='auto'
                />
              </Link>
            </div>

            <div className='flex justify-center'>
              <Link
                to={'/product/' + randomProd!._id}
                className='flex justify-center'
              >
                <img
                  className='lazyload aspect-[4/6] w-[80%] object-cover'
                  data-src={
                    randomProd!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd!.images[0].imageURL
                  }
                  data-sizes='auto'
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

          <div className='w-[80%] pt-[2%]'>
            <img
              data-src={beachLady}
              data-sizes='auto'
              alt='lady with a big white hat is laying on the beach'
              className='lazyload aspect-auto h-3/4 w-full object-cover'
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
                data-src={bwSeizure}
                data-sizes='auto'
                autoPlay={true}
                muted={true}
                loop={true}
                className='lazyload aspect-[4/6] w-[70%]'
              />
            </div>
            <div className='product-section absolute right-0 top-2 w-[50%] translate-x-[5%]'>
              {' '}
              <Link
                to={'/product/' + randomProd!._id}
                className=' flex flex-col items-center '
              >
                <img
                  className='lazyload aspect-[5/6] w-[50%] object-cover pt-[2%]'
                  data-src={
                    randomProd!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd!.images[0].imageURL
                  }
                  data-sizes='auto'
                />
                <p className='w-fit flex-wrap self-center pt-2 text-center font-hubbali text-[1.2vw] uppercase text-white'>
                  {randomProd.productName}
                </p>
              </Link>
            </div>
          </div>

          <div className='w-[55%] pb-[7%] text-center font-aurora text-[1.2vw] leading-loose text-white'>
            <p>
              heavy moisturizers are ideal for cold climates or during winter
              when the air is dryer but they can be too cloying during the heat
              of summer and don't provide adequate
            </p>
          </div>

          <div className='z-10 mb-[5%] flex  w-full flex-col items-center'>
            <div
              ref={treatRef}
              className=' flex h-full flex-col self-center text-center'
            >
              <div
                ref={grapefruitButtRef}
                className='z-10 h-fit w-[30%] self-center border'
              >
                <img
                  data-src={grapefrutButt}
                  data-sizes='auto'
                  alt='lady  wearing nude leotard holding  grapefruit cut in half pressed to her hips'
                  className='lazyload aspect-square object-cover'
                />
              </div>
              <p className='relative -z-20 -translate-y-[40%] pl-7 font-roboto text-[17vw] font-xbold uppercase  leading-none tracking-[2.5rem] text-white '>
                treat
              </p>
              <p className='relative z-20 -translate-y-[60%] font-bodoni text-[17vw] font-thin uppercase leading-none  text-white'>
                your skin
              </p>
              <p className='-translate-y-[400%] font-raleway text-[3vw] font-light uppercase leading-none  text-white/40'>
                to
              </p>
              <p className='right-1/2 -translate-y-[85%] whitespace-nowrap font-roboto text-[17vw] font-xbold uppercase leading-none  text-white'>
                something
              </p>
              <p
                ref={specialRef}
                className='-translate-y-[105%] font-roboto text-[17vw] font-bold uppercase leading-none text-white'
              >
                special
              </p>
            </div>
            <Link
              to='/shop-all'
              ref={shopBodyRef}
              state={{ filterKey: 'body' }}
              className='relative z-20 -translate-y-[250%] border border-white bg-transparent px-[6vw] py-[1.1vw] font-raleway text-[1vw] font-light text-white'
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
            data-src={ladyMask}
            data-sizes='auto'
            alt='woman applying mask to her face'
            className='lazyload h-screen  w-[3/5] object-cover '
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
              className='flex w-[70%] flex-col  items-center self-end pr-[15%]'
            >
              <img
                className='lazyload aspect-[1/2] w-fit object-cover md:h-[290px] lg:h-[400px] xl:h-[450px] 2xl:h-[650px] min-[1600px]:h-[800px]'
                data-src={
                  randomProd!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd!.images[0].imageURL
                }
                data-sizes='auto'
              />
              <p className='w-[90%] pt-2 text-center font-hubbali text-[1.2vw]  uppercase text-charcoal'>
                {randomProd.productName}
              </p>
            </Link>

            <Link
              to='/shop-all'
              state={{ filterKey: 'body' }}
              className=' mr-[12%]  w-[60%] self-end border border-[#262626] bg-transparent px-[3vw] py-[1vw] text-center font-raleway text-[1.1vw] font-light text-[#262626]'
            >
              shop body
            </Link>
          </div>
        </div>
      </div>

      <div className='relative flex  flex-col items-center justify-center pt-[25%]'>
        <div className='absolute right-0 top-0  flex w-[45%] -translate-x-[50%] translate-y-[55%] items-center justify-between gap-[10%] '>
          <p className='w-full -translate-x-[20%] text-center font-aurora text-[1.5vw] text-[#262626]'>
            heavy moisturizers are ideal for cold climates or during winter when
            the air is dryer but they can be too cloying during the heat of
            summer and don't provide adequate
          </p>

          <Link to={'/product/' + randomProd!._id} className='flex w-full '>
            <img
              className='lazyload aspect-[7/9] w-full object-cover '
              data-src={
                randomProd!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd!.images[0].imageURL
              }
              data-sizes='auto'
            />
          </Link>
        </div>

        <div className='flex w-full flex-col '>
          <img
            data-src={ladyFacewash}
            data-sizes='auto'
            alt='lady washing her face in the bathroom with white towel on her head'
            className='lazyload aspect-[4/6] h-screen self-center'
          />
          <p className='w-[17%] -translate-x-[110%] -translate-y-[250%] self-end text-center font-aurora text-[1.5vw] text-[#262626] min-[1600px]:-translate-x-[155%]  min-[1600px]:-translate-y-[125%]'>
            heavy moisturizers are ideal for cold climates or during winter when
            the air is dryer but they can be too cloying during the heat of
            summer and don't provide adequate
          </p>
        </div>
      </div>

      <div className='flex w-[90%] max-w-[1440px] self-center '>
        <div className='flex h-screen  w-[65%] border '>
          <img
            data-src={papaya}
            data-sizes='auto'
            alt='ripe papaya cut in half'
            className='lazyload grow-1 aspect-[2/3] w-full shrink-0  object-cover '
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
          <p className='absolute left-2 top-[16vw] whitespace-nowrap font-raleway text-[1.3vw] font-light 2xl:top-[270px] '>
            only best ingredients for best results
          </p>
          <Link
            to={'/product/' + randomProd!._id}
            className='flex h-3/4 w-full flex-col  pt-[13%] min-[2500px]:pt-[200px]'
          >
            <img
              className='lazyload aspect-[3/5] object-cover pl-[8%] min-[2500px]:max-h-[750px]'
              data-src={
                randomProd!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd!.images[0].imageURL
              }
              data-sizes='auto'
            />
            <p className='pt-[4%] text-center font-hubbali text-[1vw] uppercase text-charcoal'>
              {randomProd.productName}
            </p>
          </Link>
        </div>
      </div>
      <div className='flex w-[70%] items-center justify-center self-center pb-[6%] pt-[5%] leading-loose'>
        <p className='text-center font-aurora text-[1.4vw]'>
          heavy moisturizers are ideal for cold climates or during winter when
          the air is dryer but they can be too cloying during the heat of summer
          and don't provide adequate{' '}
        </p>
      </div>

      <div className='flex h-full w-[80%] justify-center self-center pb-[6%]'>
        <div className='flex h-[40dvh] gap-9 2xl:h-[50dvh]'>
          <img
            data-src={coconutHand}
            data-sizes='auto'
            alt='hand is reaching for a coconut cut in half'
            className='lazyload aspect-[1/2] w-[30%] object-cover'
          />
          <img
            data-src={melon}
            data-sizes='auto'
            alt='melon cut in half'
            className='lazyload aspect-[1/2] w-[30%] object-cover'
          />
          <video
            data-src={legBrush}
            data-sizes='auto'
            muted={true}
            loop={true}
            autoPlay={true}
            className='lazyload aspect-[1/2] w-[30%] items-center justify-center object-cover'
          />
        </div>
      </div>
      {/* <div className='pb-96'></div> */}
    </div>
  );
}
