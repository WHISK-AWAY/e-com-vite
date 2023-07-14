import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectTagState } from '../../redux/slices/tagSlice';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import type { MenuOption } from './DropdownMenu';

export type ShopByCategoryListItem = {
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
  closeOuterMenu: () => void;
};

export default function ShopByCategoryListItem({
  setMenuMode,
  closeOuterMenu,
}: ShopByCategoryListItem) {
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

      tl.fromTo(
        localParent.current,
        {
          opacity: 1,
          height: 0,
        },
        {
          height: menuHeight,
          duration: 1.5,
          ease: 'expo',
        }
      );

      // tl.set(localParent.current, {
      //   opacity: 1,
      //   height: 0,
      //   // duration: 0.2,
      // });
      // tl.to(
      //   localParent.current,
      //   {
      //     height: menuHeight,
      //     // delay: .1,
      //     duration: 1.5,
      //     ease: 'expo',
      //   },
      //   '<'
      // );

      setCatState(tl);

      // moved this stuff to the onMouseLeave of the localParent div element
      // localParent?.current?.addEventListener('mouseleave', () => {
      //   tl?.duration(0.9).reverse();
      // });
    });

    return () => {
      ctx.revert();
    };
  }, [localParent.current, menuHeight]);

  function closeLocalMenu(fullClose: boolean = false) {
    if (fullClose) {
      setMenuMode('none');
      closeOuterMenu();
    } else
      gsap
        .to(localParent.current, {
          overflow: 'hidden',
          height: 0,
          duration: 0.5,
          ease: 'power1.in',
        })
        .then(() => {
          setMenuMode('none');
        });
  }

  return (
    <div
      ref={localParent}
      onMouseLeave={() => closeLocalMenu()}
      className='group absolute left-0 top-[75%] z-10 flex h-0 w-screen flex-col flex-wrap'
    >
      {menuHeight > 0 && (
        <section
          // ref={catRef}
          className='flex  h-screen  w-screen flex-col flex-wrap place-content-start justify-start gap-x-[3vw] self-center overflow-hidden border-2 border-white bg-[#51524b]  py-[2%] pl-12 text-[2vw] leading-tight text-white'
        >
          {tagList.map((tag) => {
            const name = tag.tagName;
            return (
              <Link
                key={tag._id}
                to='/shop-all'
                onClick={() => {
                  closeLocalMenu(true);
                }}
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
