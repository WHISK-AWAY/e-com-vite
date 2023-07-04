import { useLayoutEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectTagState } from '../../redux/slices/tagSlice';
import { Link } from 'react-router-dom';

export default function ShopByCategoryListItem({
  setIsMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  console.log(tagList);
  return (
    <div className='group absolute right-0  top-[17%] z-40 flex w-screen flex-col  xl:top-[16%] 2xl:top-[11%] min-[1536px]:-top-[26%] min-[3440px]:top-[16%]'>
      <section className='flex h-full  w-screen flex-col self-center border border-black bg-white py-[2%] pl-12 text-[2vw] leading-tight min-[1536px]:text-[1.4vw] min-[2536px]:pl-[2.1vw] min-[2536px]:text-xl'>
        {tagList.map((tag) => {
          const name = tag.tagName;
          return (
            <ul key={tag._id}>
              <Link to='/shop-all' state={{ filterKey: name }} className=''>
                <li
                  className=' hover:underline hover:underline-offset-2'
                  onClick={() => setIsMenuHidden((prev) => !prev)}
                >
                  {name}
                </li>
              </Link>
            </ul>
          );
        })}
      </section>
    </div>
  );
}
