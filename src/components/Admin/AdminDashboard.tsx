import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectSingleUser } from '../../redux/slices/userSlice';
import { useEffect } from 'react';
import Inventory from './products/Inventory';
import CreateOrEditProduct from './products/CreateOrEditProduct';

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
        <Link to={'/admin/inventory'}>INVENTORY</Link>
        <br />
        <Link to={'/admin/product/new'}>CREATE NEW PRODUCT</Link>
        {/* <Link to={'/admin/product/:productId'}>EDIT PRODUCT</Link> */}
      </section>
      <section className='tag-section'>
        <h1>TAGS</h1>
      </section>
      <section className='user-section'>
        <Link to='/admin/users'>
          <h1>USERS</h1>
        </Link>
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
