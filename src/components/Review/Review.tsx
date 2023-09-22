import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  IReviewState,
  downvoteReview,
  upvoteReview,
  deleteReview,
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
  mobileMenu: boolean
};

export default function Review({ review, mobileMenu }: ReviewProps) {
  const dispatch = useAppDispatch();
  const productId = review.product._id;
  const reviewId = review._id;
  const { userId } = useAppSelector(selectAuth);

  const handleDelete = () => {
    if (userId && productId)
      dispatch(
        deleteReview({
          userId,
          productId,
          reviewId,
        })
      );
  };

  return (
      <section
          className={` ${
              mobileMenu ? 'flex-col' : 'flex'
          } review-details  w-full justify-center border-b border-charcoal pb-4 font-grotesque text-sm last:border-b-0 last:pb-0 lg:pb-6 lg:text-lg lg:leading-5 xl:pb-8`}
      >
          <div className="review-left flex basis-2/5 flex-col justify-center gap-3 text-xs xl:text-base xl:leading-5 ">
              <div className="monogram aspect-square w-fit rounded-[100%] bg-charcoal p-3 text-center font-federo text-xl text-white lg:text-[1.5rem] xl:text-[2rem] 2xl:text-[2.25rem] portrait:md:text-[1.5rem]">
                  {review.nickname![0].toUpperCase()}
              </div>
              <p className="font-grotesque text-sm font-semibold lg:text-base xl:text-lg 2xl:text-xl portrait:text-[1.2rem] portrait:md:text-[1.4rem]">
                  {review.nickname}
              </p>
              <div className="review-user-info-group text-sm 2xl:text-base portrait:text-[1rem] portrait:md:text-[1.3rem]">
                  <p>{review.location ? review.location : ''}</p>
                  <p>votes: {review.user.voteCount}</p>
                  <p>reviews: {review.user.reviewCount}</p>
              </div>
              <p className="text-sm lowercase 2xl:text-base portrait:text-[1rem] portrait:md:text-[1.2rem]">
                  skin concerns:{' '}
                  {review.skinConcernOptions?.length > 0
                      ? review.skinConcernOptions
                            .map((concern) => concern.label)
                            .join(', ')
                      : '(none provided)'}
              </p>
          </div>
          <div className="review-right flex basis-3/5 flex-col items-center gap-7 xl:gap-10 portrait:md:pl-10">
              <div className="individual-review-scores flex w-full justify-between">
                  <div className="review-stars portrait:mt-16 ">
                      <StarsBar
                          score={review.rating.overall}
                          option="date"
                          date={review.date}
                      />
                  </div>
                  <div
                      className={` ${
                          mobileMenu ? 'pt-14' : ''
                      } review-bars flex flex-col items-end gap-2 font-grotesque text-xs xl:text-base`}
                  >
                      <div className="quality-score flex flex-col items-start gap-0">
                          <p>QUALITY</p>
                          <ScoreBar score={review.rating.quality} />
                      </div>
                      <div className="value-score flex flex-col items-start gap-0">
                          <p>VALUE</p>
                          <ScoreBar score={review.rating.value} />
                      </div>
                      {review.verifiedPurchase && (
                          <div className="value-score flex flex-col items-start">
                              <p className="self-end font-semibold italic">
                                  *verified purchase
                              </p>
                          </div>
                      )}
                  </div>
              </div>
              <h3 className="review-title font-raleway text-lg font-semibold uppercase lg:text-[1.3rem] 2xl:text-[1.5rem]">
                  {review.title}
              </h3>
              <div className="review-content font-grotesque text-sm xl:text-sm 2xl:text-base 2xl:leading-5 portrait:text-[1rem] portrait:md:text-[1.2rem]">
                  {review.content +
                      (review.content.length < 100
                          ? ' This hydrating antioxidant formula instantly illuminates the complexion with bright radiance, while phytosterols help to reduce the signs of skin sensitivity. Saccharide Isomerate extract diminishes the appearance of pores and reinforces the skin’s moisture barrier for a skin-smoothing glow. Rapidly brighten the appearance of the skin and boost vital skin bounce, in a flash!'
                          : '')}
              </div>
              <div className="review-buttons flex self-end">
                  {userId && (
                      <div className="vote-section flex justify-end gap-2">
                          <h3 className="text-sm">helpful?</h3>
                          <button
                              onClick={() =>
                                  dispatch(
                                      upvoteReview({ productId, reviewId })
                                  )
                              }
                          >
                              <img
                                  src={
                                      review.userVote === 'upvote'
                                          ? thumbFilled
                                          : thumb
                                  }
                                  className="w-5"
                                  alt="thumbs up"
                                  title={`${review.upvote} ${
                                      review.upvote === 1
                                          ? 'person has'
                                          : 'people have'
                                  } found this helpful`}
                              />
                          </button>
                          <br />
                          <button
                              onClick={() =>
                                  dispatch(
                                      downvoteReview({ productId, reviewId })
                                  )
                              }
                          >
                              <img
                                  src={
                                      review.userVote === 'downvote'
                                          ? thumbFilled
                                          : thumb
                                  }
                                  className="w-5 rotate-180"
                                  alt="thumbs down"
                                  title={`${review.downvote} ${
                                      review.downvote === 1
                                          ? 'person has'
                                          : 'people have'
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
