import { selectTagState } from '../../redux/slices/tagSlice';
import { useAppSelector } from '../../redux/hooks';

export default function FaceItem({setIsFaceHidden}: {setIsFaceHidden: React.Dispatch<React.SetStateAction<boolean>>}) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;
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
  ];

    const filteredTags = tagList.filter((tag) =>
      faceitems.includes(tag.tagName)
    );
  return (
    <section className='absolute -bottom-[55%] right-0  flex h-screen w-full flex-col '>
      <ul className='z-20 h-screen w-screen bg-white pl-10 text-[2vw]'>
        {filteredTags.map((tag) => (
          <li
            key={tag._id}
            className=''
            onClick={() => setIsFaceHidden((prev) => !prev)}
          >
            {tag.tagName}
          </li>
        ))}
      </ul>
    </section>
  );
}
