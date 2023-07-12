import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  IReviewState,
  downvoteReview,
  upvoteReview,
  // deleteReview,
} from '../../redux/slices/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAuth } from '../../redux/slices/authSlice';
import StarsBar from '../StarsBar';
import thumb from '../../assets/icons/thumb.svg';
import thumbFilled from '../../assets/icons/thumbFilled.svg';
import ScoreBar from '../ScoreBar';

dayjs.extend(relativeTime);

export type ReviewProps = {
  review: IReviewState;
  last?: boolean;
};

export default function Review({ review, last = false }: ReviewProps) {
  const dispatch = useAppDispatch();
  const productId = review.product._id;
  const reviewId = review._id;
  const { userId } = useAppSelector(selectAuth);

  // const handleDelete = () => {
  //   if (userId && productId)
  //     dispatch(
  //       deleteReview({
  //         userId,
  //         productId,
  //         reviewId,
  //       })
  //     );
  // };

  return (
    <section
      className={`review-details flex w-full justify-center font-hubbali text-sm lg:text-lg lg:leading-5 ${
        last ? '' : 'border-b border-charcoal pb-4 lg:pb-6 xl:pb-8'
      }`}
    >
      <div className='review-left flex basis-2/5 flex-col justify-center gap-3 text-xs xl:text-base xl:leading-5'>
        <div className='monogram aspect-square w-fit rounded-full bg-charcoal p-3 text-center font-federo text-xl text-white lg:text-[1.5rem] xl:text-[2rem] 2xl:text-[2.25rem]'>
          {review.nickname![0].toUpperCase()}
        </div>
        <p className='font-grotesque text-sm font-semibold lg:text-base xl:text-xl 2xl:text-2xl'>
          {review.nickname}
        </p>
        <div className='review-user-info-group'>
          <p>{review.location ? review.location : ''}</p>
          <p>votes: {review.user.voteCount}</p>
          <p>reviews: {review.user.reviewCount}</p>
        </div>
        <p className='lowercase'>
          skin concerns:{' '}
          {review.skinConcernOptions?.length > 0
            ? review.skinConcernOptions
                .map((concern) => concern.label)
                .join(', ')
            : '(none provided)'}
        </p>
      </div>
      <div className='review-right flex basis-3/5 flex-col items-center gap-7 xl:gap-10'>
        <div className='individual-review-scores flex w-full justify-between'>
          <div className='review-stars'>
            <StarsBar
              score={review.rating.overall}
              option='date'
              date={review.date}
            />
          </div>
          <div className='review-bars flex flex-col items-start gap-2 font-hubbali text-xs xl:text-base'>
            <div className='quality-score flex flex-col items-start'>
              <p>QUALITY</p>
              <ScoreBar score={review.rating.quality} />
            </div>
            <div className='value-score flex flex-col items-start'>
              <p>VALUE</p>
              <ScoreBar score={review.rating.value} />
            </div>
            {review.verifiedPurchase && (
              <div className='value-score flex flex-col items-start'>
                <p className='self-end font-semibold italic'>
                  *verified purchase
                </p>
              </div>
            )}
          </div>
        </div>
        <h3 className='review-title font-federo text-lg uppercase lg:text-[1.5rem] xl:text-[1.75rem] 2xl:text-[2rem]'>
          {review.title}
        </h3>
        <div className='review-content 2xl:text-xl 2xl:leading-5'>
          {review.content +
            (review.content.length < 100
              ? ' This hydrating antioxidant formula instantly illuminates the complexion with bright radiance, while phytosterols help to reduce the signs of skin sensitivity. Saccharide Isomerate extract diminishes the appearance of pores and reinforces the skin’s moisture barrier for a skin-smoothing glow. Rapidly brighten the appearance of the skin and boost vital skin bounce, in a flash!'
              : '')}
        </div>
        <div className='review-buttons flex self-end'>
          {userId && (
            <div className='vote-section flex justify-end gap-2'>
              <h3>helpful?</h3>
              <button
                onClick={() => dispatch(upvoteReview({ productId, reviewId }))}
              >
                <img
                  src={review.userVote === 'upvote' ? thumbFilled : thumb}
                  className='w-5'
                  alt='thumbs up'
                  title={`${review.upvote} ${
                    review.upvote === 1 ? 'person has' : 'people have'
                  } found this helpful`}
                />
              </button>
              <br />
              <button
                onClick={() =>
                  dispatch(downvoteReview({ productId, reviewId }))
                }
              >
                <img
                  src={review.userVote === 'downvote' ? thumbFilled : thumb}
                  className='w-5 rotate-180'
                  alt='thumbs down'
                  title={`${review.downvote} ${
                    review.downvote === 1 ? 'person has' : 'people have'
                  } found this unhelpful`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

{
  /*}
<div className='review-wrapper'>
<div className='rating-section'>
  {userId === review.user._id && (
    <button onClick={handleDelete}>delete</button>
  )}
  overall: {review.rating.overall}
  <br />
  quality: {review.rating.quality}
  <br />
  value: {review.rating.value}
  <br />
</div>

<div className='review-content'>
  {review.title}
  <br />
  {review.content}
  <br />
  {new Date(review.date).toLocaleDateString()}
  <br />
</div>
<div className='review-user-details'>
  skin concerns:{' '}
  {review.skinConcernOptions.map((option, idx) => {
    return <p key={idx}>{option.label}</p>;
  })}
  <br />
  {review.verifiedPurchase ? review.verifiedPurchase : ''}
  <br />
  {review.user.voteCount > 1 ? (
    <p>votes: {review.user.voteCount}</p>
  ) : (
    <p>vote: {review.user.voteCount}</p>
  )}
  {review.user.reviewCount > 1 ? (
    <p>reviews: {review.user.reviewCount}</p>
  ) : (
    <p>review: {review.user.reviewCount}</p>
  )}
</div>
</div> */
}
