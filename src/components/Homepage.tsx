import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  TProduct,
  fetchAllProducts,
  fetchSingleProduct,
  selectAllProducts,
  selectSingleProduct,
} from '../redux/slices/allProductSlice';
import { randomProduct } from './AllProducts/AllProducts';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import 'lazysizes';

import handLotion from '../assets/vid/homapage/hand-lotion.mp4';
import rainLeaves from '../assets/vid/homapage/leaves-compressed-31.mp4';
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


import { CSSPlugin } from 'gsap/CSSPlugin';
import Lenis from '@studio-freight/lenis';
gsap.registerPlugin(CSSPlugin);
import '../index.css';
import { motion, useIsPresent } from 'framer-motion';
import Preloader from './Preloader';
import { TTag, fetchAllTags, selectTagState } from '../redux/slices/tagSlice';

export default function Homepage({mobileMenu}: {mobileMenu: boolean}) {
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


  const tagSelector = useAppSelector(selectTagState);
  const singleProduct = useAppSelector(selectSingleProduct);
  const spfProdId = tagSelector.tags.find((tag: TTag) => tag.tagName === 'spf')
    ?.products[0]._id;


  useEffect(() => {

    if(spfProdId) {

      dispatch(fetchAllTags);
      dispatch(fetchSingleProduct(spfProdId!))
    }
  }, [spfProdId]);




  const isPresent = useIsPresent();

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
      !document.querySelector('.beach-section-content') ||
      !document.querySelector('.beach-lady-img') ||
      !document.querySelector('.beach-section-rp') ||
      !document.querySelector('.unleash-section-content') ||
      !document.querySelector('.hyd-text-left') ||
      !document.querySelector('.unleash-lady-img') ||
      !document.querySelector('.rainbow-wrapper') ||
      !document.querySelector('.unleash-rp') ||
      !document.querySelector('.beach-oval-text') ||
      !document.querySelector('.beach-text-closer')
    )
      return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

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
          scrub: 0.2,
        },
      });

      // gsap.to('.philosophy-section-content', {
      //   backgroundColor: 'rgba(142 146 130 .2)',
      //   color: '#fff',
      //   ease: 'slow',
      //   scrollTrigger: {
      //     trigger: '.philosophy-section-content',
      //     start: 'center bottom',
      //     markers: true,
      //     scrub: 1,
      //   },
      // });

      // gsap.to('.rainbow-wrapper', {
      //   backgroundColor: '#8E9282',
      //   ease: 'slow.out',
      //   scrollTrigger: {
      //     trigger: '.philosophy-section-content',
      //     scrub: 1
      //   }
      // })

      gsap.from('.philosophy-text', {
        opacity: 0,
        // duration: 2,
        ease: 'circ.out',
        yPercent: 400,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.philosophy-text',
          start: 'center bottom',
          // markers: true,
          end: 'bottom 50%',
        },
      });

      gsap.from('.rainbow-lady', {
        // opacity: 0,
        x: -300,
        ease: 'slow',
        duration: 3,
        scrollTrigger: {
          scrub: 1,
          trigger: '.rainbow-lady',
          start: 'top 110%',
          end: 'center 70%',
          //  pin: true
        },
      });

      gsap.from('.your-skin-text, .uv-rays-text', {
        opacity: 0,
        ease: 'slow.inOut',
        yPercent: 230,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.rainbow-lady',
          scrub: 1,
          start: 'top bottom',
          end: 'top top',
        },
      });

      gsap.from('.rainbow-lady-rp', {
        ease: 'slow.inOut',
        x: 90,
        duration: 1,
        opacity: 0,
        scrollTrigger: {
          // markers: true,
          trigger: '.rainbow-lady',
          scrub: 0.2,
          start: 'top 90% ',
          end: 'bottom 80% ',
        },
      });

      gsap.from('.rainbow-lady-text', {
        // opacity: 0,
        ease: 'slow.inOut',
        yPercent: 200,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.rainbow-lady-text',
          scrub: 0.4,
          start: 'top 120%',
          end: 'bottom bottom',
        },
      });

      //og anim
      gsap.to('.beach-section-content', {
        yPercent: -55,
        ease: 'slow.inOut',
        // opacity: 0,
        // delay: 2,
        duration: 1,
        onComplete: () => {
          ScrollTrigger.refresh();
        },
        scrollTrigger: {
          pinSpacing: 'margin',
          trigger: '.rainbow-lady-text',
          start: 'top 90%',
          end: 'top top',
          // pin: tru
          scrub: 2.3,
        },
      });

      gsap.from('.unleash-lady-img', {
        // opacity: 0,
        x: 400,
        ease: 'slow.inOut',
        duration: 2,
        scrollTrigger: {
          scrub: 2,
          trigger: '.unleash-section-content',
          start: 'top 110%',
          end: 'center 70%',
          //  pin: true
        },
      });

      gsap.from('.hyd-text-left', {
        // opacity: 0,
        x: 400,
        ease: 'slow.inOut',
        duration: 2,
        // stagger: 0.8,
        scrollTrigger: {
          scrub: 2,
          trigger: '.unleash-section-content',
          start: 'top center',
          end: 'center 70%',
          //  pin: true
        },
      });

      gsap.from('.unleash-rp', {
        opacity: 0,
        x: -450,
        ease: 'slow',
        duration: 2,
        // stagger: 0.8,
        scrollTrigger: {
          scrub: 2,
          trigger: '.unleash-section-content',
          start: 'top top',
          end: 'bottom 70%',
          //  pin: true
        },
      });

      // gsap.to('.beach-section-content', {
      //   // yPercent: -105,
      //   ease: 'slow.inOut',
      //   // opacity: 0,
      //   // delay: 2,
      //   duration: 1,
      //   scrollTrigger: {
      //     trigger: '.rainbow-lady-text',
      //     start: 'top 90%',
      //     end: 'top top',
      //     // pin: tru
      //     scrub: 1.7,
      //   },
      // });

      // gsap.from('.beach-section-rp', {
      //   yPercent: 20,
      //   ease: 'slow',
      //   // opacity: 0,
      //   delay: .6,
      //   scale: 1.1,
      //   duration: 1,
      //   scrollTrigger: {
      //     markers: true,
      //     trigger: '.beach-section-content-top',
      //     start: 'top top',
      //     end: 'bottom bottom',
      //     scrub: 1,
      //   },
      // });

      gsap.from('.beach-section-rp', {
        y: -20,
        ease: 'slow.inOut',
        scale: 1.2,
        // opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.beach-section-rp',
          start: 'top 80%',
          end: 'bottom top',
          scrub: 1.4,
          // markers: true,
        },
      });

      gsap.from('.beach-oval-container, .beach-oval-text', {
        yPercent: -45,
        ease: 'slow.inOut',
        duration: 2,
        opacity: 0,
        stagger: 0.8,
        scrollTrigger: {
          // markers: true,
          trigger: '.beach-section-rp',
          start: 'top bottom',
          end: 'center center',
          scrub: 2.5,
        },
      });

      // gsap.from('beach-oval-text', {
      //   y: -60,
      //   ease: 'slow',
      //   opacity: 0,
      //   scrollTrigger: {
      //     markers: true,
      //     trigger: 'beach-section-content',
      //     start: 'top 10%',
      //     end: 'bottom 90%',
      //     scrub: true,
      //   },
      // });

      gsap.from('.beach-text-closer', {
        yPercent: 30,
        ease: 'sine',
        opacity: 0,
        duration: 1.9,
        scrollTrigger: {
          // markers: true,
          trigger: '.beach-oval-container',
          start: 'center top',
          end: 'bottom center',
          scrub: 1.7,
        },
      });

      gsap.from('.beach-rp-right', {
        opacity: 0,
        x: 200,
        ease: 'slow.inOut',
        duration: 2,
        // stagger: 0.8,
        scrollTrigger: {
          scrub: 2.3,
          trigger: '.beach-section-rp',
          start: 'top center',
          end: 'bottom 90%',
          //  pin: true
        },
      });

      gsap.from('.facewash-lady-img', {
        // opacity: 0,
        yPercent: 60,
        ease: 'slow',
        scrollTrigger: {
          trigger: '.facewash-section-content',
          start: 'top 90%',
          end: 'center 60%',
          scrub: 2,
        },
      });

      gsap.from('.facewash-rp', {
        xPercent: 200,
        ease: 'sine',
        scrollTrigger: {
          trigger: '.facewash-section-content',
          start: 'top 90%',
          // markers: true,
          end: 'top 40%',
          scrub: 3.4,
        },
      });

      gsap.from('.facewash-section-text-top', {
        yPercent: 30,
        opacity: 0,
        // ease: 'slow',
        ease: 'slow',
        scrollTrigger: {
          trigger: '.facewash-section-content',
          start: 'top center',
          // markers: true,
          end: 'center center',
          scrub: 0.6,
        },
      });

      gsap.from('.facewash-section-text-right', {
        ease: 'slow',
        opacity: 0,
        yPercent: -40,
        scrollTrigger: {
          trigger: '.facewash-section-content',
          start: 'top top',
          end: 'center center',
          scrub: 1.4,
        },
      });

      gsap.from('.papaya-img', {
        ease: 'sine',
        xPercent: -100,
        scrollTrigger: {
          trigger: '.facewash-lady-img',
          start: 'top center',
          end: 'top center',
          // markers:true,
          scrub: 2.4,
        },
      });

      // gsap.from('.ingredient-header-right', {
      //   ease: 'slow',
      //   opacity: 0,
      //   xPercent: 100,
      //   scrollTrigger: {
      //     trigger: '.facewash-lady-img',
      //     start: 'top center',
      //     end: 'top botom',
      //     markers: true,
      //     scrub: .5
      //   }
      // })

      gsap.from('.ingredient-rp', {
        ease: 'slow.inOut',
        xPercent: 100,
        scrollTrigger: {
          trigger: '.papaya-img',
          start: 'top bottom',
          end: 'top top',
          // markers: true,
          scrub: 2.2,
        },
      });

      gsap.from('.ingredient-section-subheader', {
        ease: 'slow',
        opacity: 0,
        duration: 1,
        yPercent: 100,
        // stagger: 3.5,
        scrollTrigger: {
          trigger: '.ingredient-section-subheader',
          start: 'top 80%',
          end: 'top center',
          scrub: 1.3,
          // markers: true,
        },
      });

      gsap.from('.ingredient-section-closer', {
        ease: 'sine',
        opacity: 0,
        duration: 1.4,
        yPercent: 80,
        scrollTrigger: {
          trigger: '.papaya-img',
          start: 'bottom center',
          end: 'center center',
          scrub: 2.3,
          // markers: true,
        },
      });

      gsap.from('.landing-page-closer-container', {
        ease: 'power3.inOut',
        scale: 1.1,
        duration: 1,
        yPercent: 20,
        // rotateY: 50,
        stagger: 1.4,
        scrollTrigger: {
          trigger: '.ingredient-section-closer',
          start: 'top bottom',
          end: 'bottom bettom',
          // markers: true,
          scrub: 0.3,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  });

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
      // tl.to(grapefruitButtRef.current, {
      //   scrollTrigger: {
      //     trigger: grapefruitButtRef.current,
      //     pin: true,
      //     // scrub: true,
      //     pinSpacing: false,
      //     markers: true,
      //     start: 'top 64px',
      //     endTrigger: treatRef.current,
      //     end: 'bottom 62%',
      //   },
      // });

      // gsap.set('.beach-section-content', {
      //   yPercent: 35,
      //   scrollTrigger: {
      //     trigger: '.beach-section-content',
      //     start: 'bottom -400px',
      //   },
      // });

      ScrollTrigger.create({
        trigger: grapefruitButtRef.current,
        pin: grapefruitButtRef.current,
        // pinReparent: true,
        // markers: true,
        start: 'center center',
        scrub: 4.9,
        // pinSpacing: 'padding',
        endTrigger: specialRef.current,
        // horizontal: false,
        end: 'center center',
      });

      gsap.from('.anim-text', {
        duration: 4,
        opacity: 0,
        ease: 'slow.inOut',
        stagger: 0.1,
        y: 25,
        scrollTrigger: {
          // pinReparent: true,
          scrub: 1.2,
          trigger: treatRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
        },
      });
    }, treatRef.current);

    return () => {
      ScrollTrigger.refresh();
      ctx.revert();
    };
  });
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
    <>
      {/* <motion.div
        className='slide-in fixed left-0 top-0 z-50 h-screen w-screen origin-bottom bg-[#0f0f0f]'
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className='slide-out  fixed left-0 top-0 z-50 h-screen w-screen origin-top bg-[#0f0f0f]'
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      /> */}
      <div
        data-scroll-section
        className=" relative flex h-full w-[100svw] flex-col justify-center overflow-hidden "
        onLoad={() => ScrollTrigger.refresh()}
      >
        {/* <Preloader/> */}
        <div className="landing-section-content relative flex h-[calc(100svh_-_64px)] w-full justify-center  self-center px-5 lg:px-10">
          <video
            ref={handsRef}
            src={handLotion}
            playsInline
            loop
            autoPlay
            muted
            controls={false}
            className={` ${
              mobileMenu ? 'w-[50svw] object-left' : 'w-[40vw] translate-x-1'
            } hands -z-10 aspect-[1/2] h-full   items-center justify-center object-cover`}
          />
          <video
            ref={leavesRef}
            src={rainLeaves}
            playsInline
            loop
            controls={false}
            autoPlay
            muted
            className={` ${
              mobileMenu ? 'w-[50svw]' : 'w-full -translate-x-1 '
            } leaves -z-10 aspect-[1/2] h-full   items-center justify-center object-cover object-left`}
          />

          <div className=" absolute right-1/2 top-1/2 flex -translate-y-[120%] translate-x-[50%] flex-col items-center justify-center mix-blend-difference">
            <h1
              className={` ${
                mobileMenu
                  ? '-translate-y-[90%] text-[4rem]'
                  : 'md:text-8xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[10rem] 4xl:text-[12rem]  5xl:text-[16rem] 6xl:text-[19rem]'
              } font-yantramanav font-xbold uppercase leading-none tracking-wide text-emerald-50  4xl:tracking-[1.5rem] 5xl:tracking-[3.3rem] `}
            >
              discover
            </h1>
          </div>
          <div className=" absolute right-1/2 top-[45%] flex -translate-y-[5%] translate-x-[55%] flex-col items-center justify-center leading-none">
            <h2
              className={` ${
                mobileMenu
                  ? '-translate-x-[2%] -translate-y-[90%] text-[2.3rem] tracking-[1.6rem]'
                  : 'md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl 5xl:text-[8rem]'
              }  items-center self-center font-raleway font-regular uppercase text-white  md:tracking-[3rem]  lg:tracking-[5rem]  xl:tracking-[5rem]  2xl:tracking-[7rem]  5xl:tracking-[11rem] 6xl:tracking-[15rem]`}
            >
              skincare
            </h2>
            <h3
              className={` ${
                mobileMenu
                  ? 'top-[50%] translate-x-[50%] text-[1.2rem] tracking-[.1rem]'
                  : 'top-[120%] translate-x-[80%] tracking-[.5rem] lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:tracking-[1rem] 4xl:text-4xl 5xl:tracking-[1.5rem]  6xl:text-5xl  6xl:tracking-[1.9rem]'
              } absolute   font-aurora font-bold  text-white `}
            >
              your skin loves
            </h3>
          </div>
          <Link
            to="/shop-all"
            className={` ${
              mobileMenu ? 'px-8' : 'px-[4%]'
            } group absolute bottom-0 right-[6%] -translate-y-[60%] rounded-sm border border-white  py-1 font-raleway font-thin text-white md:text-xs 2xl:text-lg 5xl:py-2 6xl:py-3`}
          >
            <span className="absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-white  transition-all duration-700 ease-out group-hover:h-full "></span>
            <span className="relative  group-hover:text-emerald-900 xl:text-base 4xl:text-xl 5xl:text-2xl 6xl:text-3xl">
              shop now
            </span>
          </Link>
        </div>

        <div
          className={` ${
            mobileMenu ? 'pb-[35%] pt-[30%]' : 'pb-[18%] pt-[20%]'
          } philosophy-section-content relative flex flex-col bg-white `}
        >
          <p
            className={` ${
              mobileMenu ? 'text--[1.3rem]' : 'text-[1.5vw]'
            } philosophy-text self-center px-[11%] text-center font-aurora  text-charcoal `}
          >
            our philosophy is not to add anything to our products to make them
            stand out; instead we pare them back and distill each formula down
            to the most-essential, natural active ingredients.
          </p>
        </div>

        <div
          className={` ${
            mobileMenu ? 'h-[60svh]' : 'h-full'
          } rainbow-wrapper relative mb-[115%]  flex  w-[100svw] items-start bg-white `}
        >
          <img
            data-src={rainbowLady}
            data-sizes="auto"
            alt="red haired ladys profile with reflection of a rainbow on her face"
            className={` ${
              mobileMenu ? 'h-full object-cover' : ''
            } rainbow-lady lazyload w-[60%]  -translate-x-[15%]  `}
          />
          <div className="">
            <p
              className={` ${
                mobileMenu
                  ? 'text-[2.8rem] portrait:xs:text-[3rem]'
                  : 'md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10vw]'
              } absolute right-[50%] top-0 text-start font-yantramanav font-bold uppercase text-light-brick mix-blend-color-dodge `}
            >
              protect
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[1.2rem]'
                  : 'md:text-xl lg:text-2xl xl:text-3xl 2xl:text-[3vw]'
              } your-skin-text absolute left-[52%] top-[6%] whitespace-nowrap text-center font-yantramanav font-light  `}
            >
              your skin
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'left-[1%] text-[1.5rem] portrait:sm:text-[1.7rem] top-[10%]'
                  : 'left-[4%] top-[12%] md:text-4xl  lg:text-[4rem] 2xl:text-[6vw]'
              } uv-rays-text absolute   whitespace-nowrap text-center font-yantramanav font-light uppercase tracking-wide text-[#262625]/80 `}
            >
              from harmful uva & uvb rays
            </p>
          </div>

          <div className="flex w-[40%] flex-col  ">
            <div className="  flex h-full w-[90%] flex-col items-center justify-center">
              <Link to={'/product/' + spfProdId!}>
                <img
                  className={` ${
                    mobileMenu ? 'pt-[80%] portrait:xs:pt-[100%] portrait:xs:h-[350px] portrait:sm:h-[450px] pr-4 h-[280px]' : 'pt-[70%] h-full'
                  } rainbow-lady-rp  aspect-[1/2]  object-cover`}
                  src={
                    singleProduct?.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || singleProduct?.images[0].imageURL
                  }
                  // data-sizes='auto'
                />
              </Link>
              <p
                className={` ${
                  mobileMenu
                    ? 'text-[.8rem] pr-4'
                    : 'text-[1rem] xl:text-[1.2rem] 2xl:text-[1.4rem] 4xl:text-[1.6rem] 5xl:text-[1.8rem]'
                } rainbow-lady-rp pt-1  text-center font-grotesque uppercase `}
              >
                {singleProduct?.productName}
              </p>
            </div>
            <p
              className={` ${
                mobileMenu
                  ? 'bottom-4 portrait:sm:bottom-11 left-5 w-[87svw] text-[.9rem] leading-tight'
                  : 'bottom-[4%] right-[9%]  w-[50vw] text-[1.6vw] leading-loose'
              } rainbow-lady-text absolute   font-aurora   text-[#262625]`}
            >
              {mobileMenu ? `during the summer months, it's essential to keep your skin
              moisturized and hydrated wherever possible` : `during the summer months, it's essential to keep your skin
              moisturized and hydrated wherever possible. however, it's
              important to switch high-intensity heavy creams in favor of
              lighter formulations at this time of year.`}
              
            </p>
          </div>
        </div>

        <div className="beach-section-content-top relative flex w-full flex-col items-center">
          <div className="beach-section-content relative -mb-[80%] flex w-full flex-col items-center bg-[#383838]">
            <p className="absolute right-1/2 top-0 -translate-y-[70%] translate-x-[50%] font-yantramanav text-[15vw] font-bold uppercase leading-none tracking-[.5rem] text-light-brick mix-blend-screen">
              beach
            </p>
            <p className="ready-text absolute right-1/2 top-0 flex -translate-y-[9%] translate-x-[50%] flex-col font-yantramanav text-[4vw] font-thin uppercase tracking-[.7rem] text-white ">
              ready
            </p>

            <div className="beach-section-rp relative flex w-[45%] justify-center self-center pt-[10%]">
              <div className="flex justify-center">
                <Link
                  to={'/product/' + randomProd01!._id}
                  className=" flex justify-center"
                >
                  <img
                    className="aspect-[4/6]  w-[80%] transform object-cover transition  duration-300 hover:scale-105"
                    src={
                      randomProd01!.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || randomProd01!.images[0].imageURL
                    }
                    // data-sizes='auto'
                  />
                </Link>
              </div>

              <div className="flex justify-center">
                <Link
                  to={'/product/' + randomProd02!._id}
                  className=" flex transform justify-center transition  duration-300 hover:scale-105"
                >
                  <img
                    className="aspect-[4/6] w-[80%] transform object-cover transition  duration-300 hover:scale-105"
                    src={
                      randomProd02!.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || randomProd02!.images[0].imageURL
                    }
                    // data-sizes='auto'
                  />
                </Link>
              </div>
            </div>
            <p className="absolute top-0 z-10 flex w-[25%] translate-y-[144%] flex-col text-center font-aurora text-[2vw] text-black ">
              heavy moisturizers are ideal for cold climates or during winter
              when
              <span className="text-white">
                the air is dryer but they can be too cloying during the heat of
                summer and don't provide adequate
              </span>
            </p>

            <div className="w-[80%] pt-[2%]">
              <img
                src={beachLady}
                // data-sizes='auto'
                alt="lady with a big white hat is laying on the beach"
                className="beach-lady-img aspect-auto h-3/4 w-full object-cover"
              />
            </div>

            <div className=" 2xl: relative flex  h-full  w-[80%] justify-center gap-[7%] md:gap-[10%] lg:gap-[8%]">
              <div className="text-container flex w-full flex-col">
                <div className="beach-oval-container absolute left-0 top-0 h-[75%] w-[22%] -translate-y-[15%] translate-x-[40%] rounded-full bg-black/20">
                  <p className="beach-oval-text absolute right-0 top-0 w-[80%] -translate-x-[9%] translate-y-[120%] text-start font-aurora text-[1.4vw] leading-relaxed text-white">
                    heavy moisturizers are ideal for cold climates or during
                    winter when the air is dryer but they can be too cloying
                    during the heat of summer and don't provide adequate
                  </p>
                </div>
              </div>
              <div className="video-section flex  h-full  max-h-screen w-full -translate-x-[60%] -translate-y-[15%] justify-center">
                <video
                  src={bwSeizure}
                  // data-sizes='auto'
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="bw-seizure-vid aspect-[4/6] w-[70%]"
                />
              </div>
              <div className="product-section absolute right-0 top-2 w-[50%] translate-x-[5%] pl-[8%]">
                {' '}
                <Link
                  to={'/product/' + randomProd03!._id}
                  className="beach-rp-right flex  flex-col items-center"
                >
                  <img
                    className="aspect-[5/6] w-[60%] transform object-cover pt-[2%] transition  duration-300 hover:scale-105"
                    src={
                      randomProd03!.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || randomProd03!.images[0].imageURL
                    }
                    // data-sizes='auto'
                  />
                  <p className="w-fit flex-wrap self-center pt-2 text-center font-hubbali text-[1.2vw] uppercase text-white">
                    {randomProd03?.productName}
                  </p>
                </Link>
              </div>
            </div>

            <div className="beach-text-closer w-[55%] pb-[7%] text-center font-aurora text-[1.2vw] leading-loose text-white">
              <p>
                heavy moisturizers are ideal for cold climates or during winter
                when the air is dryer but they can be too cloying during the
                heat of summer and don't provide adequate
              </p>
            </div>
          </div>
          <div className="z-10 flex w-full  flex-col  items-center bg-[#383838] pb-[7%]">
            <div
              ref={treatRef}
              className=" flex h-full flex-col self-center text-center"
            >
              <div
                ref={grapefruitButtRef}
                className="grapefruit-butt-img  z-10 h-fit w-[30%] self-center "
              >
                <img
                  // onLoad={() => ScrollTrigger.refresh()}
                  src={grapefruitButt}
                  // data-sizes='auto'
                  alt="lady wearing nude leotard holding  grapefruit cut in half pressed to her hips"
                  className=" aspect-square object-cover"
                />
              </div>
              <p className="anim-text relative -z-20 -translate-y-[40%] pl-7 font-roboto text-[17vw] font-xbold uppercase  leading-none tracking-[2.5rem] text-white ">
                treat
              </p>
              <p className="anim-text relative z-20 -translate-y-[60%] font-bodoni text-[17vw] font-thin uppercase leading-none  text-white">
                your skin
              </p>
              <p className="anim-text -translate-y-[400%] font-raleway text-[3vw] font-light uppercase leading-none  text-white/40">
                to
              </p>
              <p className="anim-text right-1/2 -translate-y-[85%] whitespace-nowrap font-roboto text-[17vw] font-xbold uppercase leading-none  text-white">
                something
              </p>
              <p
                ref={specialRef}
                className="anim-text -translate-y-[105%] font-roboto text-[17vw] font-bold uppercase leading-none text-white"
              >
                special
              </p>
            </div>
            <Link
              // ref={shopBodyButtonRef}
              to="/shop-all"
              ref={shopBodyRef}
              state={{ filterKey: 'body' }}
              className="group relative z-20 inline-block -translate-y-[250%] overflow-hidden border border-white bg-transparent px-[6vw] py-[1.1vw] font-raleway text-[1vw] font-light text-white "
            >
              <span className="absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-white  transition-all duration-700 ease-out group-hover:h-full "></span>
              <span className="relative group-hover:text-charcoal">
                shop body
              </span>
            </Link>
          </div>
        </div>

        <div className="unleash-section-content flex w-full flex-col items-center">
          <p className=" z-10 -translate-y-[50%] font-yantramanav text-[10vw] font-xxbold uppercase tracking-widest text-charcoal/60 mix-blend-difference">
            unleash{' '}
          </p>
          <p className="-translate-y-[550%] font-raleway text-[2vw] font-thin leading-none tracking-wide">
            the power of
          </p>
        </div>

        <div className="flex w-[90%] max-w-[1940px] -translate-y-[6%] flex-row-reverse justify-center self-center ">
          <div className="flex w-full flex-row-reverse justify-center ">
            <img
              data-src={ladyMask}
              data-sizes="auto"
              alt="woman applying mask to her face"
              className="unleash-lady-img lazyload h-screen  w-[3/5] object-cover "
            />

            <div className=" relative flex w-2/5  flex-col justify-end gap-10">
              <p className=" font-yantramanav text-[9vw] font-semibold uppercase 2xl:text-[9rem]">
                <span className="hyd-text-left absolute -right-4 top-0 translate-y-[60%]  tracking-[2.9rem] text-[#262626] 2xl:translate-y-0">
                  hyd
                </span>
                <span className="absolute right-0 top-0 translate-x-[102%] translate-y-[60%] tracking-[1rem] text-white  2xl:translate-y-0">
                  ration
                </span>
              </p>
              <Link
                to={'/product/' + randomProd04!._id}
                className="unleash-rp flex w-[70%] flex-col  items-center self-end pr-[15%]"
              >
                <img
                  className="lazyload min-[1600px]:h-[800px] aspect-[1/2] w-fit transform object-cover transition duration-300 hover:scale-105 md:h-[290px] lg:h-[400px]  xl:h-[450px] 2xl:h-[650px]"
                  data-src={
                    randomProd04!.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd04!.images[0].imageURL
                  }
                  data-sizes="auto"
                />
                <p className="w-[90%] pt-4 text-center font-hubbali text-[1.2vw]  uppercase text-charcoal">
                  {randomProd04?.productName}
                </p>
              </Link>

              <Link
                to="/shop-all"
                state={{ filterKey: 'body' }}
                className="group relative mr-[12%] inline-block w-[60%] self-end overflow-hidden rounded-sm border border-[#262626] bg-transparent px-[3vw] py-[1vw] text-center font-raleway text-[1.1vw] font-light text-[#262626]"
              >
                <span className="absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-charcoal/90  transition-all duration-700 ease-out group-hover:h-full "></span>
                <span className="relative group-hover:text-white">
                  shop masks
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="facewash-section-content relative z-10 flex  flex-col items-center justify-center pt-[25%]">
          <div className="absolute right-0 top-0  flex w-[45%] -translate-x-[50%] translate-y-[55%] items-center justify-between gap-[10%] ">
            <p className="facewash-section-text-top z-20 w-full -translate-x-[20%] text-center font-aurora text-[1.5vw] text-[#262626]">
              heavy moisturizers are ideal for cold climates or during winter
              when the air is dryer but they can be too cloying during the heat
              of summer and don't provide adequate
            </p>

            <Link
              to={'/product/' + randomProd06!._id}
              className="facewash-rp z-50 flex w-full"
            >
              <img
                className="lazyload aspect-[7/9] w-full transform object-cover transition  duration-300 hover:scale-110"
                data-src={
                  randomProd06!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd06!.images[0].imageURL
                }
                data-sizes="auto"
              />
            </Link>
          </div>

          <div className="-z-10 flex w-full flex-col">
            <img
              data-src={ladyFacewash}
              data-sizes="auto"
              alt="lady washing her face in the bathroom with white towel on her head"
              className="facewash-lady-img lazyload aspect-[4/6] h-screen self-center"
            />
            <p className="facewash-section-text-right min-[1600px]:-translate-x-[155%] min-[1600px]:-translate-y-[125%] w-[17%] -translate-x-[110%] -translate-y-[250%] self-end text-center font-aurora text-[1.5vw]  text-[#262626]">
              heavy moisturizers are ideal for cold climates or during winter
              when the air is dryer but they can be too cloying during the heat
              of summer and don't provide adequate
            </p>
          </div>
        </div>

        <div className="ingredient-section-content flex w-[90%] max-w-[1440px] self-center ">
          <div className="flex h-screen  w-[65%] border ">
            <img
              data-src={papaya}
              data-sizes="auto"
              alt="ripe papaya cut in half"
              className="papaya-img lazyload grow-1 aspect-[2/3] w-full shrink-0  object-cover "
            />
            <div className="relative flex w-[1/4] shrink-0 grow-0 flex-col whitespace-nowrap ">
              <p className="relative font-archivo text-[14vw] uppercase 2xl:text-[15rem]">
                <span className="absolute left-0 top-0 -translate-x-[100%] text-white">
                  we u
                </span>
                <span className="ingredient-header-right absolute left-0 top-0  text-[#262626]">
                  se
                </span>
              </p>
            </div>
          </div>

          <div className=" relative flex w-[35%] max-w-[500px] flex-col items-center justify-end pl-[2%] ">
            <p className="ingredient-section-subheader absolute left-2 top-[16vw] whitespace-nowrap font-raleway text-[1.3vw] font-light 2xl:top-[270px] ">
              only best ingredients for best results
            </p>
            <Link
              to={'/product/' + randomProd05!._id}
              className="ingredient-rp min-[2500px]:pt-[200px] flex h-3/4 w-full  flex-col pt-[13%] "
            >
              <img
                className="lazyload min-[2500px]:max-h-[750px] aspect-[3/5] transform object-cover pl-[8%] transition  duration-300 hover:scale-105"
                data-src={
                  randomProd05!.images.find(
                    (image) => image.imageDesc === 'product-front'
                  )?.imageURL || randomProd05!.images[0].imageURL
                }
                data-sizes="auto"
              />
              <p className="pt-[4%] text-center font-hubbali text-[1vw] uppercase text-charcoal">
                {randomProd05?.productName}
              </p>
            </Link>
          </div>
        </div>
        <div className="ingredient-section-closer flex w-[70%] items-center justify-center self-center pb-[6%] pt-[15%] leading-loose">
          <p className="text-center font-aurora text-[1.4vw]">
            heavy moisturizers are ideal for cold climates or during winter when
            the air is dryer but they can be too cloying during the heat of
            summer and don't provide adequate hydration
          </p>
        </div>

        <div className="landing-page-closer-container flex h-full w-[80%] justify-center self-center pb-[6%]">
          <div className="flex h-[40dvh] gap-9 2xl:h-[50dvh]">
            <img
              data-src={coconutHand}
              data-sizes="auto"
              alt="hand is reaching for a coconut cut in half"
              className="lazyload aspect-[1/2] w-[30%] object-cover"
            />
            <img
              data-src={melon}
              data-sizes="auto"
              alt="melon cut in half"
              className="melon-img lazyload aspect-[1/2] w-[30%] object-cover"
            />
            <video
              src={legBrush}
              muted
              loop
              autoPlay
              playsInline
              controls={false}
              className="leg-brush-vid lazyload aspect-[1/2] w-[30%] items-center justify-center object-cover"
            />
          </div>
        </div>
        {/* <div className='pb-96'></div> */}
      </div>
      <motion.div
        className="slide-in fixed left-0 top-0 z-50 h-screen w-screen bg-[#0f0f0f]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        style={{ originY: isPresent ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
