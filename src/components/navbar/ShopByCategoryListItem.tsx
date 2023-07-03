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
     <div className='group absolute right-0 top-[37%] z-40 w-[100vw] flex flex-col'>

    <section className='bg-white text-[2vw] flex flex-col gap-[1%] self-center w-full h-screen ml-10'>
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
