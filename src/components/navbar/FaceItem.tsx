import { selectTagState } from '../../redux/slices/tagSlice';
import { useAppSelector } from '../../redux/hooks';
import { Link } from 'react-router-dom';

export default function FaceItem({
  setIsFaceHidden,
  setIsMenuHidden
}: {
  setIsFaceHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
    'spf'
  ];

  const filteredTags = tagList.filter((tag) => faceitems.includes(tag.tagName));
  return (
    <section className='absolute -bottom-[55%] right-0  flex h-screen w-full flex-col '>
      <ul className='z-20 h-screen w-screen bg-white pl-10 text-[2vw]'>
        {filteredTags.map((tag) => {
          const name = tag.tagName;

          return (
            <Link to='/shop-all' state={{ filterKey: name }} className=''>
              <li
                key={tag._id}
                className=''
                onClick={() => {setIsFaceHidden((prev) => !prev); setIsMenuHidden((prev) => !prev)}}
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
