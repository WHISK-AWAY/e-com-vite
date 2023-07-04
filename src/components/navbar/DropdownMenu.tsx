import ShopByCategoryListItems from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import { Link } from 'react-router-dom';
import x from '../../assets/icons/x.svg';
import shevronRight from '../../assets/icons/new.svg';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

<Link
  to='/shop-all'
  state={{ filterKey: 'body' }}
  className='relative -translate-y-[250%] border border-white bg-transparent px-[6vw] py-[1.1vw] font-raleway text-[1vw] font-light text-white'
>
  shop body
</Link>;

export default function DropdownMenu({
  setIsMenuHidden,
  isMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuHidden: boolean;
}) {
  const [isCategoryHidden, setIsCategoryHidden] = useState(true);

  return (
    <section className='menu-wrapper absolute right-0 top-3 z-30 flex  h-screen w-[100vw] flex-col  bg-white pt-[12%] font-antonio  font-thin uppercase text-[#262626] '>
      <div className=' flex h-screen w-full flex-col bg-blue-100 '>
        <img
          src={x}
          alt='x-icon'
          className='absolute left-10 top-10 h-[2vw]'
          onClick={() => setIsMenuHidden(true)}
        />

        <div className='flex flex-col gap-[5vw] border border-green-700 text-[7vw]'>
          <NavLink
            to={'/shop-all'}
            onClick={() => setIsMenuHidden(true)}
            className=''
          >
            <p className='h-full translate-x-[25%]'>shop all</p>
          </NavLink>

          <div className=' relative flex w-full '>
            <h2 className=' h-full translate-x-[35%]  text-[7vw]'>
              shop by category
            </h2>

            {!isMenuHidden && (
              <img
                src={shevronRight}
                alt='right arrow'
                className={
                  !isCategoryHidden
                    ? `  absolute right-1/2 top-0 z-[90]  h-full translate-x-[1200%] rotate-90`
                    : `  absolute right-1/2 top-0 z-[90]  h-full translate-x-[1200%]`
                }
                onMouseEnter={() => setIsCategoryHidden((prev) => !prev)}
                onClick={() => setIsCategoryHidden((prev) => !prev)}
              />
            )}
          </div>

          {!isCategoryHidden && (
            <ShopByCategoryListItems setIsMenuHidden={setIsMenuHidden} />
          )}
          <span className='translate-x-[30%]'>summer care</span>
          <span className='translate-x-[30%]'>face</span>
          {/* <FaceItem /> */}
          <span className='translate-x-[30%]'>body</span>
          {/* <BodyItem /> */}
        </div>
      </div>
    </section>
  );
}
