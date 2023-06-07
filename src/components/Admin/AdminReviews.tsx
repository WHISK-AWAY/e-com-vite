import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAllAdminReviews,
  deleteReview,
  selectAllAdminReviews,
  TAdminReview,
  sortReviews,
} from '../../redux/slices/admin/reviewsAdminSlice';
import { selectSingleUser } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import { TProduct } from '../../redux/slices/userSlice';

export type ReviewSortFields = {
  productName: string;
  productLongDesc: string;
  productShortDesc: string;
  brand: string;
  price: number;
  qty: number;
  imageURL: string;
  tags: string[];
  saleCount: number;
  title: string;
  content: string;
  date: Date;
  nickname: string;
  location: string;
  verifiedPurchase: boolean;
  upvote: number;
  downvote: number;
};

export default function AdminReviews() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [sortField, setSortField] =
    useState<keyof ReviewSortFields>('productName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const allReviews = useAppSelector(selectAllAdminReviews);

  const { user } = useAppSelector(selectSingleUser);

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchAllAdminReviews()).then(() =>
      dispatch(sortReviews({ sortField, sortDir }))
    );
  }, []);

  useEffect(() => {
    dispatch(sortReviews({ sortField, sortDir }));
  }, [sortField, sortDir]);

  function handleDeleteReview(reviewId: string) {
    dispatch(deleteReview({ reviewId: reviewId }));
  }

  function setSort(fieldName: typeof sortField) {
    // if field hasn't changed, flip sort order
    if (fieldName === sortField) {
      sortDir === 'asc' ? setSortDir('desc') : setSortDir('asc');
      return;
    }

    setSortField(fieldName);
    setSortDir('asc');
  }

  if (!allReviews) return <h1>Loading reviews...</h1>;
  if (allReviews.length === 0) return <h1>No reviews found...</h1>;
  return (
    <main className='reviews-admin'>
      <header>
        <h1>REVIEWS</h1>
      </header>
      <section className='reviews-section'>
        <table className='table-auto border-spacing-1 border-gray-500'>
          <thead>
            <tr>
              <th className='text-left'>
                <button onClick={() => setSort('productName')}>PRODUCT</button>
              </th>
              <th>
                <button onClick={() => setSort('nickname')}>NICKNAME</button>
              </th>
              <th>
                <button onClick={() => setSort('title')}>TITLE</button>
              </th>
              <th>
                <button onClick={() => setSort('content')}>
                  CONTENT
                  <br />
                  LENGTH
                </button>
              </th>
              <th>
                <button onClick={() => setSort('upvote')}>UPVOTES</button>
              </th>
              <th>
                <button onClick={() => setSort('downvote')}>DOWNVOTES</button>
              </th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {allReviews.map((review) => (
              <tr key={review._id}>
                <td className='text-left'>
                  <Link to={`/product/${review.product._id}`}>
                    {review.product.productName}
                  </Link>
                </td>
                <td>{review.nickname}</td>
                <td>{review.title}</td>
                <td className='text-center'>{review.content.length}</td>
                <td className='text-center'>{review.upvote}</td>
                <td className='text-center'>{review.downvote}</td>
                <td className='text-center'>
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
