import SignIn from './SignIn';
import SignUp from './SignUp';
import { useEffect, useRef, useState } from 'react';
import x from '../assets/icons/x.svg';
import whiteX from '../assets/icons/whiteX.svg';
import { gsap } from 'gsap';

export type TMode = 'sign-in' | 'sign-up';

export default function SignWrapper({
  setIsSignFormHidden,
  mobileMenu,
}: {
  setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenu: boolean;
}) {
  const [mode, setMode] = useState<TMode>('sign-in');
  const blurBg = useRef(null);
  const wrapperRef = useRef(null);
  const xIconRef = useRef(null);

  const [reverseSlide, setReverseSlide] = useState<gsap.core.Timeline | null>(
    null
  );

  useEffect(() => {
    if (!wrapperRef) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ duration: 0.3 });

      tl.from(blurBg.current, {
        opacity: 0,
        duration: 0.3,
      });
      tl.from(
        wrapperRef.current,
        {
          x: '+=100%',
          duration: 0.8,
          ease: 'power4.out',
        },
        '<'
      );
      gsap.from(xIconRef.current, {
        opacity: 0,
        delay: 0.9,
        duration: 1.3,
        ease: 'slow.inOut',
      });

      setReverseSlide(tl);
    });

    return () => {
      ctx.revert();
    };
  }, []);

  function clickOff(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') {
      closeSlider();
    }
  }

  const closeSlider = () => {
    reverseSlide
      ?.duration(reverseSlide.duration() / 1)
      .reverse()
      .then(() => {
        setIsSignFormHidden(true);
      });
  };

  return (
    <section
      ref={blurBg}
      onClick={clickOff}
      id="wrapper"
      className="wrapper form-container fixed right-0 top-0 flex h-[100svh] w-[100svw] flex-col overflow-hidden bg-[#35403F]/60 backdrop-blur-md"
    >
      <div
        ref={wrapperRef}
        className={` ${
          mobileMenu ? 'h-[100svh] w-[100svw]' : 'w-[40vw]'
        } relative flex h-full  flex-col self-end bg-white 2xl:w-[30vw] 5xl:w-[25vw] 6xl:w-[20vw] portrait:md:w-[65svw] `}
      >
        <div
          ref={xIconRef}
          onClick={closeSlider}
          className={` ${
            mobileMenu ? ' w-9 ' : ' w-3'
          } absolute right-5 top-5 z-50 h-10  cursor-pointer`}
        >
          {mode === 'sign-in' ? (
            <img
              src={x}
              alt="close sign in slider"
              className={`${
                mobileMenu ? 'w-4' : 'w-1 lg:w-2 portrait:md:w-full'
              }`}
            />
          ) : (
            <img
              src={whiteX}
              alt="close sign up slider"
              className={`${
                mobileMenu ? 'w-4' : 'w-1 lg:w-2 portrait:md:w-full'
              }`}
            />
          )}
        </div>
        {mode === 'sign-in' ? (
          <SignIn
            setMode={setMode}
            closeSlider={closeSlider}
          />
        ) : (
          <SignUp
            setMode={setMode}
            closeSlider={closeSlider}
          />
        )}
      </div>
    </section>
  );
}
