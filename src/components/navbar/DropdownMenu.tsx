import ShopByCategoryListItems from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import { Link } from 'react-router-dom';
import x from '../../assets/icons/x.svg';
import shevronRight from '../../assets/icons/new.svg';
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
  const [isBodyHidden, setIsBodyHidden] = useState(true)


    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, []);

  return (
    <section className='menu-wrapper absolute right-0 top-0 z-30 flex  h-[150vw] w-[100vw] flex-col  bg-white pt-[10%] font-antonio font-thin  uppercase text-[#262626] min-[1600px]:pt-[7%] '>
      <div className='flex min-h-full w-full flex-col overflow-hidden pt-7 min-[1600px]:pt-[1.8vw]'>
        <img
          src={x}
          alt='x-icon'
          className='absolute left-10 top-10 h-[2vw] min-[1600px]:left-[2.6vw] min-[1600px]:top-[2.6vw]  min-[1600px]:h-[1.6vw]'
          onClick={() => setIsMenuHidden(true)}
        />

        <div className='flex flex-col leading-[1] text-[7vw] min-[1600px]:text-[7vw]'>
          <NavLink
            to={'/shop-all'}
            onClick={() => setIsMenuHidden(true)}
            className=''
          >
            <p className=' translate-x-[25%]'>shop all</p>
          </NavLink>
          <div className=' relative flex w-full '>
            <h2 className=' h-full translate-x-[35%]'>shop by category</h2>

            {!isMenuHidden && (
              <img
                src={shevronRight}
                alt='right arrow'
                className={
                  !isCategoryHidden
                    ? `  absolute right-1/2 top-4 z-[90] h-[3vw] translate-x-[1200%] rotate-90 xl:h-[45%] xl:translate-x-[1000%]  min-[1538px]:h-[2vw] min-[1538px]:translate-x-[400%]`
                    : `  absolute right-1/2 top-4 z-[90]  h-[3vw] translate-x-[1200%] xl:h-[45%] xl:translate-x-[1000%] min-[1538px]:h-[2vw] min-[1538px]:translate-x-[400%]`
                }
                onMouseEnter={() => setIsCategoryHidden((prev) => !prev)}
                onClick={() => setIsCategoryHidden((prev) => !prev)}
              />
            )}
          </div>
          {!isCategoryHidden && (
            <ShopByCategoryListItems setIsMenuHidden={setIsMenuHidden} />
          )}

          <NavLink
            to={'/shop-all'}
            state={{ filterKey: 'spf' }}
            onClick={() => setIsMenuHidden(true)}
            className=''
          >
            <p className=' translate-x-[30%]'>summer care</p>
          </NavLink>

          {/* <span className='translate-x-[30%]'>summer care</span> */}
          <div className=' relative flex w-full '>
            <span className=' h-full w-full translate-x-[30%]'>face</span>
            {!isMenuHidden && (
              <img
                src={shevronRight}
                alt='right arrow'
                className={
                  !isFaceHidden
                    ? `  absolute right-1/2 top-0  h-full  -translate-x-[300%] rotate-90 xl:h-[120%] min-[1538px]:h-[2vw] min-[1538px]:-translate-x-[500%]`
                    : `  absolute right-1/2 top-0  h-full  -translate-x-[300%] xl:h-[120%] min-[1538px]:h-[2vw] min-[1538px]:-translate-x-[500%] `
                }
                onMouseEnter={() => setIsFaceHidden((prev) => !prev)}
                onClick={() => setIsFaceHidden((prev) => !prev)}
              />
            )}
          </div>
          {!isMenuHidden && !isFaceHidden && (
            <FaceItem
              setIsMenuHidden={setIsMenuHidden}
              setIsFaceHidden={setIsFaceHidden}
            />
          )}

          <div className='relative flex w-full '>
            <span className='h-full w-full translate-x-[30%]'>body</span>
            {!isMenuHidden && (
              <img
                src={shevronRight}
                alt='right arrow'
                className={
                  !isBodyHidden
                    ? `  absolute right-1/2 top-0  h-full  -translate-x-[300%] rotate-90 xl:h-[120%] min-[1538px]:h-[2vw] min-[1538px]:-translate-x-[500%]`
                    : `  absolute right-1/2 top-0   h-full -translate-x-[300%] xl:h-[120%] min-[1538px]:h-[2vw] min-[1538px]:-translate-x-[500%]`
                }
                onMouseEnter={() => setIsBodyHidden((prev) => !prev)}
                onClick={() => setIsBodyHidden((prev) => !prev)}
              />
            )}
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
