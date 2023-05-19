import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { requestLogout } from '../redux/slices/authSlice';

export default function Homepage() {
  const dispatch = useAppDispatch();
  function logOut() {
    dispatch(requestLogout());
  }
  return (
    <div>
      <h1>this is homepage</h1>
      <ul>
        <li>
          <button onClick={logOut}>Log Out</button>
        </li>
        <li>
          <Link to="/sign-in" className="text-green-400">
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/sign-up" className="text-green-400">
            Sign Up
          </Link>
        </li>
        <li>
          <Link to="/shop-all" className="text-green-400">
            All Products
          </Link>
        </li>
      </ul>
    </div>
  );
}
