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
import rainLeaves from '../assets/vid/homapage/leaves.mp4';
import bwSeizure from '../assets/vid/homapage/bw-seizure.mp4';
import rainbowLady from '../assets/bg-img/homepage/rainbow-lady.jpg';
import beachLady from '../assets/bg-img/homepage/beach-lady.jpg';
import grapefruitButt from '../assets/bg-img/homepage/grapefruit-butt.jpg';
import ladyMask from '../assets/bg-img/homepage/lady-mask.jpg';
import ladyFacewash from '../assets/bg-img/homepage/lady-facewash.jpg';
import papaya from '../assets/bg-img/homepage/papaya.jpg';
import coconutHand from '../assets/bg-img/homepage/coconut-hand.jpg';
import melon from '../assets/bg-img/homepage/melon.jpg';
import legBrush from '../assets/vid/homapage/leg-brush.mp4';
import Preloader from './Preloader';
import { CSSPlugin } from 'gsap/CSSPlugin';
import Lenis from '@studio-freight/lenis';
gsap.registerPlugin(CSSPlugin);
import '../index.css';

export default function Homepage() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectAllProducts);
  const [randomProd, setRandomProd] = useState<TProduct>();
  const [randomProd01, setRandomProd01] = useState<TProduct>();
  const [randomProd02, setRandomProd02] = useState<TProduct>();
  const [randomProd03, setRandomProd03] = useState<TProduct>();
  const [randomProd04, setRandomProd04] = useState<TProduct>();
  const [randomProd05, setRandomProd05] = useState<TProduct>();
  const [randomProd06, setRandomProd06] = useState<TProduct>();
  const grapefruitButtRef = useRef(null);
  const specialRef = useRef(null);
  const treatRef = useRef<HTMLDivElement>(null);
  const shopBodyRef = useRef<HTMLAnchorElement>(null);
  // const shopBodyButtonRef = useRef(null)

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
      setRandomProd01(randomProduct(allProducts));
      setRandomProd02(randomProduct(allProducts));
      setRandomProd03(randomProduct(allProducts));
      setRandomProd04(randomProduct(allProducts));
      setRandomProd05(randomProduct(allProducts));
      setRandomProd06(randomProduct(allProducts));
    }
  }, [allProducts]);

  gsap.registerPlugin(ScrollTrigger);

  useLayoutEffect(() => {
    if (
      !grapefruitButtRef.current ||
      !treatRef.current ||
      !specialRef.current ||
      !shopBodyRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // const tl = gsap.timeline({});
      gsap.to(grapefruitButtRef.current, {
        scrollTrigger: {
          trigger: grapefruitButtRef.current,
          pin: true,
          start: 'top 64px',
          endTrigger: treatRef.current,
          end: 'bottom 62%',
        },
      });

      gsap.from('.anim-text', {
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
      // tl.from(shopBodyButtonRef.current, {
      //   duration: 0.4,
      //   start: 'bottom bottom',
      //   onEnter:() => gsap.to(shopBodyButtonRef.current, {√
      //     backgroundColor: 'white',
      //     duration: 5,
      //   })
      // })
    }, treatRef.current);

    return () => {
      ScrollTrigger.refresh();
      ctx.revert();
    };
  });

  const handsRef = useRef(null);
  const leavesRef = useRef(null);

  //   useLayoutEffect(() => {

  //     if(!handsRef.current || !leavesRef.current) return
  // const ctx = gsap.context(()=> {
  // const tl = gsap.timeline();
  //   tl.set('.leaves, .hands', {
  //     display: 'none',
  //     // height: 0,
  //     overflow: 'hidden',
  //     width: 0,

  //   })

  //   tl.from(leavesRef.current, {
  //     xPercent: 100,
  //     duration: 1.5,
  //     width: '100%',
  //     overflow: 'hidden',
  //     // display: 'block',
  //     object: 'cover',
  //     // delay: 2,
  //     ease: 'expo.inOut'
  //   }, '<')

  //     tl.to(leavesRef.current, {
  //     // xPercent: -100,
  //     // height: '41%',
  //     // height: '100%',
  //     // delay: .3,
  //     ease: 'expo.inOut',
  //     duration: 1,
  //     object: 'cover',
  //     // xPercent: 100,
  //     // width: '1000vw',
  //     // overflow: 'hidden',
  //     display: 'block',
  //     width: '100%',
  //     // transformOrigin: 'left center'
  //   }, '<')

  //   tl.to(handsRef.current, {
  //     overflow: 'hidden',
  //     ease: 'expo.inOut',
  //     width: '40%',
  //     duration: 2,
  //   object: 'right',
  //     delay: 1,
  //     display: 'block',
  //     // object: 'cover'

  //   })

  // })

  // return (() => {
  //     ctx.revert()
  // })
  //   })

  useEffect(() => {
    if (
      !document.querySelector('.landing-section-content') ||
      !document.querySelector('.philosophy-section-content') ||
      !document.querySelector('.rainbow-lady') ||
      !document.querySelector('.rainbow-lady-rp') ||
      !document.querySelector('.beach-section-content')
    )
      return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({});

      tl.to('.landing-section-content', {
        yPercent: 100,
        ease: 'none',
        // opacity: 0,
        // delay: 2,
        duration: 1,
        scrollTrigger: {
          trigger: '.philosophy-section-content',
          start: 'top bottom',
          end: 'top top',
          // pin: true,
          scrub: true,
        },
      });

      gsap.from('.philosophy-text', {
        opacity: 0,
        // duration: 2,
        ease: 'circ.out',
        yPercent: 400,
        // backgroundColor: '#000',
        scrollTrigger: {
          scrub: true,
          trigger: '.philosophy-text',
          start: 'center bottom',
          // markers: true,
          end: 'bottom 50%',
        },
      });

      gsap.from('.rainbow-lady', {
        opacity: 0,
        x: -300,
        ease: 'slow',
        duration: 3,
        scrollTrigger: {
          scrub: true,
          trigger: '.rainbow-lady',
          start: 'top 110%',
          end: 'center 70%',
          //  pin: true
        },
      });

      gsap.from('.your-skin-text, .uv-rays-text', {
        opacity: 0,
        ease: 'slow.inOut',
        yPercent: 130,
        // stagger: .1,
        scrollTrigger: {
          trigger: '.rainbow-lady',
          scrub: true,
          start: 'top bottom',
          end: 'top top',
        },
      });

      gsap.from('.rainbow-lady-rp', {
        ease: 'slow.inOut',
        xPercent: 190,
        duration: 2,
        // opacity: 0,
        scrollTrigger: {
          trigger: '.uv-rays-text',
          scrub: true,
          start: 'top 90% ',
          end: 'bottom 80% ',
        },
      });

      gsap.from('.rainbow-lady-text', {
        // opacity: 0,
        ease: 'slow.inOut',
        yPercent: 100,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.rainbow-lady-text',
          scrub: true,
          start: 'top 120%',
          end: 'bottom bottom',
        },
      });

      tl.to('.beach-section-content', {
        yPercent: -29,
        ease: 'slow.inOut',
        // opacity: 0,
        // delay: 2,
        duration: 1,
        scrollTrigger: {
          markers: true,
          trigger: '.rainbow-lady-text',
          start: 'top 90%',
          end: 'top top',
          // pin: true,
          scrub: true,
        },
      });

      
    });

    return () => {
      ctx.revert();
    };
  }, [
    document.querySelector('.landing-section-content'),
    document.querySelector('.philosophy-section-content'),
    document.querySelector('.rainbow-lady'),
    document.querySelector('.rainbow-lady-rp'),
    document.querySelector('.beach-section-content'),
  ]);

  //lenis smooth scroll setup

  const lenis = new Lenis({
    duration: 2.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    lerp: 0,
    autoResize: true,
  });

  // lenis.on('scroll', (e:any) => {
  //   console.log(e);
  // });

  lenis.on('scroll', ScrollTrigger.update);

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  requestAnimationFrame(raf);

  if (!randomProd) return <p>...loading</p>;
  return (
    <div
      data-scroll-section
      className=' relative flex h-full w-screen flex-col justify-center overflow-hidden '
      onLoad={() => ScrollTrigger.refresh()}
    >
      {/* <Preloader/> */}
      <div className='landing-section-content relative flex h-[calc(100dvh_-_64px)] w-full justify-center  self-center px-5 lg:px-10'>
        <video
          ref={handsRef}
          data-src={handLotion}
          data-sizes='auto'
          loop={true}
          autoPlay={true}
          muted={true}
          className='lazyload hands -z-10 aspect-[1/2] h-full w-[40vw] translate-x-1 items-center justify-center object-cover'
        />
        <video
          ref={leavesRef}
          data-src={rainLeaves}
          data-sizes='auto'
          loop={true}
          autoPlay={true}
          muted={true}
          className='lazyload leaves -z-10 aspect-[1/2] h-full w-full -translate-x-1  items-center justify-center object-cover object-left'
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
          className='group absolute bottom-0 right-[6%] -translate-y-[60%] rounded-sm border border-white px-[4%]  py-1 font-raleway font-thin text-white md:text-xs 2xl:text-lg'
        >
          <span className='absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-white  transition-all duration-700 ease-out group-hover:h-full'></span>
          <span className='relative  group-hover:text-emerald-900'>
            shop now
          </span>
        </Link>
      </div>

      <div className='philosophy-section-content relative flex flex-col bg-white pb-[18%] pt-[20%] '>
        <p className='philosophy-text self-center px-[11%] text-center font-aurora text-[1.5vw] text-charcoal '>
          our philosophy is not to add anything to our products to make them
          stand out; instead we pare them back and distill each formula down to
          the most-essential, natural active ingredients.
        </p>
      </div>

      <div className='  relative mb-[85%]  flex h-full w-screen items-start bg-white'>
        <img
          data-src={rainbowLady}
          data-sizes='auto'
          alt='red haired ladys profile with reflection of a rainbow on her face'
          className='rainbow-lady lazyload w-[60%] -translate-x-[15%]  '
        />
        <div className=''>
          <p className='absolute right-[50%] top-0 text-start font-yantramanav font-bold uppercase text-light-brick mix-blend-color-dodge md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10vw]'>
            protect
          </p>
          <p className='your-skin-text absolute left-[52%] top-[6%] whitespace-nowrap text-center font-yantramanav font-light  md:text-xl lg:text-2xl xl:text-3xl 2xl:text-[3vw]'>
            your skin
          </p>
          <p className='uv-rays-text absolute left-[4%] top-[10%] whitespace-nowrap text-center font-yantramanav font-light uppercase tracking-wide text-[#262625]/80 md:text-5xl lg:text-[4rem] xl:text-[5rem] 2xl:text-[6vw]'>
            from harmful uva & uvb rays
          </p>
        </div>

        <div className='flex w-[40%] flex-col'>
          <div className=' flex w-[90%] flex-col items-center justify-center'>
            <Link to={'/product/' + randomProd!._id}>
              <img
                className='lazyload rainbow-lady-rp transform pt-[75%] transition  duration-300 hover:scale-105'
                data-src={
                  randomProd!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd!.images[0].imageURL
                }
                data-sizes='auto'
              />
            </Link>
          </div>
          <p className='rainbow-lady-text absolute bottom-[5%] right-[9%] w-[50vw] font-aurora text-[1.5vw] leading-loose text-[#262625]'>
            during the summer months, it's essential to keep your skin
            moisturized and hydrated wherever possible. however, it's important
            to switch high-intensity heavy creams in favor of lighter
            formulations at this time of year.
          </p>
        </div>
        <span className='fake-span relative h-full w-full'></span>
      </div>

      <div className=' relative flex  w-full flex-col items-center '>
        <div className='beach-section-content relative flex  w-full flex-col items-center bg-[#383838]'>
          <p className='absolute right-1/2 top-0 -translate-y-[70%] translate-x-[50%] font-yantramanav text-[15vw] font-bold uppercase leading-none tracking-[.5rem] text-light-brick mix-blend-screen'>
            beach
          </p>
          <p className='ready-text absolute right-1/2 top-0 flex -translate-y-[9%] translate-x-[50%] flex-col font-yantramanav text-[4vw] font-thin uppercase tracking-[.7rem] text-white '>
            ready
          </p>

          <div className='flex w-[45%] justify-center self-center  pt-[10%]'>
            <div className='flex  justify-center'>
              <Link
                to={'/product/' + randomProd01!._id}
                className='flex justify-center'
              >
                <img
                  className='lazyload aspect-[4/6]  w-[80%] transform object-cover transition  duration-300 hover:scale-105'
                  data-src={
                    randomProd01!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd01!.images[0].imageURL
                  }
                  data-sizes='auto'
                />
              </Link>
            </div>

            <div className='flex justify-center'>
              <Link
                to={'/product/' + randomProd02!._id}
                className='flex transform justify-center transition  duration-300 hover:scale-105'
              >
                <img
                  className='lazyload aspect-[4/6] w-[80%] transform object-cover transition  duration-300 hover:scale-105'
                  data-src={
                    randomProd02!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd02!.images[0].imageURL
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
                to={'/product/' + randomProd03!._id}
                className=' flex  flex-col items-center'
              >
                <img
                  className='lazyload aspect-[5/6] w-[50%] transform object-cover pt-[2%] transition  duration-300 hover:scale-105'
                  data-src={
                    randomProd03!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd03!.images[0].imageURL
                  }
                  data-sizes='auto'
                />
                <p className='w-fit flex-wrap self-center pt-2 text-center font-hubbali text-[1.2vw] uppercase text-white'>
                  {randomProd03?.productName}
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
                  data-src={grapefruitButt}
                  data-sizes='auto'
                  alt='lady wearing nude leotard holding  grapefruit cut in half pressed to her hips'
                  className='lazyload aspect-square object-cover'
                />
              </div>
              <p className='anim-text relative -z-20 -translate-y-[40%] pl-7 font-roboto text-[17vw] font-xbold uppercase  leading-none tracking-[2.5rem] text-white '>
                treat
              </p>
              <p className='anim-text relative z-20 -translate-y-[60%] font-bodoni text-[17vw] font-thin uppercase leading-none  text-white'>
                your skin
              </p>
              <p className='anim-text -translate-y-[400%] font-raleway text-[3vw] font-light uppercase leading-none  text-white/40'>
                to
              </p>
              <p className='anim-text right-1/2 -translate-y-[85%] whitespace-nowrap font-roboto text-[17vw] font-xbold uppercase leading-none  text-white'>
                something
              </p>
              <p
                ref={specialRef}
                className='anim-text -translate-y-[105%] font-roboto text-[17vw] font-bold uppercase leading-none text-white'
              >
                special
              </p>
            </div>
            <Link
              // ref={shopBodyButtonRef}
              to='/shop-all'
              ref={shopBodyRef}
              state={{ filterKey: 'body' }}
              className='group relative z-20 inline-block -translate-y-[250%] overflow-hidden border border-white bg-transparent px-[6vw] py-[1.1vw] font-raleway text-[1vw] font-light text-white '
            >
              <span className='absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-white  transition-all duration-700 ease-out group-hover:h-full '></span>
              <span className='relative group-hover:text-charcoal'>
                shop body
              </span>
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
              to={'/product/' + randomProd04!._id}
              className='flex w-[70%] flex-col  items-center self-end pr-[15%]'
            >
              <img
                className='lazyload aspect-[1/2] w-fit transform object-cover transition duration-300 hover:scale-105 md:h-[290px] lg:h-[400px] xl:h-[450px]  2xl:h-[650px] min-[1600px]:h-[800px]'
                data-src={
                  randomProd04!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd04!.images[0].imageURL
                }
                data-sizes='auto'
              />
              <p className='w-[90%] pt-4 text-center font-hubbali text-[1.2vw]  uppercase text-charcoal'>
                {randomProd04?.productName}
              </p>
            </Link>

            <Link
              to='/shop-all'
              state={{ filterKey: 'body' }}
              className='group relative mr-[12%] inline-block w-[60%] self-end overflow-hidden rounded-sm border border-[#262626] bg-transparent px-[3vw] py-[1vw] text-center font-raleway text-[1.1vw] font-light text-[#262626]'
            >
              <span className='absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-charcoal/90  transition-all duration-700 ease-out group-hover:h-full '></span>
              <span className='relative group-hover:text-white'>
                shop masks
              </span>
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

          <Link to={'/product/' + randomProd06!._id} className='flex w-full '>
            <img
              className='lazyload aspect-[7/9] w-full transform object-cover transition  duration-300 hover:scale-110'
              data-src={
                randomProd06!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd06!.images[0].imageURL
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
            to={'/product/' + randomProd05!._id}
            className='flex h-3/4 w-full flex-col  pt-[13%] min-[2500px]:pt-[200px] '
          >
            <img
              className='lazyload aspect-[3/5] transform object-cover pl-[8%] transition duration-300  hover:scale-105 min-[2500px]:max-h-[750px]'
              data-src={
                randomProd05!.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || randomProd05!.images[0].imageURL
              }
              data-sizes='auto'
            />
            <p className='pt-[4%] text-center font-hubbali text-[1vw] uppercase text-charcoal'>
              {randomProd05?.productName}
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
