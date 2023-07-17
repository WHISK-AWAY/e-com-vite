import ShopByCategoryListItem from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import x from '../../assets/icons/whiteX.svg';
import chevronRight from '../../assets/icons/whiteArrow.svg';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { gsap } from 'gsap';

const menuOptions = ['category', 'face', 'body', 'none'] as const;
export type MenuOption = (typeof menuOptions)[number] | null;

export default function DropdownMenu({
  setIsMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  const [menuMode, setMenuMode] = useState<MenuOption>('none');
  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
  let menuWrapper = useRef(null);

  useLayoutEffect(() => {
    // Animate overall menu text reveal
    if (!menuWrapper?.current || !document.querySelector('.text-reveal'))
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.set('.x-icon', {
        opacity: 0,
      });

      tl.set(menuWrapper.current, {
        overflow: 'hidden',
        left: 0,
        height: 0,
        transformOrigin: 'left',
      });
      tl.from(menuWrapper.current, {
        backgroundColor: 'white',
        duration: 0.2,
        // width: 0,
        opacity: 0,
      });

      tl.to(menuWrapper.current, {
        height: '100vh',
        ease: 'expo.inOut',
        duration: 1.5,
        overflow: 'hidden',
        display: 'flex',
      });

      tl.from(
        '.text-reveal',
        {
          duration: 0.7,
          overflow: 'hidden',
          ease: 'power1.inOut',
          height: 0,
          stagger: 0.05,
          // opacity: .7,
        },
        'menuWrapper.current-=.5'
      ).to('.text-reveal>img', { duration: 0.4, opacity: 1, ease: 'power4' });

      const items = document.querySelectorAll('.text-reveal');

      items.forEach((el) => {
        // console.log('el', el)
        el?.addEventListener('mouseenter', (e) => {
          gsap.to(e.target, {
            ease: 'back.out(1.7)',
            duration: 1,
            // text-shadow: '5px 5px #558abb',
            color: '#fff',
          });
        });

        el.addEventListener('mouseleave', (e) => {
          gsap.to(e.target, {
            ease: 'slow.inOut',
            duration: 1,
            delay: 0.1,
            color: 'transparent',
          });
        });
      });

      tl.to(
        '.x-icon',
        {
          opacity: 1,
        },
        '<'
      );

      menuAnimation.current = tl;
    }, menuWrapper.current);

    return () => {
      ctx.revert();
      menuAnimation.current = null;
    };
  }, [menuWrapper]);

  // Switch menu from one group to another, or else close menu on second click
  function toggleMenu(menu: MenuOption) {
    if (menuMode !== menu) {
      return setMenuMode(() => menu);
    } else {
      return setMenuMode(() => 'none');
    }
  }

  function closeMenu() {
    // Reverse opening animation at double speed & then close menu
    if (!menuAnimation.current) {
      setIsMenuHidden(true);
    } else {
      return menuAnimation.current
        .duration(menuAnimation.current.duration() / 1.5)
        .reverse()
        .then(() => {
          setIsMenuHidden(true);
        });
    }
  }

  //overflow scroll controll, prevents scroll down
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const textRevealClasses = ' text-reveal inline-block h-fit overflow-visible';

  // text-[#bbbcbee0
  return (
    <section
      ref={menuWrapper}
      className='menu-wrapper absolute right-0 top-0 z-40 flex w-screen flex-col bg-[#8e9282] font-antonio font-bold  uppercase text-[#bbbcbee0] 3xl:pt-[4%] '
    >
      {/* Logo section (absolute) */}
      <div className='logo-wrapper absolute right-1/2 top-0 z-10 flex h-16 translate-x-[50%] items-center justify-center'>
        <Link
          to='/'
          className='flex items-center gap-1 font-notable text-[min(2.5vw,_3vh)] text-white  3xl:text-[1.6vw]'
          onClick={closeMenu}
        >
          {/* <img src={dot} alt='dot-icon' className='h-[.5vw] 3xl:h-[.3vw]' /> */}
          ASTORIA
          {/* <img src={dot} alt='dot-icon' className='h-[.5vw] 3xl:h-[.3vw]' /> */}
        </Link>
      </div>

      {/* Close icon (absolute) */}
      <img
        src={x}
        alt='x-icon'
        className='x-icon absolute left-10 top-10 h-[min(2vw,_3vh)] cursor-pointer 3xl:left-[2.6vw] 3xl:top-[2.6vw]  3xl:h-[min(1.6vw,_3vh)]'
        onClick={closeMenu}
      />

      {/* Menu options */}
      <div className='menu-option-container txt-stroke my-auto flex flex-col text-[min(7vw,_12vh)] leading-[1] text-transparent 5xl:text-[min(6vw,_12vh)]'>
        <div className={'menu-option ml-[25%]'}>
          <button
            onClick={() =>
              closeMenu()?.then(() =>
                navigate('/shop-all', { state: { filterKey: 'all' } })
              )
            }
            className={textRevealClasses + ' uppercase'}
          >
            shop all
          </button>
        </div>
        <div className='menu-option relative pl-[15%]'>
          <div className='chevron-container relative w-fit'>
            <button
              className={'relative h-full uppercase ' + textRevealClasses}
              onClick={() => toggleMenu('category')}
            >
              shop by category
              <img
                src={chevronRight}
                alt='right arrow'
                className={`ease absolute right-0 top-1/2 h-[min(2.5vw,_3vh)] translate-x-[290%] translate-y-[-50%] transform  cursor-pointer opacity-0 transition-all duration-300 xl:h-[min(2vw,_3vh)] 3xl:h-[min(1.5vw,_3vh)] ${
                  menuMode === 'category'
                    ? 'ease rotate-90 transform transition-all duration-700'
                    : ''
                }`}
                // onMouseEnter={() => toggleMenu('category')}
              />
            </button>
          </div>

          {menuMode === 'category' && (
            <ShopByCategoryListItem
              setMenuMode={setMenuMode}
              closeOuterMenu={closeMenu}
            />
          )}
        </div>
        <div className='menu-option relative pl-[30%]'>
          <button
            onClick={() =>
              closeMenu()?.then(() =>
                navigate('/shop-all', { state: { filterKey: 'spf' } })
              )
            }
            className={textRevealClasses + ' uppercase'}
          >
            summer care
          </button>
        </div>
        <div className='menu-option relative pl-[30%]'>
          <div className='chevron-container'>
            <button
              className={'relative h-full uppercase' + textRevealClasses}
              onClick={(e) => {
                e.preventDefault();
                toggleMenu('face');
              }}
              // onMouseEnter={() => {
              //   toggleMenu('face');
              // }}
            >
              face
              <img
                src={chevronRight}
                alt='right arrow'
                className={`ease absolute right-0 top-1/2 h-[min(2.5vw,_3vh)] translate-x-[290%] translate-y-[-50%] transform cursor-pointer opacity-0 transition-all duration-300 xl:h-[min(2vw,_3vh)] 3xl:h-[min(1.5vw,_3vh)] ${
                  menuMode === 'face'
                    ? 'ease rotate-90 transform transition-all duration-700'
                    : ''
                }`}
              />
            </button>
          </div>
          {menuMode === 'face' && (
            <FaceItem setMenuMode={setMenuMode} closeOuterMenu={closeMenu} />
          )}
        </div>
        <div className='menu-option relative pl-[30%]'>
          <button
            className={'relative h-full uppercase' + textRevealClasses}
            // onMouseEnter={() => toggleMenu('body')}
            onClick={() => toggleMenu('body')}
          >
            body
            <img
              src={chevronRight}
              alt='right arrow'
              className={`ease absolute right-0 top-1/2 h-[min(2.5vw,_3vh)] origin-[50%_50%] translate-x-[290%] translate-y-[-50%] transform cursor-pointer opacity-0 transition-all duration-300 xl:h-[min(2vw,_3vh)] 3xl:h-[min(1.5vw,_3vh)] ${
                menuMode === 'body'
                  ? 'ease rotate-90 transform duration-700'
                  : ''
              }`}
            />
          </button>
          {menuMode === 'body' && (
            <BodyItem setMenuMode={setMenuMode} closeOuterMenu={closeMenu} />
          )}
        </div>
      </div>
    </section>
  );
}
