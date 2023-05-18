import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div>
      <h1>this is homepage</h1>
      <ul>
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
