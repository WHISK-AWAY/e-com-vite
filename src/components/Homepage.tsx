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

// import handLotion from '../assets/vid/homapage/hand-lotion.mp4';
// import rainLeaves from '../assets/vid/homapage/leaves-trimmed.mp4';
// import bwSeizure from '../assets/vid/homapage/bw-seizure.mp4';
// import rainbowLady from '../assets/bg-img/homepage/rainbow-lady.jpg';
// import beachLady from '../assets/bg-img/homepage/beach-lady.jpg';
// import grapefruitButt from '../assets/bg-img/homepage/grapefruit-butt.jpg';
// import ladyMask from '../assets/bg-img/homepage/lady-mask.jpg';
// import ladyFacewash from '../assets/bg-img/homepage/lady-facewash.jpg';
// import papaya from '../assets/bg-img/homepage/papaya.jpg';
// import coconutHand from '../assets/bg-img/homepage/coconut-hand.jpg';
// import melon from '../assets/bg-img/homepage/melon.jpg';
// import legBrush from '../assets/vid/homapage/leg-brush.mp4';

import { CSSPlugin } from 'gsap/CSSPlugin';
import Lenis from '@studio-freight/lenis';
gsap.registerPlugin(CSSPlugin);
import '../index.css'; // ? this is already imported in main -- is it needed here also?
// import Preloader from './Preloader';
import { TTag, fetchAllTags, selectTagState } from '../redux/slices/tagSlice';
import convertMediaUrl from '../utilities/convertMediaUrl';

export default function Homepage({ mobileMenu }: { mobileMenu: boolean }) {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectAllProducts);
  // const [randomProd, setRandomProd] = useState<TProduct>();
  const [randomProd01, setRandomProd01] = useState<TProduct>();
  const [randomProd02, setRandomProd02] = useState<TProduct>();
  const [randomProd03, setRandomProd03] = useState<TProduct>();
  // const [randomProd04, setRandomProd04] = useState<TProduct>();
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
  const maskProdId = tagSelector.tags.find(
    (tag: TTag) => tag.tagName === 'masks'
  )?.products[0]._id;

  // console.log(maskProdId);
  useEffect(() => {
    if (spfProdId) {
      dispatch(fetchAllTags);
      dispatch(fetchSingleProduct(spfProdId!));
      dispatch(fetchSingleProduct(maskProdId!));
    }
  }, [spfProdId]);

  // const isPresent = useIsPresent();

  // useEffect(() => {
  //   window.scrollTo({ top: 0 });
  // }, []);

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
      // setRandomProd(randomProduct(allProducts));
      setRandomProd01(randomProduct(allProducts));
      setRandomProd02(randomProduct(allProducts));
      setRandomProd03(randomProduct(allProducts));
      // setRandomProd04(randomProduct(allProducts));
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
          start: 'top 50%',
          end: 'bottom 70%',
          // markers:true
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
          trigger: '.beach-section-content',
          start: '-20% top',
          end: '10% center',
          scrub: 4.4,
          // markers: true,
        },
      });

      gsap.from('.beach-oval-container, .beach-oval-text', {
        yPercent: -45,
        ease: 'slow.inOut',
        duration: 2,
        opacity: 0,
        stagger: 1.3,
        scrollTrigger: {
          // markers: true,
          trigger: '.beach-lady-img',
          start: 'bottom bottom',
          end: 'bottom 80%',
          scrub: 3.5,
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
          start: 'center center',
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
          start: 'top 60%',
          end: 'center 60%',
          scrub: 2,
        },
      });

      gsap.from('.facewash-rp', {
        xPercent: 50,
        ease: 'power4',
        opacity: 0,
        scrollTrigger: {
          trigger: '.facewash-section-content',
          start: 'top 10%',
          end: 'top 20%',
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
        opacity: 0,
        xPercent: -20,
        scrollTrigger: {
          trigger: '.facewash-lady-img',
          start: 'center center',
          end: 'bottom 90%',
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
        xPercent: 30,
        opacity: 0,
        scrollTrigger: {
          trigger: '.papaya-img',
          start: 'top center',
          end: 'top bottom',
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
  //lenis smooth scroll setup // ? should this be inside a useeffect? done this way, it'll create a new instance & listeners per-render

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

  // if (!randomProd) return <p>...loading</p>;

  return (
    <>
      <div
        data-scroll-section
        className=" relative flex h-full w-[100svw] flex-col overflow-hidden bg-white"
        onLoad={() => ScrollTrigger.refresh()}
      >
        {/* <Preloader/> */}
        <div
          className={` ${
            mobileMenu ? '-translate-y-[10%]' : ''
          } landing-section-content relative flex h-[100svh] w-full justify-center  px-5 lg:px-10 `}
        >
          <video
            ref={handsRef}
            playsInline
            loop
            autoPlay
            muted
            controls={false}
            className={` ${
              mobileMenu ? 'w-[50svw] object-left' : 'w-[40vw] translate-x-1'
            } hands -z-10 aspect-[1/2] h-full object-cover 3xl:max-h-[900px] 4xl:max-h-[1500px] 6xl:h-full portrait:md:max-h-[900px]`}
          >
            <source
              src="/assets/homepage/vid/hand-lotion-trimmed.webm"
              type="video/webm"
            />
            <source
              src="/assets/homepage/vid/hand-lotion-trimmed.mp4"
              type="video/mp4"
            />
          </video>
          <video
            ref={leavesRef}
            playsInline
            loop
            controls={false}
            autoPlay
            muted
            className={` ${
              mobileMenu ? 'w-[50svw]' : 'w-full -translate-x-1 '
            } leaves -z-10 aspect-[1/2] h-full   items-center justify-center object-cover object-left 3xl:max-h-[900px] 4xl:max-h-[1500px] portrait:md:max-h-[900px]`}
          >
            <source
              src="/assets/homepage/vid/leaves-trimmed.webm"
              type="video/webm"
            />
            <source
              src="/assets/homepage/vid/leaves-trimmed.mp4"
              type="video/mp4"
            />
          </video>

          <div className=" absolute right-1/2 top-1/2 flex -translate-y-[120%] translate-x-[50%] flex-col items-center justify-center mix-blend-difference">
            <h1
              className={` ${
                mobileMenu
                  ? '-translate-y-[90%] text-[4rem]'
                  : 'md:text-8xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[10rem] 4xl:text-[12rem]  5xl:text-[16rem] 6xl:text-[19rem]'
              } font-yantramanav font-xbold uppercase leading-none tracking-wide text-emerald-50  4xl:tracking-[1.5rem] 5xl:tracking-[3rem] `}
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
              }  items-center self-center font-grotesque font-regular  text-white  md:tracking-[3rem]  lg:tracking-[5rem]  xl:tracking-[5rem]  2xl:tracking-[7rem]  5xl:tracking-[11rem] 6xl:tracking-[15rem]`}
            >
              SKlNCARE
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
              mobileMenu
                ? '-translate-y-[210%]  px-8 font-regular'
                : '-translate-y-[60%] px-[4%] font-thin'
            } 3xl:bottom-30 group absolute bottom-24 right-[6%] whitespace-nowrap  rounded-sm border border-white  py-1 pb-2 font-grotesque text-white  md:text-xs  4xl:bottom-36 5xl:py-2 6xl:py-3 portrait:md:-translate-y-[350%]`}
          >
            <span className="absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-white  transition-all duration-700 ease-out group-hover:h-full"></span>
            <span className="relative  text-base group-hover:text-emerald-900 2xl:text-lg 4xl:text-xl 5xl:text-2xl 6xl:text-3xl portrait:md:text-[1rem] ">
              shop now
            </span>
          </Link>
        </div>

        {/**our philosophy section */}
        <div
          className={` ${
            mobileMenu ? 'pb-[35%] pt-[30%]' : 'pb-[18%] pt-[20%]'
          } philosophy-section-content relative flex flex-col bg-white  6xl:pt-[10%]`}
        >
          <p
            className={` ${
              mobileMenu ? 'text-[1rem]' : 'text-[1.5vw]'
            } philosophy-text self-center px-[11%] text-center font-aurora  text-charcoal `}
          >
            our philosophy is not to add anything to our products to make them
            stand out; instead we pare them back and distill each formula down
            to the most-essential, natural active ingredients.
          </p>
        </div>

        {/**rainbow lady section */}
        <div
          className={` ${
            mobileMenu ? 'h-[70svh]' : 'h-full '
          } rainbow-wrapper relative mb-[115%] flex w-[100svw]  items-start bg-white 5xl:mb-[90%] `}
        >
          <picture className="h-full w-[60%] -translate-x-[15%] object-cover object-right 3xl:w-[95%] 3xl:translate-x-[2%]">
            <source
              data-srcset="/assets/homepage/images/rainbow-lady.webp"
              type="image/webp"
            />
            <img
              data-src="/assets/homepage/images/rainbow-lady.jpg"
              alt="red haired ladys profile with reflection of a rainbow on her face"
              width="960"
              height="1440"
              // className="h-full w-full object-cover object-right"
              className={` ${
                mobileMenu
                  ? 'h-full object-cover object-right'
                  : 'object-cover 3xl:h-[100svh] 3xl:object-contain 5xl:h-[110svh]'
              } rainbow-lady w-full`}
            />
          </picture>
          <div className="">
            <p
              className={` ${
                mobileMenu
                  ? 'text-[2.8rem] portrait:xs:text-[3rem]'
                  : 'md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10vw] 3xl:text-[9vw] 5xl:text-[7.8vw] 6xl:text-[7.5vw]'
              } absolute right-[50%] top-0 text-start font-yantramanav font-bold uppercase text-light-brick mix-blend-color-dodge 3xl:left-[19%] 5xl:left-[21%] 6xl:left-[22%]`}
            >
              protect
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[1.2rem]'
                  : 'md:text-xl lg:text-2xl xl:text-3xl 2xl:text-[3vw] 3xl:text-[2.5vw] 4xl:text-[2.2vw] 5xl:text-[2vw] 6xl:text-[1.6vw]'
              } your-skin-text absolute left-[52%] top-[6%] whitespace-nowrap text-center font-yantramanav font-light 3xl:left-[56%] 3xl:top-[8%] 5xl:left-[53%] 5xl:top-[10%] 6xl:top-[11%]`}
            >
              your skin
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'left-[1%] top-[10%] text-[1.5rem] portrait:sm:text-[1.7rem]'
                  : 'left-[14%] top-[12%] md:text-4xl lg:left-[2%] lg:text-[4rem] 2xl:text-[6vw] 3xl:left-[19%] 3xl:top-[15%] 3xl:text-[4.5vw] 4xl:text-[3.5vw] 5xl:left-[21%] 5xl:top-[17%] 5xl:text-[3.1vw] 6xl:left-[22%] 6xl:text-[2.8vw]'
              } uv-rays-text absolute   whitespace-nowrap text-center font-yantramanav font-light uppercase tracking-wide text-[#262625]/80`}
            >
              <span className=" mix-blend-difference lg:text-white/40">
                from
              </span>{' '}
              harmful uva & uvb rays
            </p>
          </div>

          <div className="flex w-[40%] flex-col 3xl:-translate-x-[38%]">
            <div className="  flex w-[90%] flex-col items-center justify-center 3xl:w-[70%] 5xl:w-[60%] 5xl:-translate-x-[15%]">
              <Link
                to={'/product/' + spfProdId}
                aria-label={`product: ${singleProduct?.productName}`}
              >
                <picture>
                  <source
                    data-srcset={convertMediaUrl(
                      singleProduct?.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || singleProduct?.images[0].imageURL
                    )}
                    type="image/webp"
                  />
                  <img
                    className={` ${
                      mobileMenu
                        ? 'h-[280px] pr-4 pt-[80%] portrait:sm:h-[450px] portrait:xs:h-[350px] portrait:xs:pt-[100%]'
                        : 'h-full pt-[70%] '
                    } rainbow-lady-rp lazyload aspect-[1/2] object-cover`}
                    alt={`product: ${singleProduct?.productName}`}
                    data-src={
                      singleProduct?.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || singleProduct?.images[0].imageURL
                    }
                  />
                </picture>
              </Link>
              <p
                className={` ${
                  mobileMenu
                    ? 'pr-4 text-[.8rem]'
                    : 'text-[.8rem] xl:text-[1rem] 2xl:text-[1.4rem] 3xl:text-[1.2rem] 4xl:text-[1.3rem] 5xl:text-[1.4rem]'
                } rainbow-lady-rp pt-1  text-center font-grotesque uppercase `}
              >
                {singleProduct?.productName}
              </p>
            </div>
            <p
              className={` ${
                mobileMenu
                  ? 'bottom-4 left-5 w-[87svw] text-[.9rem] leading-tight portrait:sm:bottom-11'
                  : 'bottom-[3%] right-[9%] w-[50vw] text-[1.5vw] leading-loose 3xl:-bottom-[28%]  3xl:text-[1.1vw] 5xl:-bottom-[25%] 5xl:w-[40vw] 5xl:text-[1vw]'
              } rainbow-lady-text absolute   font-aurora   text-[#262625]`}
            >
              {mobileMenu
                ? `during the summer months, it's essential to keep your skin
              moisturized and hydrated wherever possible`
                : `during the summer months, it's essential to keep your skin
              moisturized and hydrated wherever possible. however, it's
              important to switch high-intensity heavy creams in favor of
              lighter formulations at this time of year.`}
            </p>
          </div>
        </div>

        {/**beach section */}
        <div className="beach-section-content-top relative flex w-full flex-col items-center bg-primary-gray">
          <div className="beach-section-content relative -mb-[80%] flex w-full flex-col items-center bg-primary-gray">
            <p className="absolute right-1/2 top-0 -translate-y-[70%] translate-x-[50%] font-yantramanav text-[15vw] font-bold uppercase leading-none tracking-[.5rem] text-light-brick mix-blend-screen">
              beach
            </p>
            <p className="ready-text absolute right-1/2 top-0 flex -translate-y-[9%] translate-x-[50%] flex-col font-yantramanav text-[4vw] font-thin uppercase tracking-[.7rem] text-white 4xl:text-[3.5vw] ">
              ready
            </p>

            <div
              className={` ${
                mobileMenu ? 'w-[65%] pt-[13%]' : 'w-[45%] pt-[10%] 5xl:w-[30%]'
              } beach-section-rp relative flex  justify-center self-center `}
            >
              <div className="flex justify-center">
                <Link
                  to={'/product/' + randomProd01?._id}
                  className="flex justify-center"
                  aria-label={`product: ${randomProd01?.productName}`}
                >
                  <picture className="aspect-[4/6] w-[80%] transform object-cover transition duration-300 hover:scale-105">
                    <source
                      data-srcset={convertMediaUrl(
                        randomProd01?.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || randomProd01?.images[0].imageURL
                      )}
                      type="image/webp"
                    />
                    <img
                      className="lazyload h-full w-full object-cover"
                      alt={`product: ${randomProd01?.productName}`}
                      data-src={
                        randomProd01?.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || randomProd01?.images[0].imageURL
                      }
                    />
                  </picture>
                </Link>
              </div>

              <div className="flex justify-center">
                <Link
                  to={'/product/' + randomProd02?._id}
                  className="flex justify-center"
                  aria-label={`product: ${randomProd02?.productName}`}
                >
                  <picture className="aspect-[4/6] w-[80%] transform object-cover transition duration-300 hover:scale-105">
                    <source
                      data-srcset={convertMediaUrl(
                        randomProd02?.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || randomProd02?.images[0].imageURL
                      )}
                      type="image/webp"
                    />
                    <img
                      className="lazyload h-full w-full object-cover"
                      alt={`product: ${randomProd01?.productName}`}
                      data-src={
                        randomProd02?.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || randomProd02?.images[0].imageURL
                      }
                    />
                  </picture>
                </Link>
              </div>
            </div>
            <p
              className={` ${
                mobileMenu
                  ? 'w-[49%] translate-y-36 text-[.8rem] portrait:translate-y-40 portrait:sm:translate-y-48'
                  : 'w-[25%] translate-y-[144%] text-[2vw] 5xl:top-52 5xl:text-[1.6vw]'
              } absolute top-0 z-10 flex   flex-col text-center font-aurora  text-black `}
            >
              heavy moisturizers are ideal for cold climates or during winter
              when
              <span className="text-white">
                the air is dryer but they can be too cloying during the heat of
                summer and don't provide adequate
              </span>
            </p>

            <div
              className={`${
                mobileMenu
                  ? 'w-[100svw]'
                  : 'w-[80%] 3xl:w-[70%] 4xl:w-[60%] 5xl:w-[50%]'
              }  pt-[2%]`}
            >
              <picture>
                <source
                  data-srcset="/assets/homepage/images/beach-lady.webp"
                  type="image/webp"
                />
                <img
                  data-src="/assets/homepage/images/beach-lady.jpg"
                  alt="lady with a big white hat is laying on the beach"
                  className="beach-lady-img lazyload aspect-auto h-3/4 w-full object-cover"
                />
              </picture>
            </div>

            <div
              className={`${
                mobileMenu ? 'w-[90svw]' : 'w-[80%] '
              } relative flex  h-full  justify-center gap-[7%] md:gap-[10%] lg:gap-[8%] `}
            >
              <div className="text-container flex w-full flex-col">
                <div
                  className={` ${
                    mobileMenu
                      ? 'h-[96%] w-[30%] translate-x-[10%]'
                      : 'h-[75%] w-[22%] translate-x-[40%] '
                  } beach-oval-container absolute left-0 top-0  -translate-y-[15%] rounded-full bg-black/20`}
                >
                  <p
                    className={` ${
                      mobileMenu
                        ? 'translate-y-[90%] text-[.5rem]'
                        : 'translate-y-[120%] text-[1.4vw] 4xl:text-[1vw] 5xl:translate-y-[190%] 5xl:text-[1.1vw]'
                    } beach-oval-text absolute right-0 top-0 w-[80%] -translate-x-[9%] text-start font-aurora leading-relaxed text-white  5xl:w-[75%] 5xl:-translate-x-[11%]`}
                  >
                    heavy moisturizers are ideal for cold climates or during
                    winter when the air is dryer but they can be too cloying
                    during the heat of summer and don't provide adequate
                  </p>
                </div>
              </div>
              <div className="video-section flex  h-full  max-h-screen w-full -translate-x-[60%] -translate-y-[15%] justify-center">
                <video
                  // src={bwSeizure}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="bw-seizure-vid aspect-[4/6] w-[70%]"
                >
                  <source
                    src="/assets/homepage/vid/bw-seizure.webm"
                    type="video/webm"
                  />
                  <source
                    src="/assets/homepage/vid/bw-seizure.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="product-section absolute right-0 top-2 flex w-[50%] translate-x-[5%] justify-center pl-[8%] 4xl:pl-[3%]">
                <Link
                  to={'/product/' + randomProd03?._id}
                  className={` beach-rp-right flex w-[70%] flex-col items-center 3xl:w-[60%] 4xl:w-[50%] `}
                  aria-label={`product: ${randomProd03?.productName}`}
                >
                  <picture>
                    <source
                      data-srcset={convertMediaUrl(
                        randomProd03?.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || randomProd03?.images[0].imageURL
                      )}
                      type="image/webp"
                    />
                    <img
                      className={`lazyload aspect-[5/6] w-full transform object-cover pt-[2%] transition duration-300 hover:scale-105`}
                      alt={`product: ${randomProd03?.productName}`}
                      data-src={
                        randomProd03?.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || randomProd03?.images[0].imageURL
                      }
                    />
                  </picture>
                  <p
                    className={` ${
                      mobileMenu
                        ? 'text-[.6rem]'
                        : 'text-[1.2vw] 4xl:text-[1vw]'
                    } w-full self-center  overflow-hidden text-ellipsis whitespace-nowrap pt-2  text-center font-grotesque uppercase text-white portrait:md:text-[1rem]`}
                  >
                    {randomProd03?.productName}
                  </p>
                </Link>
              </div>
            </div>

            <div
              className={` ${
                mobileMenu
                  ? 'w-[80%] pt-[4%] text-[.8rem]'
                  : 'w-[55%] text-[1.2vw]'
              } beach-text-closer  pb-[10%] text-center font-aurora  leading-loose text-white 4xl:pb-[17%] 5xl:pb-[20%] portrait:md:pb-[17%] portrait:md:text-[1rem]`}
            >
              <p>
                heavy moisturizers are ideal for cold climates or during winter
                when the air is dryer but they can be too cloying during the
                heat of summer and don't provide adequate
              </p>
            </div>
          </div>

          {/**grapefruit butt section */}
          <div className="z-10 flex w-full  flex-col  items-center bg-primary-gray pb-[7%] lg:pb-[5%] xl:pb-[4%] 3xl:pb-[5%] 4xl:pb-[4%] 6xl:pb-[2%] portrait:md:pb-24">
            <div
              ref={treatRef}
              className=" flex h-full flex-col self-center text-center"
            >
              <div
                ref={grapefruitButtRef}
                className={` ${
                  mobileMenu ? 'aspect-square w-[50%]' : 'w-[30%] 6xl:w-[25%]'
                } grapefruit-butt-img  z-10  aspect-square self-center portrait:md:w-[45%]`}
              >
                <picture>
                  <source data-srcset="/assets/homepage/images/grapefruit-butt.webp" />
                  <img
                    data-src="/assets/homepage/images/grapefruit-butt.jpg"
                    alt="lady wearing nude leotard holding  grapefruit cut in half pressed to her hips"
                    className={`lazyload aspect-square h-full object-cover`}
                  />
                </picture>
              </div>
              <p className="anim-text relative -z-20 -translate-y-[40%] pl-7 font-roboto text-[17vw] font-xbold uppercase  leading-none tracking-[2.5rem] text-white ">
                treat
              </p>
              <p className="anim-text relative z-20 -translate-y-[60%] font-bodoni text-[17vw] font-thin uppercase leading-none  text-white">
                your skin
              </p>
              <p className="anim-text -translate-y-[400%] font-grotesque text-[3vw] font-light uppercase leading-none  text-white/40">
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
              to="/shop-all?filter=body"
              ref={shopBodyRef}
              className={` ${
                mobileMenu ? 'mb-12 text-[1rem]' : 'text-[1.6vw]'
              } group relative z-20  inline-block -translate-y-[250%] overflow-hidden border border-white bg-transparent px-[6vw] py-[1.1vw]  font-grotesque font-light text-white portrait:md:text-[1.1rem]`}
            >
              <span className="absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-white  transition-all duration-700 ease-out group-hover:h-full "></span>
              <span className="relative group-hover:text-charcoal">
                shop body
              </span>
            </Link>
          </div>
        </div>

        {/**unleash section */}
        <div className="unleash-section-content flex w-full flex-col items-center">
          <p
            className={` ${
              mobileMenu
                ? 'text-[3.5rem]'
                : 'pb-4 text-[10vw] lg:pb-5 xl:pb-6 4xl:pb-3'
            } z-10 -translate-y-[50%] font-yantramanav  font-xxbold uppercase tracking-widest text-charcoal/90 mix-blend-difference portrait:md:text-[6rem]`}
          >
            unleash{' '}
          </p>
          <p
            className={` ${
              mobileMenu
                ? '-translate-y-16 text-[1.1rem]'
                : '-translate-y-[550%] text-[2.8vw] 4xl:text-[2.2vw]'
            }  font-grotesque font-thin leading-none tracking-wide portrait:md:text-[1.3rem]`}
          >
            the power of
          </p>
        </div>

        <div
          className={` ${
            mobileMenu ? '' : 'w-[90%]'
          } flex  max-w-[1940px] -translate-y-[6%] flex-row-reverse justify-center self-center `}
        >
          <div className="flex w-full flex-row-reverse justify-center ">
            <picture
              className={`${
                mobileMenu
                  ? 'h-[60svh] w-[60%] object-cover'
                  : ' h-screen w-3/5 object-cover '
              } unleash-lady-img 3xl:object-top `}
            >
              <source
                data-srcset="/assets/homepage/images/lady-mask.webp"
                type="image/webp"
              />
              <img
                data-src="/assets/homepage/images/lady-mask.jpg"
                alt="woman applying mask to her face"
                className="lazyload h-full w-full object-cover 3xl:object-top"
                // className={`${
                //   mobileMenu
                //     ? 'h-[60svh] w-[60%] object-cover'
                //     : ' h-screen w-3/5 object-cover '
                // } unleash-lady-img lazyload  3xl:object-top `}
              />
            </picture>
            <div className=" relative flex w-2/5 flex-col justify-end gap-7">
              <p className=" font-yantramanav text-[9vw] font-semibold uppercase 2xl:text-[9rem]">
                <span
                  className={` ${
                    mobileMenu
                      ? 'tracking-[1.6rem]'
                      : 'tracking-[2.9rem] xl:tracking-[3.4rem] 4xl:tracking-[6rem] 6xl:tracking-[8rem]'
                  } hyd-text-left absolute -right-4 top-0 translate-y-[60%]  text-[#262626] 2xl:translate-y-0`}
                >
                  hyd
                </span>
                <span
                  className={` ${
                    mobileMenu ? 'tracking-[.5rem]' : 'tracking-[1rem]'
                  } absolute right-0 top-0 translate-x-[102%] translate-y-[60%] text-white  2xl:translate-y-0`}
                >
                  ration
                </span>
              </p>
              <Link
                to={'/product/' + maskProdId}
                className={` ${
                  mobileMenu ? 'w-[75%] ' : 'w-[70%]'
                } unleash-rp flex  flex-col  items-center self-end pr-[15%]`}
                aria-label={`product: ${singleProduct?.productName}`}
              >
                <picture>
                  <source
                    data-srcset={convertMediaUrl(
                      singleProduct?.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || singleProduct?.images[0].imageURL
                    )}
                    type="image/webp"
                  />
                  <img
                    className="lazyload min-[1600px]:h-[700px] aspect-[1/2] w-fit transform object-cover transition duration-300 hover:scale-105 md:h-[290px] lg:h-[400px]  xl:h-[490px] 2xl:h-[550px] 3xl:h-[500px] 4xl:h-[600px] 6xl:h-[850px] portrait:md:h-[500px] landscape:short:h-[410px]"
                    alt={`product: ${singleProduct?.productName}`}
                    data-src={
                      singleProduct?.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || singleProduct?.images[0].imageURL
                    }
                  />
                </picture>
                <p
                  className={` ${
                    mobileMenu
                      ? 'text-[.7rem] leading-[1]'
                      : 'text-[1.2vw] 4xl:text-[1vw] 5xl:text-[.9vw]'
                  } w-[90%] pt-4 text-center font-grotesque   uppercase text-charcoal portrait:md:text-[.8rem]`}
                >
                  {singleProduct?.productName}
                </p>
              </Link>

              <Link
                to="/shop-all?filter=masks"
                className={` ${
                  mobileMenu
                    ? 'w-[70%] text-[.7rem]'
                    : 'w-[60%] text-[1.5vw] 4xl:text-[1.2vw] 6xl:text-[.9vw]'
                } group relative mr-[12%] inline-block w-[60%] self-end overflow-hidden rounded-sm border border-[#262626] bg-transparent px-[3vw] py-[1vw] text-center font-grotesque  font-light text-[#262626] portrait:md:text-[.9rem]`}
              >
                <span className="absolute left-0 top-0 mb-0 flex h-0 w-full -translate-y-0 transform bg-charcoal/90  transition-all duration-700 ease-out group-hover:h-full "></span>
                <span className="relative group-hover:text-white">
                  shop masks
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/**facewash section */}
        <div className="facewash-section-content relative z-10 flex  flex-col items-center justify-center pt-[25%]">
          <div
            className={` ${
              mobileMenu
                ? 'w-[85%] translate-x-0 translate-y-[30%]'
                : 'w-[45%] -translate-x-[50%] translate-y-[55%]'
            } absolute right-0 top-0  flex  items-center justify-between gap-[10%] portrait:md:w-[90%]`}
          >
            <p
              className={` ${
                mobileMenu
                  ? ' -translate-x-[10%] text-[.8rem] leading-none'
                  : '-translate-x-[20%] text-[1.5vw] 5xl:translate-y-[100%] 5xl:text-[1vw] 6xl:translate-y-[300%] 6xl:text-[1vw]'
              } facewash-section-text-top z-20 w-full  text-center font-aurora  text-[#262626] portrait:md:-translate-y-[310%] portrait:md:translate-x-[70%] portrait:md:text-[1rem]`}
            >
              heavy moisturizers are ideal for cold climates or during winter
              when the air is dryer but they can be too cloying during the heat
              of summer and don't provide adequate
            </p>

            <Link
              to={'/product/' + randomProd06?._id}
              aria-label={`product: ${randomProd06?.productName}`}
              className={` ${
                mobileMenu
                  ? 'w-44'
                  : 'w-full 6xl:w-[50%] 6xl:-translate-x-[40%] 6xl:translate-y-[90%] '
              } facewash-rp z-50 flex portrait:md:w-[50%] portrait:md:-translate-y-[10%] portrait:md:translate-x-[110%]`}
            >
              <picture>
                <source
                  data-srcset={convertMediaUrl(
                    randomProd06?.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd06?.images[0].imageURL
                  )}
                  type="image/webp"
                />
                <img
                  className={` ${
                    mobileMenu
                      ? 'aspect-[4/5] -translate-x-[20%] '
                      : 'aspect-[7/9] 4xl:aspect-[8/9] 5xl:aspect-[11/11] '
                  } lazyload w-full transform object-cover transition duration-300 hover:scale-110 portrait:md:aspect-[1/2]`}
                  alt={`product: ${randomProd06?.productName}`}
                  data-src={
                    randomProd06?.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd06?.images[0].imageURL
                  }
                />
              </picture>
            </Link>
          </div>

          <div className="-z-10 flex w-full flex-col">
            <picture
              className={` ${
                mobileMenu ? 'h-[50svh]' : 'h-screen'
              } facewash-lady-img aspect-[4/6] self-center  portrait:md:aspect-[10/11]`}
            >
              <source
                data-srcset="/assets/homepage/images/lady-facewash.webp"
                type="image/webp"
              />
              <img
                data-src="/assets/homepage/images/lady-facewash.jpg"
                alt="lady washing her face in the bathroom with white towel on her head"
                className={` ${
                  mobileMenu ? 'h-[50svh]' : 'h-screen'
                } facewash-lady-img lazyload aspect-[4/6] self-center`}
              />
            </picture>
            <p
              className={` ${
                mobileMenu
                  ? 'w-[55%] -translate-x-[13%] -translate-y-[60%] text-[1rem] leading-none '
                  : 'w-[17%] text-[1.5vw] 5xl:-translate-y-[179%] 5xl:text-[1vw] 6xl:-translate-y-[290%] short:-translate-y-[130%]'
              } facewash-section-text-right min-[1600px]:-translate-x-[155%] min-[1600px]:-translate-y-[125%]  -translate-x-[110%] -translate-y-[250%] self-end text-center font-aurora text-[#262626]   5xl:-translate-x-[150%] 5xl:-translate-y-[90%] short:-translate-x-[130%] portrait:md:w-[40%] portrait:md:-translate-x-[6%] portrait:md:text-[1rem]`}
            >
              heavy moisturizers are ideal for cold climates or during winter
              when the air is dryer but they can be too cloying during the heat
              of summer and don't provide adequate
            </p>
          </div>
        </div>

        {/**ingreient section */}
        <div className="ingredient-section-content flex w-[90%] max-w-[1440px] self-center ">
          <div
            className={` ${
              mobileMenu ? 'h-[60svh]' : 'h-screen'
            } flex w-[65%] portrait:md:h-[60svh] `}
          >
            <picture className="papaya-img grow-1 aspect-[2/3] w-full shrink-0 object-cover">
              <source
                data-srcset="/assets/homepage/images/papaya.webp"
                type="image/webp"
              />
              <img
                data-src="/assets/homepage/images/papaya.jpg"
                alt="ripe papaya cut in half"
                className="lazyload h-full w-full object-cover"
                // className="papaya-img lazyload grow-1 aspect-[2/3] w-full shrink-0  object-cover "
              />
            </picture>
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

          <div className="relative flex w-[35%] max-w-[500px] flex-col items-center justify-end pl-[2%] 3xl:pl-0">
            <p
              className={` ${
                mobileMenu
                  ? 'tracking-none whitespace-break-spaces text-xs'
                  : 'text-[1.7vw] 2xl:text-[1.8vw] 4xl:text-[1.3vw]'
              } ingredient-section-subheader absolute left-2 top-[16vw] whitespace-nowrap font-grotesque  font-light 2xl:top-[270px] portrait:md:text-[.8rem]`}
            >
              only best ingredients for best results
            </p>

            <Link
              to={'/product/' + randomProd05?._id}
              className="ingredient-rp min-[2500px]:pt-[200px] flex h-3/4 w-full   flex-col pt-[13%] 3xl:w-[320px] 3xl:pt-28 4xl:w-[420px]"
              aria-label={`product: ${randomProd05?.productName}`}
            >
              <picture
                className={`${
                  mobileMenu ? 'h-[70%]' : ''
                } min-[2500px]:max-h-[750px] aspect-[3/5] transform object-cover pl-[8%] transition duration-300 hover:scale-105 3xl:pl-0 short:pt-16`}
              >
                <source
                  data-srcset={convertMediaUrl(
                    randomProd05?.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd05?.images[0].imageURL
                  )}
                  type="image/webp"
                />
                <img
                  className="lazyload h-full w-full object-cover"
                  data-src={
                    randomProd05?.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || randomProd05?.images[0].imageURL
                  }
                  alt={`product: ${randomProd05?.productName}`}
                />
              </picture>
              <p
                className={` ${
                  mobileMenu
                    ? 'text-[.7rem]'
                    : 'text-[1.3vw] 4xl:text-[1vw] 6xl:text-[.8vw]'
                } pt-[4%] text-center font-grotesque uppercase text-charcoal portrait:md:text-[.8rem]`}
              >
                {randomProd05?.productName}
              </p>
            </Link>
          </div>
        </div>
        <div
          className={` ${
            mobileMenu ? 'w-[85%]' : 'w-[70%]'
          } ingredient-section-closer flex items-center justify-center self-center pb-[4%] pt-[15%] leading-loose`}
        >
          <p
            className={` ${
              mobileMenu
                ? 'text-[.8rem] leading-none'
                : 'pb-20 text-[1.4vw] 5xl:text-[1.1vw]'
            } text-center font-aurora`}
          >
            heavy moisturizers are ideal for cold climates or during winter when
            the air is dryer but they can be too cloying during the heat of
            summer and don't provide adequate hydration
          </p>
        </div>

        <div
          className={` ${
            mobileMenu ? 'w-[90%] pb-[15%]' : 'w-[70%] '
          } landing-page-closer-container flex h-full justify-center self-center pb-[10%] xl:w-[60%] 3xl:w-[50%] 4xl:w-[49%] 4xl:pb-[1%] 5xl:w-[40vw] 5xl:pb-[10%] short:w-[45%]  portrait:md:w-[90svw] portrait:md:pb-[5%]`}
        >
          <div
            className={` ${
              mobileMenu
                ? ' h-[28dvh] '
                : ' h-[55dvh] xl:h-[50dvh] 2xl:h-[45dvh] 5xl:h-[50dvh]'
            } flex w-full items-center justify-center gap-8 2xl:h-[75dvh] `}
          >
            <picture className="h-full w-[30%] object-cover">
              <source
                data-srcset="/assets/homepage/images/coconut-hand.webp"
                type="image/webp"
              />
              <img
                data-src="/assets/homepage/images/coconut-hand.jpg"
                alt="hand is reaching for a coconut cut in half"
                className="lazyload aspect-[1/2] w-full object-cover"
              />
            </picture>
            <picture className="melon-img h-full w-[30%] object-cover">
              <source
                data-srcset="/assets/homepage/images/melon.webp"
                type="image/webp"
              />
              <img
                data-src="/assets/homepage/images/melon.jpg"
                alt="melon cut in half"
                className="lazyload aspect-[1/2] w-full object-cover"
              />
            </picture>
            <div className="h-full w-[30%] object-cover">
              <video
                muted
                loop
                autoPlay
                playsInline
                controls={false}
                className="leg-brush-vid aspect-[1/2] w-full object-cover"
              >
                <source src="/assets/homepage/vid/leg-brush-trimmed.webm" />
                <source src="/assets/homepage/vid/leg-brush-trimmed.mp4" />
              </video>
            </div>
          </div>
        </div>
        {/* <div className='pb-96'></div> */}
      </div>
    </>
  );
}
