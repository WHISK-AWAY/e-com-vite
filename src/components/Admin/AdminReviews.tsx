import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAllAdminReviews,
  deleteReview,
  selectAllAdminReviews,
} from '../../redux/slices/admin/reviewsAdminSlice';
import { selectSingleUser } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';

export default function AdminReviews() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const allReviews = useAppSelector(selectAllAdminReviews);

  const { user } = useAppSelector(selectSingleUser);

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchAllAdminReviews());
  }, []);

  function handleDeleteReview(reviewId: string) {
    dispatch(deleteReview({ reviewId: reviewId })).then(() =>
      dispatch(fetchAllAdminReviews())
    );
  }

  if (!allReviews) return <h1>Loading reviews...</h1>;
  if (allReviews.length === 0) return <h1>No reviews found...</h1>;
  return (
    <main className='reviews-admin'>
      <header>
        <h1>REVIEWS ADMINISTRATION</h1>
      </header>
      <section className='reviews-section'>
        <table className='text-center'>
          <thead>
            <tr>
              <th className='text-left'>PRODUCT</th>
              <th>NICKNAME</th>
              <th>TITLE</th>
              <th>CONTENT LENGTH</th>
              <th>UPVOTES</th>
              <th>DOWNVOTES</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {allReviews.map((review) => (
              <tr key={review._id}>
                <td>
                  <Link
                    className='text-left'
                    to={`/product/${review.product._id}`}
                  >
                    {review.product.productName}
                  </Link>
                </td>
                <td>{review.nickname}</td>
                <td>{review.title}</td>
                <td>{review.content.length}</td>
                <td>{review.upvote}</td>
                <td>{review.downvote}</td>
                <td>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className='text-red-500'
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
