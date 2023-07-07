import Cart from './Cart';
import Favorite from './Favorite';
import { TCFMode } from './navbar/Navbar';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { set } from 'mongoose';

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
      const tl = gsap.timeline({ duration: 0.3 });

      // tl.to(blurBg, {
      //   opacity: 0,
      //   duration: 4,
      //   x: '-=100%'
      // })
      tl.from(blurBg.current, {
        // backdropFilter: 'none',
        opacity: 0,
        duration: 0.3,
      });
      const slider = tl.from(
        wrapper.current,
        {
          x: '+=100%',
          duration: 0.8,
          ease: 'power4.out',
          onComplete: (self) => {
            tl.remove(self);
            tl.to(wrapper.current, {
              x: '+=100%',
              duration: 1,
              ease: 'elastic.out',
            });
          },
        },
        '<'
      );

      // slider.onComplete(() => {
      //   tl.remove(slider);
      //   tl.to(wrapper.current, {
      //     x: '+=100%',
      //     duration: 1,
      //     ease: 'elastic.out',
      //   });
      // });
      setReverseSlide(tl);
      //  const reverse = () => {
      //   tl.reverse().then(() => {
      //     setIsCartFavWrapperHidden(true);
      //   })
      //  }
      // setReverseSlide(reverse)
    });

    return () => {
      ctx.revert();
    };
  }, [wrapper.current, blurBg.current]);

  useEffect(() => {});

  return (
    <section
      ref={blurBg}
      // onClick={() => setIsCartFavWrapperHidden(true)}
      className='cart-container fixed right-0 top-0 z-[99] flex h-screen w-screen flex-col overflow-hidden bg-[#35403F]/50 backdrop-blur-md'
    >
      <div
        ref={wrapper}
        // onClick={() => setIsCartFavWrapperHidden(true)}
        className='flex h-full min-w-[35vw] max-w-[40vw] flex-col self-end bg-white 4xl:max-w-[10vw]'
      >
        {mode === 'cart' ? (
          <Cart
            setIsHidden={setIsCartFavWrapperHidden}
            reverseSlide={reverseSlide}
          />
        ) : (
          <Favorite setIsHidden={setIsCartFavWrapperHidden} />
        )}
      </div>
    </section>
  );
}
