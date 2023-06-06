import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectSingleUser } from '../../redux/slices/userSlice';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { user } = useAppSelector(selectSingleUser);

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user]);

  return (
    <section className='admin-dashboard'>
      <h1>ADMIN DASHBOARD</h1>
      <br />
      <section className='inventory-section'>
        <h1>INVENTORY</h1>
      </section>
      <section className='tag-section'>
        <h1>TAGS</h1>
      </section>
      <section className='user-section'>
        <h1>USERS</h1>
      </section>
      <section className='review-section'>
        <Link to='/admin/reviews'>
          <h2>REVIEWS</h2>
        </Link>
      </section>
      <section className='reporting-section'>
        <Link to='/admin/reports'>
          <h2>REPORTS</h2>
        </Link>
      </section>
    </section>
  );
}
