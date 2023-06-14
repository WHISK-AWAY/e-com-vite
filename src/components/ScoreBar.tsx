import barEndcapFilled from '../../src/assets/icons/barEndcapFilled.svg';
import barEndcapHalfLeft from '../../src/assets/icons/barEndcapHalfLeft.svg';
import barEndcapHalfRight from '../../src/assets/icons/barEndcapHalfRight.svg';
import barEndcapHollow from '../../src/assets/icons/barEndcapHollow.svg';
import barSectionFilled from '../../src/assets/icons/barSectionFilled.svg';
import barSectionHalf from '../../src/assets/icons/barSectionHalf.svg';
import barSectionHollow from '../../src/assets/icons/barSectionHollow.svg';

export type ScoreBarProps = {
  score: number;
  maxScore?: number;
};

export default function ScoreBar({ score, maxScore = 5 }: ScoreBarProps) {
  const BAR_STYLES = 'w-3';

  let filledFirstSection = 0;
  let halfFirstSection = 0;
  let hollowFirstSection = 0;

  let filledMidsection = 0;
  let halfMidsection = 0;
  let hollowMidsection = 0;

  let filledLastSection = 0;
  let halfLastSection = 0;
  let hollowLastSection = 0;

  let remScore = score;

  if (remScore > 1) filledFirstSection = 1;
  else if (remScore > 0) halfFirstSection = 1;
  else hollowFirstSection = 1;

  remScore--;

  while (
    maxScore - 2 - filledMidsection - halfMidsection - hollowMidsection >
    0
  ) {
    if (remScore > 1) {
      filledMidsection++;
    } else if (remScore > 0) {
      halfMidsection++;
    } else {
      hollowMidsection++;
    }
    remScore--;
  }

  if (remScore === 1) filledLastSection = 1;
  else if (remScore > 0) halfLastSection = 1;
  else hollowLastSection = 1;

  return (
    <div className='bar-container flex justify-center'>
      {filledFirstSection > 0 && <img src={barEndcapFilled} />}
      {halfFirstSection > 0 && <img src={barEndcapHalfLeft} />}
      {hollowFirstSection > 0 && <img src={barEndcapHollow} />}

      {Array(filledMidsection)
        .fill(true)
        .map((_, idx) => (
          <img src={barSectionFilled} key={idx} />
        ))}
      {halfMidsection > 0 && <img src={barSectionHalf} />}
      {Array(hollowMidsection)
        .fill(true)
        .map((_, idx) => (
          <img src={barSectionHollow} key={idx} />
        ))}

      {filledLastSection > 0 && (
        <img src={barEndcapFilled} className='rotate-180' />
      )}
      {halfLastSection > 0 && <img src={barEndcapHalfRight} />}
      {hollowLastSection > 0 && (
        <img src={barEndcapHollow} className='rotate-180' />
      )}
    </div>
  );
}
