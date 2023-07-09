import ShopByCategoryListItem from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import x from '../../assets/icons/x.svg';
import chevronRight from '../../assets/icons/new.svg';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import dot from '../../assets/icons/dot.svg';

const menuOptions = ['category', 'face', 'body'] as const;
export type MenuOption = (typeof menuOptions)[number] | null;

export default function DropdownMenu({
  setIsMenuHidden,
  isMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuHidden: boolean;
}) {
  const [menuMode, setMenuMode] = useState<MenuOption>(null);
  // const catRef = useRef(null);
  const [isCatMenu, setIsCatMenu] = useState(false);
  const [isFaceMenu, setIsFaceMenu] = useState(false);
  const [isBodyMenu, setIsBodyMenu] = useState(false);

  // Switch menu from one group to another, or else close menu on second click
  function toggleMenu(menu: MenuOption) {
    if (menuMode === menu) {
      setMenuMode(null);
   
    }else {
      setMenuMode(menu)
      setIsCatMenu(true)
      setIsBodyMenu(true)
      setIsFaceMenu(true)
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

  //overflow scroll controll, prevents scroll down
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // ! debug logs
    console.log('isMenuHidden', isMenuHidden);
    console.log('menuMode', menuMode);
  }, [isMenuHidden, menuMode]);

  // const shevron = document.querySelector('.shevron')

  // console.log('shev', shevron);

  return (
    <section className='menu-wrapper absolute right-0 top-0 z-40 flex h-screen w-screen flex-col bg-white pt-[10%] font-antonio font-thin  uppercase text-[#262626] 3xl:pt-[7%] '>
      <div className='logo-wrapper absolute right-1/2 top-0 z-10 flex h-16 translate-x-[50%] items-center justify-center'>
        <Link
          to='/'
          className='flex items-center gap-1 font-chonburi text-[2.5vw] text-[#262626]  3xl:text-[1.6vw]'
          onClick={() => setIsMenuHidden(true)}
        >
          <img src={dot} alt='dot-icon' className='h-[.5vw] 3xl:h-[.3vw]' />
          ASTORIA
          <img src={dot} alt='dot-icon' className='h-[.5vw] 3xl:h-[.3vw]' />
        </Link>
      </div>
      <div className='flex min-h-full w-full flex-col overflow-hidden pt-7'>
        <img
          src={x}
          alt='x-icon'
          className='absolute left-10 top-10 h-[2vw] 3xl:left-[2.6vw] 3xl:top-[2.6vw]  3xl:h-[1.6vw]'
          onClick={() => setIsMenuHidden(true)}
        />

        <div className='flex flex-col text-[7vw] leading-[1] 3xl:text-[7vw] 5xl:text-[6vw]'>
          <NavLink
            to={'/shop-all'}
            state={{ filterKey: 'all' }}
            onClick={() => setIsMenuHidden(true)}
            className='box ml-[25%] w-fit'
          >
            shop all
          </NavLink>
          <div className='relative flex w-full pl-[15%]'>
            <h2 className='relative'>
              shop by category
              {!isMenuHidden && (
                <img
                  src={chevronRight}
                  alt='right arrow'
                  className={`shevron ease absolute right-0 top-1/2 h-[3vw] translate-x-[290%] translate-y-[-50%] transform cursor-pointer transition-all duration-300 xl:h-[45%] 3xl:h-[2vw] ${
                    menuMode === 'category'
                      ? 'ease rotate-90 transform transition-all duration-300'
                      : ''
                  }`}
                  onMouseEnter={() => toggleMenu('category')}
                  onClick={() => toggleMenu('category')}
                />
              )}
            </h2>

            {menuMode === 'category' && (
              <ShopByCategoryListItem
                setIsMenuHidden={setIsMenuHidden}
                menuMode={menuMode}
                setMenuMode={setMenuMode}
              />
            )}
          </div>
          <div className='named-cat-wrapper pl-[30vw]'>
            <NavLink
              to={'/shop-all'}
              state={{ filterKey: 'spf' }}
              onClick={() => setIsMenuHidden(true)}
              className=''
            >
              summer care
            </NavLink>

            <div className='relative flex'>
              <h2 className='relative h-full'>
                face
                {!isMenuHidden && (
                  <img
                    src={chevronRight}
                    alt='right arrow'
                    className={`ease absolute right-0 top-1/2 h-[3vw] translate-x-[290%] translate-y-[-50%] transform cursor-pointer transition-all duration-300 xl:h-[45%] 3xl:h-[2vw] ${
                      menuMode === 'face'
                        ? 'ease rotate-90 transform transition-all duration-300'
                        : ''
                    }`}
                    onMouseEnter={() => {
                      toggleMenu('face');
                      setIsFaceMenu(true);
                    }}
                    onClick={() => {
                      toggleMenu('face');
                      setIsFaceMenu(true);
                    }}
                  />
                )}
              </h2>
              {/* <div className='temp-div' onClick={() => setIsFaceHidden(true)}> */}
              {/* this div is just here so we can click off of the face menu until something better gets figured out */}
              {menuMode === 'face' && (
                <FaceItem
                  setIsMenuHidden={setIsMenuHidden}
                  menuMode={menuMode}
                  setMenuMode={setMenuMode}
                />
              )}
              {/* </div> */}
            </div>

            <div className='relative flex w-full '>
              <h3 className='relative h-full w-fit'>
                body
                {!isMenuHidden && (
                  <img
                    src={chevronRight}
                    alt='right arrow'
                    className={`ease absolute right-0 top-1/2 h-[3vw] translate-x-[220%] translate-y-[-50%]  transform cursor-pointer transition-all duration-300 xl:h-[45%] 3xl:h-[2vw] ${
                      menuMode === 'body'
                        ? 'ease rotate-90 transform transition-all duration-300'
                        : ''
                    }`}
                    onMouseEnter={() => toggleMenu('body')}
                    onClick={() => toggleMenu('body')}
                  />
                )}
              </h3>
              {menuMode === 'body' && (
                <BodyItem
                  setIsMenuHidden={setIsMenuHidden}
                  menuMode={menuMode}
                  setMenuMode={setMenuMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
