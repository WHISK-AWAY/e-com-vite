import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import starFilled from '../../src/assets/icons/star-filled.svg';
import starBlank from '../../src/assets/icons/star-blanc.svg';
import starHalf from '../../src/assets/icons/star-half.svg';

dayjs.extend(relativeTime);

export type StarsBarProps = {
  score: number;
  reviewCount?: number;
  date?: string;
  option?: 'count' | 'date';
};

export default function StarsBar({
  score,
  reviewCount = 0,
  option = 'count',
  date = Date(),
}: StarsBarProps) {
  const filledStars = Math.floor(score);
  const halfStars = Math.ceil(score) - Math.floor(score);
  const emptyStars = 5 - filledStars - halfStars;

  return (
      <div className="relative mb-10 flex w-fit flex-col">
          <div className="star-container flex flex-row">
              {Array(Math.floor(filledStars))
                  .fill(true)
                  .map((_, idx) => (
                      <img
                          key={idx}
                          src={starFilled}
                          className="aspect-square h-2 lg:h-3 xl:h-4 portrait:h-4 portrait:lg:h-5"
                      />
                  ))}
              {Array(halfStars)
                  .fill(true)
                  .map((_, idx) => (
                      <img
                          key={idx}
                          src={starHalf}
                          className="aspect-square h-2 lg:h-3 xl:h-4 portrait:h-4 portrait:lg:h-5"
                      />
                  ))}
              {Array(emptyStars)
                  .fill(true)
                  .map((_, idx) => (
                      <img
                          key={idx}
                          src={starBlank}
                          className="aspect-square h-2 lg:h-3 xl:h-4 portrait:h-4 portrait:lg:h-5"
                      />
                  ))}
          </div>
          <h4
              className={
                  'absolute top-4 whitespace-nowrap font-grotesque text-xs leading-none lg:text-sm xl:text-base portrait:text-[.8rem] portrait:lg:text-lg' +
                  (option === 'count'
                      ? ' translate-x-[150%]'
                      : ' translate-x-full')
              }
          >
              {option === 'count' && `${score.toFixed(1)} (${reviewCount})`}
              {option === 'date' && dayjs().to(dayjs(date))}
          </h4>
      </div>
  );
}
