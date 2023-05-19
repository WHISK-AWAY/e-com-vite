import { Link } from 'react-router-dom';
import { getUserId, selectAuth } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!userId) dispatch(getUserId());
  }, []);

  return (
    <nav className='navbar-container flex justify-end gap-4'>
      <Link to={'/shop-all'}>SHOP</Link>
      
      <Link to='#'>BESTSELLERS</Link>
      <Link to={`/user/${userId}`}>ACCOUNT</Link>
      <Link to={`/user/${userId}/cart`}>CART</Link>
      <Link to={''}>FAVORITES</Link>
    </nav>
  );
}
