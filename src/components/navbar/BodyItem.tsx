import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectTagState } from '../../redux/slices/tagSlice';
import { useAppSelector } from '../../redux/hooks';
import { MenuOption } from './DropdownMenu';
import { gsap } from 'gsap';

const bodyitems = ['moisturizers', 'creams', 'spf'] as const;

export type BodyItemProps = {
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
  closeOuterMenu: () => void;
};

export default function BodyItem({
  setMenuMode,
  closeOuterMenu,
}: BodyItemProps) {
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

      tl.fromTo(
        localParent.current,
        { height: 0 },
        {
          height: menuHeight,
          duration: 1.5,
          ease: 'power4',
        }
      );

      setBodyState(tl);
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
    <section
      ref={localParent}
      onMouseLeave={() => closeLocalMenu()}
      className='absolute right-0 top-[65%] flex h-screen w-screen flex-col flex-wrap place-content-start gap-x-[3vw] bg-[#262626] py-[2%] pl-10 text-[2vw] text-white '
    >
      {filteredTags.map((tag) => {
        const name = tag.tagName;

        return (
          <Link
            to='/shop-all'
            onClick={() => closeLocalMenu(true)}
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
