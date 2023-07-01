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
    <section className='admin-dashboard mx-auto flex min-h-[calc(100vh_-_64px)] w-4/5 flex-col gap-2 pt-20 font-grotesque text-[2vw]'>
      <h1 className='inline whitespace-nowrap border-b border-red-500 text-[4rem] font-semibold tracking-[1rem] text-charcoal after:-mr-[1rem]'>
        ADMIN DASHBOARD
      </h1>
      <div className='links-section flex flex-col items-start'>
        <Link to={'/admin/inventory'} className='w-fit hover:text-red-500'>
          INVENTORY
        </Link>
        <Link to={'/admin/product/new'} className='hover:text-red-500'>
          CREATE NEW PRODUCT
        </Link>
        {/* <Link to={'/admin/product/:productId'}>EDIT PRODUCT</Link> */}
        <Link to={'/admin/tags'} className='hover:text-red-500'>
          TAGS
        </Link>
        <Link to={'/admin/tags/new'} className='hover:text-red-500'>
          CREATE NEW TAG
        </Link>
        <Link to={'/admin/promos'} className='hover:text-red-500'>
          PROMOS
        </Link>
        <Link to={'/admin/promos/new'} className='hover:text-red-500'>
          CREATE NEW PROMO
        </Link>
        <Link to='/admin/users' className='hover:text-red-500'>
          USERS
        </Link>
        <Link to='/admin/reviews' className='hover:text-red-500'>
          REVIEWS
        </Link>
        <Link to='/admin/reports' className='hover:text-red-500'>
          REPORTS
        </Link>
      </div>
    </section>
  );
}
