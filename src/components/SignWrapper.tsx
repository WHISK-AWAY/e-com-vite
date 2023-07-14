import SignIn from './SignIn';
import SignUp from './SignUp';
import { useEffect, useRef, useState } from 'react';
import x from '../assets/icons/x.svg';
import whiteX from '../assets/icons/whiteX.svg';
import { gsap } from 'gsap';

export type TMode = 'sign-in' | 'sign-up';

export default function SignWrapper({
  setIsSignFormHidden,
}: {
  setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [mode, setMode] = useState<TMode>('sign-in');
  const blurBg = useRef(null);
  const wrapperRef = useRef(null);
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
      id='wrapper'
      className='wrapper form-container fixed right-0 top-0 flex h-[100vh] w-[100vw] flex-col overflow-hidden bg-[#35403F]/60 backdrop-blur'
    >
      <div
        ref={wrapperRef}
        className='relative flex h-full w-[35vw] flex-col self-end bg-white 2xl:max-w-[23vw]  '
      >
        <div
          onClick={closeSlider}
          className='absolute right-5 top-5 z-50 h-10 w-3 cursor-pointer'
        >
          {mode === 'sign-in' ? (
            <img src={x} alt='x-icon' className=' w-1 lg:w-2 ' />
          ) : (
            <img src={whiteX} alt='x-icon' className=' w-1 lg:w-2 ' />
          )}
        </div>
        {mode === 'sign-in' ? (
          <SignIn setMode={setMode} closeSlider={closeSlider} />
        ) : (
          <SignUp setMode={setMode} />
        )}
      </div>
    </section>
  );
}
