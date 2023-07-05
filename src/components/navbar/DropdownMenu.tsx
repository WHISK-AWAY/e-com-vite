import ShopByCategoryListItem from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import x from '../../assets/icons/x.svg';
import chevronRight from '../../assets/icons/new.svg';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function DropdownMenu({
  setIsMenuHidden,
  isMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuHidden: boolean;
}) {
  const [isCategoryHidden, setIsCategoryHidden] = useState(true);
  const [isFaceHidden, setIsFaceHidden] = useState(true);
  const [isBodyHidden, setIsBodyHidden] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // ! debug logs
    console.log('isMenuHidden', isMenuHidden);
    console.log('isCategoryHidden', isCategoryHidden);
    console.log('isFaceHidden', isFaceHidden);
    console.log('isBodyHidden', isBodyHidden);
  }, [isMenuHidden, isCategoryHidden, isFaceHidden, isBodyHidden]);

  return (
    <section className='menu-wrapper absolute right-0 top-0 z-30 flex  h-[150vw] w-[100vw] flex-col  bg-white pt-[10%] font-antonio font-thin  uppercase text-[#262626] min-[1600px]:pt-[7%] '>
      <div className='flex min-h-full w-full flex-col overflow-hidden pt-7 min-[1600px]:pt-[1.8vw]'>
        <img
          src={x}
          alt='x-icon'
          className='absolute left-10 top-10 h-[2vw] min-[1600px]:left-[2.6vw] min-[1600px]:top-[2.6vw]  min-[1600px]:h-[1.6vw]'
          onClick={() => setIsMenuHidden(true)}
        />

        <div className='flex flex-col text-[7vw] leading-[1] min-[1600px]:text-[7vw]'>
          <NavLink
            to={'/shop-all'}
            onClick={() => setIsMenuHidden(true)}
            className=''
          >
            <h2 className='pl-[25%]'>shop all</h2>
          </NavLink>
          <div className='relative flex w-full'>
            <h2 className='relative h-full pl-[15%]'>
              shop by category
              {!isMenuHidden && (
                <img
                  src={chevronRight}
                  alt='right arrow'
                  className={`absolute right-0 top-1/2 h-[3vw] translate-x-[200%] translate-y-[-50%] xl:h-[45%] min-[1538px]:h-[2vw] ${
                    !isCategoryHidden ? 'rotate-90' : ''
                  }`}
                  // onMouseEnter={() => setIsCategoryHidden((prev) => !prev)}
                  onClick={() => setIsCategoryHidden((prev) => !prev)}
                />
              )}
            </h2>
            {!isCategoryHidden && (
              <ShopByCategoryListItem setIsMenuHidden={setIsMenuHidden} />
            )}
          </div>
          <div className='named-cat-wrapper pl-[30vw]'>
            <NavLink
              to={'/shop-all'}
              state={{ filterKey: 'spf' }}
              onClick={() => setIsMenuHidden(true)}
              className=''
            >
              <h3 className='w-fit'>summer care</h3>
            </NavLink>

            <div className='relative flex'>
              <h2 className='relative h-full'>
                face
                {!isMenuHidden && (
                  <img
                    src={chevronRight}
                    alt='right arrow'
                    className={`absolute right-0 top-1/2 h-[3vw] translate-x-[200%] translate-y-[-50%] xl:h-[45%] min-[1538px]:h-[2vw] ${
                      !isFaceHidden ? 'rotate-90' : ''
                    }`}
                    // onMouseEnter={() => setIsFaceHidden((prev) => !prev)}
                    onClick={() => setIsFaceHidden((prev) => !prev)}
                  />
                )}
              </h2>
              {/* <div className='temp-div' onClick={() => setIsFaceHidden(true)}> */}
              {/* this div is just here so we can click off of the face menu until something better gets figured out */}
              {!isFaceHidden && (
                <FaceItem
                  setIsMenuHidden={setIsMenuHidden}
                  setIsFaceHidden={setIsFaceHidden}
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
                    className={`absolute right-0 top-1/2 h-[3vw] translate-x-[200%] translate-y-[-50%] xl:h-[45%] min-[1538px]:h-[2vw] ${
                      !isBodyHidden ? 'rotate-90' : ''
                    }`}
                    onMouseEnter={() => setIsBodyHidden((prev) => !prev)}
                    onClick={() => setIsBodyHidden((prev) => !prev)}
                  />
                )}
              </h3>
            </div>
          </div>
          {!isMenuHidden && !isBodyHidden && (
            <BodyItem
              setIsMenuHidden={setIsMenuHidden}
              setIsBodyHidden={setIsBodyHidden}
            />
          )}
        </div>
      </div>
    </section>
  );
}
