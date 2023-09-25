import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectTagState } from '../../redux/slices/tagSlice';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import type { MenuOption } from './DropdownMenu';

export type ShopByCategoryListItem = {
  setMenuMode: React.Dispatch<React.SetStateAction<MenuOption>>;
  closeOuterMenu: () => void;
  mobileMenu: boolean;
};

export default function ShopByCategoryListItem({
  setMenuMode,
  closeOuterMenu,
  mobileMenu,
}: ShopByCategoryListItem) {
  const localParent = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  // const [catState, setCatState] = useState<gsap.core.Timeline | null>(null);
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;
  // const catRef = useRef(null);

  useEffect(() => {
    setMenuHeight(
      Math.round(
        window.innerHeight -
          (localParent.current?.getBoundingClientRect().top || 0)
      )
    );
  }, [window.innerHeight, localParent.current]);

  useLayoutEffect(() => {
    if (!localParent.current || !document.querySelector('.submenu-item'))
      return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({});

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

      // setCatState(tl);
    });

    return () => {
      ctx.revert();
    };
  }, [localParent.current, menuHeight]);

  function closeLocalMenu(fullClose: boolean = false) {
    // Close the submenu. If fullClose is true, also close the outer shop menu.

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

  // const subItem = document.querySelectorAll('.submenu-item');
  // const underline = document.querySelectorAll('.underline');

  // useEffect(() => {

  //   if(!subItem) return;

  //   subItem?.forEach((el) => {
  //     el?.addEventListener('mouseenter', (e) => {
  //       gsap.to(e.target, {
  //         // width: '100%',
  //         delay: .2,
  //         ease: 'slow.inOut',
  //         textDecoration: 'underline',
  //         duration: 1.3,
  //         // className: 'underline',
  //       })
  //     })

  //     el?.addEventListener('mouseleave', (e) => {
  //       gsap.to(e.target, {
  //         ease: 'slow.inOut',
  //         duration: .3,
  //         textDecoration: 'none',
  //       })
  //     })

  //     // gsap.to(underline, {
  //     // })
  //   })
  // }, [subItem])

  return (
    <div
      ref={localParent}
      onMouseLeave={() => closeLocalMenu()}
      className="group absolute left-0 top-[75%] z-10 flex h-0 w-screen flex-col flex-wrap font-thin"
    >
      {menuHeight > 0 && (
        <section
          // ref={catRef}
          className={` ${
            mobileMenu ? 'gap-x-3 px-3' : 'gap-x-[3vw] pl-12'
          } flex  h-screen  w-screen flex-col flex-wrap place-content-start justify-start  self-center overflow-hidden  bg-[#fbfbfb]  py-[2%] text-[min(2vw,_3vh)] leading-tight `}
        >
          {tagList.map((tag) => {
            const name = tag.tagName;
            return (
              <Link
                key={tag._id}
                to={`/shop-all?filter=${name}`}
                onClick={() => {
                  closeLocalMenu(true);
                }}
                // state={{ filterKey: name }}
                className={` ${
                  mobileMenu
                    ? 'text-start text-[1.4rem]'
                    : ' text-center tracking-widest odd:text-[min(3.5vw,_5.5vh)] even:tracking-[.3rem]'
                } submenu-item ease hover:offsetX  text-primary-gray hover:scale-105 hover:underline hover:underline-offset-4 hover:duration-300`}
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
