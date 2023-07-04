import { selectTagState, fetchAllTags } from '../../redux/slices/tagSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function FaceItem({
  setIsFaceHidden,
  setIsMenuHidden
}: {
  setIsFaceHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch()
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  useEffect(() => {
    dispatch(fetchAllTags())
  }, [])


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
    'spf'
  ];

  const filteredTags = tagList.filter((tag) => faceitems.includes(tag.tagName));

  if (!filteredTags) return <p>...loading</p>
  return (
    <section className='absolute -bottom-[54%] right-0 flex h-screen  w-full flex-col lg:-bottom-[56%] xl:-bottom-[52%] 2xl:-bottom-[50%]   min-[1538px]:-bottom-0'>
      <ul className='z-20 h-screen w-screen border border-black bg-white py-[2%] pl-10 text-[2vw] lg:leading-none min-[1536px]:bg-red-200 min-[1536px]:text-[1.3vw] '>
        {filteredTags.map((tag) => {
          const name = tag.tagName;

          return (
            <Link
              to='/shop-all'
              state={{ filterKey: name }}
              className=''
              key={tag._id}
            >
              <li
                className='hover:underline hover:underline-offset-2'
                onClick={() => {
                  setIsFaceHidden((prev) => !prev);
                  setIsMenuHidden((prev) => !prev);
                }}
              >
                {name}
              </li>
            </Link>
          );
        })}
      </ul>
    </section>
  );
}
