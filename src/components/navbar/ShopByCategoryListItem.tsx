import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectTagState } from '../../redux/slices/tagSlice';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { MenuOption } from './DropdownMenu';

export default function ShopByCategoryListItem({
  setIsMenuHidden,
  menuMode,
  setMenuMode,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  menuMode: 'category';
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
}) {
  const localParent = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const [catState, setCatState] = useState<gsap.core.Timeline | null>(null);
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;
  const catRef = useRef(null);

  useEffect(() => {
    setMenuHeight(
      Math.round(
        window.innerHeight -
          (localParent.current?.getBoundingClientRect().top || 0)
      )
    );
  }, [window.innerHeight, localParent.current]);

  useLayoutEffect(() => {
    if (!localParent.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({});

      // tl.set(localParent.current, {
      //   opacity: 0,
      // });

      tl.to(localParent.current, {
        opacity: 1,
        duration: 0.2,
        onReverseComplete: () => {
          setMenuMode(null);
        },
      });
      tl.to(
        localParent.current,
        {
          height: menuHeight,
          // delay: .1,
          duration: 1.5,
          ease: 'power4',
        },

        '<'
      );

      setCatState(tl);

      localParent?.current?.addEventListener('mouseleave', () => {
        tl?.duration(0.9).reverse();
      });
    });

    return () => {
      ctx.revert();
    };
  }, [localParent.current, menuHeight, menuMode]);

  return (
    <div
      ref={localParent}
      className=' group absolute left-0 top-[65%] z-10 flex h-0 w-screen flex-col flex-wrap   '
    >
      {menuHeight > 0 && (
        <section
          // ref={catRef}
          className=' flex h-screen w-screen flex-col flex-wrap place-content-start justify-start gap-x-[3vw] self-center overflow-hidden bg-[#262626]  py-[2%] pl-12 text-[2vw] leading-tight text-white'
        >
          {tagList.map((tag) => {
            const name = tag.tagName;
            return (
              <Link
                key={tag._id}
                to='/shop-all'
                onClick={() => setIsMenuHidden((prev) => !prev)}
                state={{ filterKey: name }}
                className='odd:text-[3vw] hover:underline hover:underline-offset-2'
              >
                {name}
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
