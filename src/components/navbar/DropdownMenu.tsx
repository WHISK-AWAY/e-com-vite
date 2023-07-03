import ShopByCategoryListItems from './ShopByCategoryListItem';
import FaceItem from './FaceItem';
import BodyItem from './BodyItem';
import { Link } from 'react-router-dom';
import x from '../../assets/icons/x.svg';
import shevronRight from '../../assets/icons/new.svg'
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
}) 
{
  const [isCategoryHidden, setIsCategoryHidden] = useState(true)



  return (
    <div className='group absolute right-0 top-3 z-30'>
      <section className='menu-wrapper flex h-screen  w-[100vw] flex-col justify-around overflow-hidden bg-white font-antonio text-[9vw] font-thin uppercase text-[#262626] '>
        <img
          src={x}
          alt='x-icon'
          className='absolute left-10 top-10 h-[5%]'
          onClick={() => setIsMenuHidden(true)}
        />


        <ul className='flex flex-col gap-[10vw]'>
          <NavLink to={'/shop-all'} onClick={() => setIsMenuHidden(true)}>
            <li className='translate-x-[25%]'>shop all</li>
          </NavLink>

          <div className='flex'>
            <li className='relative translate-x-[35%] '>shop by category</li>

            {!isMenuHidden && (
              <img
                src={shevronRight}
                alt='right arrow'
                className={
                  !isCategoryHidden
                    ? `  translate-y-[720%]} absolute right-1/2 top-0  h-[5%] translate-x-[1950%] translate-y-[650%] rotate-90`
                    : `  translate-y-[720%]} absolute right-1/2  top-0 h-[5%] translate-x-[1950%] translate-y-[650%]`
                }
                onMouseEnter={() => setIsCategoryHidden((prev) => !prev)}
                onClick={() => setIsCategoryHidden((prev) => !prev)}
              />
            )}
          </div>


          {!isCategoryHidden && (
            <ShopByCategoryListItems setIsMenuHidden={setIsMenuHidden} />
          )}
          <li className='translate-x-[30%]'>summer care</li>
          <li className='translate-x-[30%]'>face</li>
          {/* <FaceItem /> */}
          <li className='translate-x-[30%]'>body</li>
          {/* <BodyItem /> */}
        </ul>
      </section>
    </div>
  );
}
