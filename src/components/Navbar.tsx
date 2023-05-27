import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  getUserId,
  requestLogout,
  selectAuth,
} from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { fetchSingleUser } from '../redux/slices/userSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId, error: authError } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!userId && !authError) dispatch(getUserId());

    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  function signOut() {
    dispatch(requestLogout());
  }

  return (
    <nav className="navbar-container flex justify-end gap-4">
      <Link to={'/shop-all'}>SHOP</Link>

      {/* <Link to="/shop-all/bestsellers">BESTSELLERS</Link> */}
      <button
        onClick={() => {
          navigate('/shop-all/bestsellers', {
            state: { sortKey: 'saleCount' },
          });
        }}
      >
        BESTSELLERS
      </button>
      <Link to={`/user/${userId}`}>ACCOUNT</Link>
      <Link to={`/sign-in`}>SIGN IN</Link>
      <button onClick={signOut}>SIGN OUT</button>
      <Link to={`/user/${userId}/cart`}>CART</Link>
      <Link to={`/user/${userId}/favorites`}>FAVORITES</Link>
    </nav>
  );
}
