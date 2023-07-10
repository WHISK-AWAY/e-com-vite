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

export default function FaceItem({
  setIsMenuHidden,
  menuMode, setMenuMode
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  menuMode: 'face';
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
}) {
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

      setFaceState(tl);

      localParent?.current?.addEventListener('mouseleave', () => {
        tl?.duration(0.9).reverse();
      });
    });

    return () => {
      ctx.revert();
    };
  }, [localParent.current, menuHeight, menuMode]);

  if (!filteredTags) return <p>...loading</p>;



  return (
    

  
    <section
      ref={localParent}
      className='absolute right-0 top-[65%] z-10 flex h-screen w-screen flex-col flex-wrap place-content-start gap-x-[3vw] bg-[#262626] text-white py-[2%] pl-10 text-[2vw]'
      // style={{
      //   height: menuHeight,
      // }}
    >

      {filteredTags.map((tag) => {
        const name = tag.tagName;
        return (
          <Link
            to='/shop-all'
            state={{ filterKey: name }}
            className='odd:text-[3vw] hover:underline hover:underline-offset-2'
            onClick={() => {
              setIsMenuHidden((prev) => !prev);
            }}
            key={tag._id}
          >
            {name}
          </Link>
        );
      })}
    </section>

     
  );
}
