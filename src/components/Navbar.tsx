import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import {
  getUserId,
  requestLogout,
  selectAuth,
} from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import {
  fetchSingleUser,
  resetUserState,
  selectSingleUser,
} from '../redux/slices/userSlice';
import { searchProducts } from '../redux/slices/allProductSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId, error: authError } = useAppSelector(selectAuth);
  const {
    user: { firstName },
  } = useAppSelector(selectSingleUser);
  const auth = useAppSelector(selectAuth); 

  useEffect(() => {
    if (!userId && !authError) dispatch(getUserId());

    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(getUserId());
    dispatch(searchProducts());
  }, []);

  function signOut() {
    dispatch(requestLogout());
    // dispatch(resetUserState())
    navigate('/');
  }

  const handleSearch = (e:any) => {
    e.preventDefault();


  };


  return (
    <nav className='navbar-container flex justify-end gap-4'>
      {firstName && <p>{`HELLO ${firstName.toUpperCase()}`}</p>}
      <NavLink to={'/shop-all'}>SHOP</NavLink>

      {/* <NavLink to="/shop-all/bestsellers">BESTSELLERS</NavLink>/ */}
      {/* <button
        onClick={() => {
          navigate('/shop-all/bestsellers', {
            state: { sortKey: 'saleCount' },
          });
        }}
      >
        BESTSELLERS
      </button> */}
      <NavLink to='/shop-all/bestsellers' state={{ sortKey: 'saleCount' }}>
        BESTSELLERS
      </NavLink>
      {userId && <NavLink to={`/user/${userId}`}>ACCOUNT</NavLink>}
      <NavLink to={`/user/${userId}/cart`}>CART</NavLink>
      <NavLink to={`/user/${userId}/favorites`}>FAVORITES</NavLink>
      {!userId && <NavLink to={`/sign-in`}>SIGN IN</NavLink>}
      {userId && <button onClick={signOut}>SIGN OUT</button>}

      <form>
        <input type='text' id='search' placeholder='search...'></input>
        <button onClick={(e) => handleSearch(e)}>search</button>
      </form>
    </nav>
  );
}
