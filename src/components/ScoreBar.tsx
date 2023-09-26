import barEndcapFilledLeft from '../../src/assets/icons/barEndcapFilledLeft.svg';
import barEndcapFilledRight from '../../src/assets/icons/barEndcapFilledRight.svg';
import barEndcapHalfLeft from '../../src/assets/icons/barEndcapHalfLeft.svg';
import barEndcapHalfRight from '../../src/assets/icons/barEndcapHalfRight.svg';
import barEndcapHollowLeft from '../../src/assets/icons/barEndcapHollowLeft.svg';
import barEndcapHollowRight from '../../src/assets/icons/barEndcapHollowRight.svg';
import barSectionFilled from '../../src/assets/icons/barSectionFilled.svg';
import barSectionHalf from '../../src/assets/icons/barSectionHalf.svg';
import barSectionHollow from '../../src/assets/icons/barSectionHollow.svg';

export type ScoreBarProps = {
  score: number;
  maxScore?: number;
};

export default function ScoreBar({ score, maxScore = 5 }: ScoreBarProps) {
  const BAR_STYLES = 'w-4 lg:w-5 xl:w-6 2xl:w-7';

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
    <div className="bar-container flex flex-nowrap justify-center">
      {filledFirstSection > 0 && (
        <img
          src={barEndcapFilledLeft}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}
      {halfFirstSection > 0 && (
        <img
          src={barEndcapHalfLeft}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}
      {hollowFirstSection > 0 && (
        <img
          src={barEndcapHollowLeft}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}

      {Array(filledMidsection)
        .fill(true)
        .map((_, idx) => (
          <img
            src={barSectionFilled}
            className={BAR_STYLES}
            key={idx}
            width="34"
            height="9"
            alt=""
          />
        ))}
      {halfMidsection > 0 && (
        <img
          src={barSectionHalf}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}
      {Array(hollowMidsection)
        .fill(true)
        .map((_, idx) => (
          <img
            src={barSectionHollow}
            className={BAR_STYLES}
            key={idx}
            width="34"
            height="9"
            alt=""
          />
        ))}

      {filledLastSection > 0 && (
        <img
          src={barEndcapFilledRight}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}
      {halfLastSection > 0 && (
        <img
          src={barEndcapHalfRight}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}
      {hollowLastSection > 0 && (
        <img
          src={barEndcapHollowRight}
          className={BAR_STYLES}
          width="34"
          height="9"
          alt=""
        />
      )}
    </div>
  );
}
