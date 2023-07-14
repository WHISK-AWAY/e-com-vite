import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { selectTagState } from '../../redux/slices/tagSlice';
import { useAppSelector } from '../../redux/hooks';
import { MenuOption } from './DropdownMenu';
import { gsap } from 'gsap';

const faceitems = [
  'moisturizers',
  'oils',
  'tinted care',
  'masks',
  'nighttime skincare',
  'eye care',
  'acne',
  'cleansers',
  'exfoliators & peelings',
  'essences',
  'serums',
  'lip care',
  'creams',
  'spf',
];

export type FaceItemProps = {
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
  closeOuterMenu: () => void;
};

export default function FaceItem({
  setMenuMode,
  closeOuterMenu,
}: FaceItemProps) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  const localParent = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const [faceState, setFaceState] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setMenuHeight(
      Math.round(
        window.innerHeight -
          (localParent.current?.getBoundingClientRect().top || 0)
      )
    );
  }, []);

  const filteredTags = tagList.filter((tag) => faceitems.includes(tag.tagName));

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

      setFaceState(tl);
    });

    return () => {
      ctx.revert();
    };
  }, [localParent.current, menuHeight]);

  function closeLocalMenu(fullClose: boolean = false) {
    gsap
      .to(localParent.current, {
        overflow: 'hidden',
        height: 0,
        duration: 0.5,
        ease: 'power1.in',
      })
      .then(() => {
        if (fullClose) {
          closeOuterMenu();
        } else {
          setMenuMode('none');
        }
      });
  }

  if (!filteredTags) return <p>...loading</p>;

  return (
    <section
      ref={localParent}
      onMouseLeave={() => closeLocalMenu()}
      className='absolute right-0 top-[65%] z-10 flex h-0 w-screen flex-col flex-wrap place-content-start gap-x-[3vw] bg-[#262626] py-[2%] pl-10 text-[2vw] text-white'
    >
      {filteredTags.map((tag) => {
        const name = tag.tagName;
        return (
          <Link
            to='/shop-all'
            state={{ filterKey: name }}
            className='odd:text-[3vw] hover:underline hover:underline-offset-2'
            onClick={() => closeLocalMenu(true)}
            key={tag._id}
          >
            {name}
          </Link>
        );
      })}
    </section>
  );
}
