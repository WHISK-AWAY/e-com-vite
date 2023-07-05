import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectTagState } from '../../redux/slices/tagSlice';
import { Link } from 'react-router-dom';

export default function ShopByCategoryListItem({
  setIsMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const localParent = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  useEffect(() => {
    setMenuHeight(
      Math.round(
        window.innerHeight -
          (localParent.current?.getBoundingClientRect().top || 0)
      )
    );
  }, [window.innerHeight, localParent.current]);

  return (
    <div
      ref={localParent}
      className='group absolute left-0 top-[65%] z-10 flex w-screen flex-col flex-wrap'
      style={{ height: menuHeight }}
    >
      {menuHeight > 0 && (
        <section className='flex w-screen flex-col flex-wrap place-content-start justify-start gap-x-[3vw] self-center overflow-hidden border border-black bg-white py-[2%] pl-12 text-[2vw] leading-tight'>
          {tagList.map((tag) => {
            const name = tag.tagName;
            return (
              <Link
                key={tag._id}
                to='/shop-all'
                onClick={() => setIsMenuHidden((prev) => !prev)}
                state={{ filterKey: name }}
                className='hover:underline hover:underline-offset-2'
              >
                {name}
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
