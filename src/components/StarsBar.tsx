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
  return (
    <div className='relative mb-10 flex w-fit flex-col'>
      <div className='star-container flex flex-row'>
        {Array(Math.floor(score))
          .fill(true)
          .map((_, idx) => (
            <img key={idx} src={starFilled} className='aspect-square h-3' />
          ))}
        {Array(Math.floor(5 - score))
          .fill(true)
          .map((_, idx) => (
            <img key={idx} src={starBlank} className='aspect-square h-3' />
          ))}
      </div>
      <h4 className='absolute top-4 translate-x-full font-grotesque text-sm'>
        {option === 'count' && `${score.toFixed(1)} (${reviewCount})`}
        {option === 'date' && dayjs().to(dayjs(date))}
      </h4>
    </div>
  );
}
