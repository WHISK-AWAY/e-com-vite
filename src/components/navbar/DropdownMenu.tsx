import ShopByCategoryListItem from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import x from '../../assets/icons/x.svg';
import chevronRight from '../../assets/icons/new.svg';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { gsap } from 'gsap';

import dot from '../../assets/icons/dot.svg';

const menuOptions = ['category', 'face', 'body', 'none'] as const;
export type MenuOption = (typeof menuOptions)[number] | null;

export default function DropdownMenu({
  setIsMenuHidden,
  isMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuHidden: boolean;
}) {
  const navigate = useNavigate();

  const [menuMode, setMenuMode] = useState<MenuOption>('none');
  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
  let menuWrapper = useRef(null);

  useLayoutEffect(() => {
    // Animate overall menu text reveal
    if (!menuWrapper?.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from('.text-reveal', {
        duration: 0.3,
        overflow: 'hidden',
        ease: 'power3',
        height: 0,
        stagger: 0.15,
        opacity: 0,
      }).to('.text-reveal>img', { duration: 0.1, opacity: 1 });

      menuAnimation.current = tl;
    }, menuWrapper.current);

    return () => {
      ctx.revert();
      menuAnimation.current = null;
    };
  }, [menuWrapper]);

  // Switch menu from one group to another, or else close menu on second click
  function toggleMenu(menu: MenuOption) {
    if (menuMode === menu) {
      setMenuMode('none');
    } else {
      setMenuMode(menu);
    }
    // } else if (menuMode === 'face') {
    //   setMenuMode('face');
    //   setIsFaceMenu(true);

    // } else if(menuMode === 'body') {

    //   setMenuMode('body');
    //   setIsBodyMenu(true);

    // } else {
    //   setMenuMode('category');
    //   setIsCatMenu(true);
    // }
  }

  function closeMenu() {
    // Reverse opening animation at double speed & then close menu
    if (!menuAnimation.current) {
      setIsMenuHidden(true);
    } else {
      return menuAnimation.current
        .duration(menuAnimation.current.duration() / 2)
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

  return (
    <section
      ref={menuWrapper}
      className='menu-wrapper absolute right-0 top-0 z-40 flex h-screen w-screen flex-col bg-white pt-[10%] font-antonio font-thin  uppercase text-[#262626] 3xl:pt-[7%] '
    >
      {/* Logo section (absolute) */}
      <div className='logo-wrapper absolute right-1/2 top-0 z-10 flex h-16 translate-x-[50%] items-center justify-center'>
        <Link
          to='/'
          className='flex items-center gap-1 font-chonburi text-[2.5vw] text-[#262626]  3xl:text-[1.6vw]'
          onClick={closeMenu}
        >
          <img src={dot} alt='dot-icon' className='h-[.5vw] 3xl:h-[.3vw]' />
          ASTORIA
          <img src={dot} alt='dot-icon' className='h-[.5vw] 3xl:h-[.3vw]' />
        </Link>
      </div>

      {/* Close icon (absolute) */}
      <img
        src={x}
        alt='x-icon'
        className='absolute left-10 top-10 h-[2vw] 3xl:left-[2.6vw] 3xl:top-[2.6vw]  3xl:h-[1.6vw]'
        onClick={closeMenu}
      />

      {/* Menu options */}
      <div className='menu-option-container flex flex-col text-[7vw] leading-[1] 3xl:text-[7vw] 5xl:text-[6vw]'>
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
                className={`ease absolute right-0 top-1/2 h-[3vw] translate-x-[290%] translate-y-[-50%] transform cursor-pointer opacity-0 transition-all duration-300 xl:h-[45%] 3xl:h-[2vw] ${
                  menuMode === 'category'
                    ? 'ease rotate-90 transform transition-all duration-300'
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
              onClick={() => {
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
                className={`ease absolute right-0 top-1/2 h-[3vw] translate-x-[290%] translate-y-[-50%] transform cursor-pointer opacity-0 transition-all duration-300 xl:h-[45%] 3xl:h-[2vw] ${
                  menuMode === 'face'
                    ? 'ease rotate-90 transform transition-all duration-300'
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
              className={`ease absolute right-0 top-1/2 h-[3vw] translate-x-[290%] translate-y-[-50%] transform cursor-pointer opacity-0 transition-all duration-300 xl:h-[45%] 3xl:h-[2vw] ${
                menuMode === 'body'
                  ? 'ease rotate-90 transform transition-all duration-300'
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
