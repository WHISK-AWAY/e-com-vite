import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { selectTagState } from '../../redux/slices/tagSlice';
import { useAppSelector } from '../../redux/hooks';

const bodyitems = ['moisturizers', 'creams', 'spf'] as const;

export default function BodyItem({
  setIsMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  const [menuHeight, setMenuHeight] = useState(0);
  const localParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localParent.current) {
      setMenuHeight(
        Math.round(
          window.innerHeight -
            (localParent.current?.getBoundingClientRect().top || 0)
        )
      );
    }
  }, [window.innerHeight, localParent.current]);

  const filteredTags = tagList.filter((tag) =>
    bodyitems.includes(tag.tagName as (typeof bodyitems)[number])
  );
  return (
    <section
      ref={localParent}
      style={{
        height: menuHeight,
      }}
      className='absolute right-0 top-[65%] flex h-screen w-screen flex-col flex-wrap place-content-start gap-x-[3vw] border border-black bg-white py-[2%] pl-10 text-[2vw] '
    >
      {filteredTags.map((tag) => {
        const name = tag.tagName;

        return (
          <Link
            to='/shop-all'
            onClick={() => setIsMenuHidden(true)}
            state={{ filterKey: name }}
            className='hover:underline hover:underline-offset-2'
            key={tag._id}
          >
            {name}
          </Link>
        );
      })}
    </section>
  );
}
