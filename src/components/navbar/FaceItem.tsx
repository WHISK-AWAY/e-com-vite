import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { selectTagState, fetchAllTags } from '../../redux/slices/tagSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

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
  'spf',
];

export default function FaceItem({
  setIsMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  const localParent = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    dispatch(fetchAllTags());
  }, []);

  useEffect(() => {
    setMenuHeight(
      Math.round(
        window.innerHeight -
          (localParent.current?.getBoundingClientRect().top || 0)
      )
    );
  }, []);

  const filteredTags = tagList.filter((tag) => faceitems.includes(tag.tagName));

  if (!filteredTags) return <p>...loading</p>;
  return (
    <section
      ref={localParent}
      className='absolute right-0 top-[65%] z-10 flex h-screen w-screen flex-col flex-wrap place-content-start gap-x-[3vw] border border-black bg-white py-[2%] pl-10 text-[2vw]'
      style={{
        height: menuHeight,
      }}
    >
      {filteredTags.map((tag) => {
        const name = tag.tagName;
        return (
          <Link
            to='/shop-all'
            state={{ filterKey: name }}
            className='hover:underline hover:underline-offset-2'
            onClick={() => {
              setIsMenuHidden((prev) => !prev);
            }}
            key={tag._id}
          >
            {name}
          </Link>
        );
      })}
    </section>
  );
}
