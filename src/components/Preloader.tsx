import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import vidLoader from '../assets/bg-img/loader/vid1.mp4';

export default function Preloader() {
  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, []);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!document.querySelector('.logo')) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1 });

      //  const pause = tl.paused('.vid', true)
      // tl.set('vid1, vid2, vid', {
      //   display: 'none',
      //   height: 0,
      //   overflow: 'hidden',
      //   backgroundColor: 'white'
      // });

      tl.set('.slogan', {
        display: 'none',
        height: 0,
      });

      tl.set('.vid', {
        clipPath: 'polygon(0 1%, 100% 0%, 100% 100%, 0% 100%)',
        scale: 3,
        ease: 'expo',
        duration: 3,
      });

      tl.set('.loader, .loader-wrapper', {
        height: 0,
        display: 'none',
      });

      tl.from('.logo', {
        duration: 2,
        overflow: 'hidden',
        ease: 'power4.inOut',
        height: 0,
        opacity: 0,
        // yPercent: -80
        // stagger: .5
      });

      tl.to('.loader-wrapper, .loader', {
        duration: 2,
        delay: 0.2,
        scale: 3,
        height: '100vh',
        ease: 'slow',
        display: 'block',
        // stagger: 0.05,
      });

      tl.to(
        '.logo',
        {
          yPercent: -300,
          duration: 1,
          ease: 'power4',
        },
        '<.8'
      );

      tl.set('.loader-wrapper, .loader', {
        scale: 0,
        opacity: 0,
        display: 'none',
        ease: 'power3.inOut',

        delay: 2,
      });
      tl.to(
        '.clipper-left',
        {
          delay: 2.8,
          // clipPath: 'inset(0 100% 0 0)',
          xPercent: -100,
          ease: 'expo',
          duration: 1.5,
          // duration: 2
        },
        3.5
      );

      tl.to(
        '.clipper-right',
        {
          delay: 2.8,
          // clipPath: 'inset(0 0 0 100%)',
          xPercent: 100,
          duration: 1.5,
          ease: 'expo',
          // duration:
        },
        3.5
      );

      // tl.play(5)
      // //  const og = document.querySelector('.vid')
      // tl.from('.vid', {
      //   // clipPath: 'polygon(0% 0%, 100% 0%, 100% 25%, 0% 25%, 0% 50%, 100% 50%, 100% 75%, 0% 75%, 0% 100%, 100% 100%, 100% 0%, 75% 0%, 75% 100%, 50% 100%, 50% 0%, 25% 0%, 25% 100%, 0% 100%)',
      //   // duration: 3,
      //   ease: 'slow'
      //   // clipPath: 'circle(50% at 50% 50%)',
      // });
      //  const clone = og?.cloneNode(true);

      // vidRef.current?.eventCallback('onComplete', vidRef.current.play())
      //   tl.from('.vid', {
      //   clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
      //   // ease: 'slow',
      //   // duration: 6,
      //   // xPercent: '+=100'
      //   // onComplete: () => {
      //   //   vidRef.current?.restart()
      //   // }
      //   // delay: 4,
      //   // clipPath: 'polygon(0 1%, 100% 0%, 100% 100%, 0% 100%)',
      //   ease: 'slow',
      //   // scale: 2,
      //   duration: 3
      //   // scale: 2,
      // });

      // tl.from(
      //   '.vid',
      //   {
      //     clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
      //     // x: '+=100',
      //     duration: 2,
      //     ease: 'slow',
      //   },

      //   );

      // tl.from('.vid', {
      //   // scale: 3,
      //   duration: 1.2,
      //   // ease: 'power4'
      // })
      tl.to('.vid', {
        // xPercent: 50,
        clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
        ease: 'power4.inOut',
        duration: 5,
        scale: 1,
      });
      tl.to('.vid', {
        // x: '+=100',
        // clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
        ease: 'expo',
        duration: 2,
        xPercent: 80,
      });

      tl.to('.slogan', {
        display: 'block',
        height: 100,
        x: -40,
        duration: 1,
        ease: 'expo',
      });

      // tl.to('.white-layout', {
      //   display: 'block',
      //   ease: 'power4',
      //   xPercent: 50,
      //   duration: 1,
      //   height: 100
      //   // opacity: '40%',

      // }, '<+=4')

      tl.to(
        '.vid-layout',
        {
          yPercent: -100,
          // opacity: 0
          duration: 0.7,
          ease: 'expo.inOut',
        },
        '<+=4'
      );
    });

    return () => {
      // vidRef.play()
      ctx.revert();
    };
  }, []);

  return (
    <div className="pre-loader clipper-container relative z-[100000]">
      <div className="clipper-left inset-clip absolute left-0 top-0 z-10 flex  h-screen w-[50vw]   justify-end overflow-clip  bg-black">
        <span className="logo absolute bottom-[10%] right-0 z-[100] inline-block h-fit translate-x-[15%] overflow-visible font-notable text-[10vw] uppercase text-white">
          asto
        </span>
      </div>
      <div className="loader-wrapper  absolute right-1/2 top-0 z-50 h-screen w-[1px] overflow-visible bg-white">
        <div className="loader  h-[10px] w-full bg-white "></div>
      </div>
      <div className="clipper-right   inset-clip absolute right-0 top-0 z-10 flex h-screen w-[50vw]  justify-start overflow-clip  bg-black">
        <span className="logo absolute   bottom-[10%] left-0 inline-block h-fit -translate-x-[16%]  overflow-visible font-notable text-[10vw] uppercase text-white mix-blend-luminosity">
          oria
        </span>
      </div>

      <div className="vid-layout flex h-screen w-screen justify-center  bg-white">
        <video
          ref={vidRef}
          src={`${vidLoader}#t=7`}
          muted={true}
          autoPlay={true}
          className="vid poly-clip poly-clip aspect-[5/6] w-96  object-cover"
        ></video>
        {/* <video ref={vidRef} src={`${vidLoader}#t=7`} muted={true} autoPlay={true} className='vid w-96 aspect-[5/6] poly-clip object-cover'></video> */}
        {/* <video ref={vidRef} src={`${vidLoader}#t=7`} muted={true} autoPlay={true} className='vid w-96 aspect-[5/6] poly-clip object-cover'></video> */}
        <p className="slogan absolute left-[1/2] top-[30%] flex flex-col items-start justify-start font-marcellus text-[2vw] uppercase 5xl:left-[30%]">
          glow gifted by{' '}
          <span className="self-center  font-aurora lowercase  ">nature</span>
        </p>
      </div>
      {/* <div className='white-layout bg-red-900 w-screen h-screen flex'></div> */}
    </div>
  );
}
