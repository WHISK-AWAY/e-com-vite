import { selectTagState } from "../../redux/slices/tagSlice";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";



export default function BodyItem({
  setIsBodyHidden,
  setIsMenuHidden,
}: {
  setIsBodyHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {


  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;
  const bodyitems = [
    'moisturizers',
    'creams',
    'spf',

  ];

  const filteredTags = tagList.filter((tag) => bodyitems.includes(tag.tagName));
  return (
    <section className=' absolute -bottom-[65%] right-0 flex h-screen w-full flex-col  lg:-bottom-[66%] xl:-bottom-[62%] 2xl:-bottom-[60%] min-[1536px]:top-[28%]'>
      <ul className='z-20 h-full w-screen border border-black bg-white py-[2%] pl-10 text-[2vw]'>
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
                  setIsBodyHidden((prev) => !prev);
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
