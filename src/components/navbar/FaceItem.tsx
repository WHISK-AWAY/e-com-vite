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
  // const [faceState, setFaceState] = useState<gsap.core.Timeline | null>(null);

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
      const tl = gsap.timeline();

      tl.set('.submenu-item', {
        opacity: 0,
      })
        .fromTo(
          localParent.current,
          {
            opacity: 1,
            height: 0,
          },
          {
            height: menuHeight,
            duration: 0.5,
            ease: 'expo',
          }
        )
        .to('.submenu-item', {
          opacity: 1,
          stagger: 0.025,
          duration: 0.25,
        });

      // setFaceState(tl);
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
        .to('.submenu-item', {
          opacity: 0,
          duration: 0.25,
          stagger: -0.025,
        })
        .then(() => {
          gsap
            .to(localParent.current, {
              overflow: 'hidden',
              height: 0,
              duration: 0.3,
              ease: 'power1.in',
            })
            .then(() => {
              setMenuMode('none');
            });
        });
  }

  if (!filteredTags) return <p>...loading</p>;

  return (
    <div
      ref={localParent}
      onMouseLeave={() => closeLocalMenu()}
      className='absolute left-0 top-[75%] z-10 flex h-0 w-screen flex-col flex-wrap font-thin'
    >
      {menuHeight > 0 && (
        <section
          onMouseLeave={() => closeLocalMenu()}
          className='flex h-screen w-screen flex-col flex-wrap place-content-start justify-start gap-x-[3vw] self-center overflow-hidden border-2 border-white bg-[#51524b] py-[2%] pl-12 text-[min(2vw,_3vh)] leading-tight text-white'
        >
          {filteredTags.map((tag) => {
            const name = tag.tagName;
            return (
              <Link
                to='/shop-all'
                state={{ filterKey: name }}
                className='submenu-item odd:text-[min(3vw,_4.5vh)] hover:underline hover:underline-offset-2'
                onClick={() => closeLocalMenu(true)}
                key={tag._id}
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
