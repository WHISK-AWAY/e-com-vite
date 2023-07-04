import { useLayoutEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectTagState } from '../../redux/slices/tagSlice';

export default function ShopByCategoryListItem({
  setIsMenuHidden,
}: {
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  console.log(tagList);
  return (
     <div className='group absolute right-0 top-[30%] z-40 w-screen overflow-hidden flex flex-col'>

    <section className='bg-white text-[2vw] flex flex-col gap-[3%] self-center w-screen h-screen pl-10'>
      {tagList.map((tag) => {
        return (
          <ul key={tag._id}>
            <li className=''>{tag.tagName}</li>
          </ul>
        );
      })}
    </section>
      </div>
  );
}
