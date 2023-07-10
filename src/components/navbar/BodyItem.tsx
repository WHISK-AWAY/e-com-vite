import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectTagState } from '../../redux/slices/tagSlice';
import { useAppSelector } from '../../redux/hooks';
import { MenuOption } from './DropdownMenu';
import { gsap } from 'gsap';

const bodyitems = ['moisturizers', 'creams', 'spf'] as const;

export default function BodyItem({
  setIsMenuHidden,
  menuMode, setMenuMode
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  menuMode: 'body';
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
}) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  const [menuHeight, setMenuHeight] = useState(0);
  const localParent = useRef<HTMLDivElement>(null);
   const [bodyState, setBodyState] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (localParent.current) {
      setMenuHeight(
        Math.round(
          window.innerHeight -
            (localParent.current?.getBoundingClientRect().top || 0)
        )
      );
    }
  }, [window.innerHeight, localParent.current]);

  const filteredTags = tagList.filter((tag) =>
    bodyitems.includes(tag.tagName as (typeof bodyitems)[number])
  );






    useLayoutEffect(() => {
      if (!localParent.current) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({});

        tl.set(localParent.current, {
          height: 0,
        });

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

        setBodyState(tl);

        localParent?.current?.addEventListener('mouseleave', () => {
          tl?.duration(0.9).reverse();
        });
      });

      return () => {
        ctx.revert();
      };
    }, [localParent.current, menuHeight, menuMode]);





  return (
    <section
      ref={localParent}
      // style={{
      //   height: menuHeight,
      // }}
      className='absolute right-0 top-[65%] flex h-screen w-screen flex-col flex-wrap place-content-start gap-x-[3vw] bg-[#262626] text-white py-[2%] pl-10 text-[2vw] '
    >
      {filteredTags.map((tag) => {
        const name = tag.tagName;

        return (
          <Link
            to='/shop-all'
            onClick={() => setIsMenuHidden(true)}
            state={{ filterKey: name }}
            className='odd:text-[3vw] hover:underline hover:underline-offset-2'
            key={tag._id}
          >
            {name}
          </Link>
        );
      })}
    </section>
  );
}
