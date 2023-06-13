import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import starFilled from '../../src/assets/icons/star-filled.svg';
import starBlank from '../../src/assets/icons/star-blanc.svg';
import { useEffect, useState } from 'react';

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
  // TODO: deal with half-stars
  return (
    <div className='relative mb-10 flex w-fit flex-col'>
      <div className='star-container flex flex-row'>
        {Array(Math.floor(filledStars))
          .fill(true)
          .map((_, idx) => (
            <img
              key={idx}
              src={starFilled}
              className='aspect-square h-2 lg:h-3 xl:h-4'
            />
          ))}
        {Array(halfStars + emptyStars)
          .fill(true)
          .map((_, idx) => (
            <img
              key={idx}
              src={starBlank}
              className='aspect-square h-2 lg:h-3 xl:h-4'
            />
          ))}
      </div>
      <h4
        className={
          'absolute top-4 font-grotesque text-xs lg:text-sm xl:text-base' +
          (option === 'count' ? ' translate-x-[150%]' : ' translate-x-full')
        }
      >
        {option === 'count' && `${score.toFixed(1)} (${reviewCount})`}
        {option === 'date' && dayjs().to(dayjs(date))}
      </h4>
    </div>
  );
}