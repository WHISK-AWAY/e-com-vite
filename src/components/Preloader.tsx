import { gsap } from 'gsap';
import { useEffect } from 'react';
import face1 from '../assets/bg-img/loader/face1.jpg';
import face2 from '../assets/bg-img/loader/face2.jpg';

export default function Preloader() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1 });

      tl.to('.loader-wrapper, .loader', {
        scale: 9,
        ease: 'power1.inOut',
        duration: 2.4,
      });

      tl.to(
        '.logo',
        {
          // yPercent: -20,
          duration: 1,
          ease: 'power4',
        },
        '<.8'
      );
      tl.to(
        '.logo1',
        {
          yPercent: 20,
          duration: 1,
          ease: 'power4',
        },
        '<.8'
      );

      tl.to(
        '.loader-wrapper, .loader',
        {
          scale: 0,
          opacity: 0,
          display: 'none',
          ease: 'power3.inOut',
          // delay: 2.1
        },
        '<1'
      );
      tl.to(
        '.clipper-left',
        {
          delay: 0.8,
          // clipPath: 'inset(0 100% 0 0)',
          xPercent: -100,
          ease: 'expo',
          duration: 1.5,
          // duration: 2
        },
        1.5
      );

      tl.to(
        '.clipper-right',
        {
          delay: 0.8,
          // clipPath: 'inset(0 0 0 100%)',
          xPercent: 100,
          duration: 1.5,
          ease: 'expo',
          // duration:
        },
        1.5
      );

      tl.to('.black-layout', {
        ease: 'slow',
        duration: 1,
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className='pre-loader clipper-container relative z-[1000]'>
      {/* //   <div className='clipper-left inset-clip absolute left-0 top-0 z-10 flex  h-screen w-[50vw]   justify-end overflow-clip  bg-black'>
    //     <span className='logo translate-y-[30%]  font-notable  text-[10vw] translate-x-[15%] overflow-hidden uppercase text-white'>
    //       asto
    //     </span>
    //   </div>
    //   <div className='loader-wrapper  absolute right-1/2 top-0 z-50 h-[300px] w-[1px]  bg-white'>
    //     <div className='loader z-[100000]  h-[10px] w-full bg-white '></div>
    //   </div>
    //   <div className='clipper-right   inset-clip absolute right-0 top-0 z-10 flex h-screen w-[50vw]  justify-start overflow-clip  bg-black'>
    //     <span className='logo translate-y-[30%] -translate-x-[16%] overflow-hidden font-notable mix-blend-luminosity text-[10vw] uppercase text-white'>
    //       oria
    //     </span>
    //   </div> */}

      <div className='black-layout relative h-screen w-screen bg-white'>
        <div className='face-container flex h-screen w-screen flex-col items-end justify-start overflow-hidden pr-[16%] pt-[5%]'>
          <img src={face1} className='aspect-[4/6] w-[24vw] object-cover ' />
          <img
            src={face2}
            className='aspect-[4/6] w-[20vw] -translate-x-[10%] -translate-y-[39%] object-cover'
          />
          <div className="text-wrapper flex flex-col">

          <p className='slogan-1 font-raleway text-[3vw]  font-light uppercase absolute top-[40%] left-[30%] text-black'>
            love your skin
          </p>
          <p className="slogan-2 text-black text-[7vw] uppercase absolute bottom-[30%] -right-[30%] font-raleway font-light -translate-x-[250%]">enough</p>
          </div>
        </div>
      </div>
    </div>
  );
}
