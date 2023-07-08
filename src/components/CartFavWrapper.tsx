import Cart from './Cart';
import Favorite from './Favorite';
import { TCFMode } from './navbar/Navbar';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CartFavWrapper({
  mode,
  setIsCartFavWrapperHidden,
}: {
  mode: TCFMode;
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
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
        duration: 0.3,
      });
      tl.from(
        wrapper.current,
        {
          x: '+=100%',
          duration: 0.8,
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
      ?.duration(reverseSlide.duration() / 2)
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
      className='cart-container fixed right-0 top-0 z-[99] flex h-screen w-screen flex-col overflow-hidden bg-[#35403F]/50 backdrop-blur-md'
    >
      <div
        ref={wrapper}
        // onClick={() => setIsCartFavWrapperHidden(true)}
        className='flex h-full  min-w-[35vw] max-w-[40vw] flex-col self-end bg-white 4xl:max-w-[10vw]'
      >
        {mode === 'cart' ? (
          <Cart
            setIsHidden={setIsCartFavWrapperHidden}
            closeSlider={closeSlider}
          />
        ) : (
          <Favorite closeSlider={closeSlider} />
        )}
      </div>
    </section>
  );
}
