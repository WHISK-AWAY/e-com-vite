import starFilled from '../assets/icons/star-filled.svg';

export type StarsProps = {
  score?: number;
};

export default function Stars({ score = 3 }: StarsProps) {
  return (
    <div className="star-section flex self-start pb-8">
      <img
        src={starFilled}
        className=" h-4"
        alt=""
      />
      <img
        src={starFilled}
        className="h-4"
        alt=""
      />
      <img
        src={starFilled}
        className="h-4"
        alt=""
      />
      <img
        src={starFilled}
        className="h-4"
        alt=""
      />
      <img
        src={starFilled}
        className="h-4"
        alt=""
      />
      <p className="pl-2 font-grotesque"> {score}</p>
    </div>
  );
}
