import {
  IReviewState,
  downvoteReview,
  upvoteReview,
} from '../redux/slices/reviewSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export default function Review({ review }: { review: IReviewState }) {
  const dispatch = useAppDispatch();
  const productId = review.product._id;
  const reviewId = review._id;

  return (
    <section className='review-details'>
      <div className='review-wrapper'>
        <div className='rating-section'>
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
          {review.nickname}
          <br />
          {review.location ? review.location : ''}
          <br />
          skin concerns: {review.user.skinConcernOptions?.label}
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
        <div className='vote-section'>
          <h3>Helpful?</h3>
          <button
            onClick={() => dispatch(upvoteReview({ productId, reviewId }))}
          >
            {' '}
            yes: {review.upvote}
          </button>
          <br />
          <button
            onClick={() => dispatch(downvoteReview({ productId, reviewId }))}
          >
            {' '}
            no: {review.downvote}
          </button>
        </div>
      </div>
    </section>
  );
}
