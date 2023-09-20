import Cart from './Cart';
import Favorite from './Favorite';
import { TCFMode } from './navbar/Navbar';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CartFavWrapper({
  mode,
  setIsCartFavWrapperHidden,
  mobileMenu
}: {
  mode: TCFMode;
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenu: boolean
}) {
  const wrapper = useRef(null);
  const blurBg = useRef(null);
  const [reverseSlide, setReverseSlide] = useState<gsap.core.Timeline | null>(
    null
  );

  useEffect(() => {
    if (!wrapper) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(blurBg.current, {
        opacity: 0,
        duration: 0.6,
      });
      tl.from(
        wrapper.current,
        {
          x: '+=100%',
          duration: 1,
          ease: 'power4.inOut',
        },
        '<'
      );

      setReverseSlide(tl);
    });

    return () => {
      ctx.revert();
    };
  }, [wrapper.current, blurBg.current]);

  function clickOff(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') {
      closeSlider();
    }
  }

  const closeSlider = () => {
    reverseSlide
      ?.duration(reverseSlide.duration() / 1.4)
      .reverse()
      .then(() => {
        setIsCartFavWrapperHidden(true);
      });
  };

  return (
    <section
      ref={blurBg}
      id='wrapper'
      onClick={clickOff}
      className='cart-container fixed right-0 top-0 z-[99] flex h-[100svh] w-[100svw] flex-col overflow-hidden bg-[#35403F]/50 backdrop-blur-md'
    >
      <div
        ref={wrapper}
        // onClick={() => setIsCartFavWrapperHidden(true)}
        className={` ${
          mobileMenu ? 'h-[100svh] w-[100svw]  ' : 'w-[40vw]'
        } flex h-full  flex-col self-end bg-white 2xl:w-[34vw] 5xl:w-[25vw] 6xl:w-[20vw] portrait:md:w-[65svw]`}
      >
        {mode === 'cart' ? (
          <Cart closeSlider={closeSlider} />
        ) : (
          <Favorite closeSlider={closeSlider} />
        )}
      </div>
    </section>
  );
}
