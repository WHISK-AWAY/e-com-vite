import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import {
  getUserId,
  requestLogout,
  selectAuth,
} from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import {
  fetchSingleUser,
  resetUserState,
  selectSingleUser,
} from '../redux/slices/userSlice';
import {
  searchProducts,
  selectSearchProducts,
} from '../redux/slices/allProductSlice';
import type { TSearch } from '../redux/slices/allProductSlice';
import { Product } from '../../server/database';
import Search from './Search';
import heart3 from '../../src/assets/icons/heart3.svg';
// import heart2 from '../../src/assets/icons/heart2.svg';
import cart from '../../src/assets/icons/cart.svg';
import cart3 from '../../src/assets/icons/cart3.svg';
import user from '../../src/assets/icons/user.svg';
import searchIcon from '../../src/assets/icons/search.svg';
// import { ReactSVG } from 'react-svg';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId, error: authError } = useAppSelector(selectAuth);
  const {
    user: { role },
  } = useAppSelector(selectSingleUser);
  const auth = useAppSelector(selectAuth);
  const catalogue = useAppSelector(selectSearchProducts);
  const [search, setSearch] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);

  const [searchResults, setSearchResults] = useState<TSearch>({
    products: [],
    tags: [],
  });

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
    dispatch(resetUserState());
    navigate('/');
  }

  // * this part doesn't really work all that well, but the navigates should
  // * at least be in the ball park of what we want
  function handleSelectSearchItem(args: {
    type: 'tag' | 'product';
    name?: string;
    id?: string;
  }) {
    if (args.type === 'tag') {
      navigate('/shop-all?page=1', { state: { filterKey: args.name } });
    } else {
      navigate('/product/' + args.id);
    }
  }

  // * on-change search handler more or less works -- not sure yet how exactly
  // * to render the results...needs to be a pop-up with the results listed below
  // * and linking to either the filtered shop-all page (for tags) or the
  // * single-product page (for products); or if the user wants to see all
  // * results, we should make a separate page for that...
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const searchTerm = e.target.value;
    // console.log('searchTerm', searchTerm);

    const productResults = catalogue.products.filter((prod) => {
      return prod.productName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const tagResults = catalogue.tags.filter((tag) => {
      return tag.tagName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setSearchResults({ products: productResults, tags: tagResults });
  };

  useEffect(() => {
    if (search === '') {
      setSearchNotFound(false);
      if (searchResults.products.length || searchResults.tags.length) {
        setSearchResults({
          products: [],
          tags: [],
        });
      }
    } else {
      if (!searchResults.products.length && !searchResults.tags.length) {
        setSearchNotFound(true);
      } else {
        setSearchNotFound(false);
      }
    }
  }, [search, searchResults]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchResults.products.length + searchResults.tags.length > 1) return;
    setSearch('');

    if (searchResults.tags.length === 1) {
      navigate(`/shop-all?page=1`, {
        state: { filterKey: searchResults.tags[0].tagName },
      });
    }

    if (searchResults.products.length === 1) {
      navigate(`/product/${searchResults.products[0].productId}`, {});
    }

    setSearchResults({
      products: [],
      tags: [],
    });
  };

  return (
    <nav className='navbar-container flex h-16 items-center justify-between px-10'>
      <div className='shop-links flex h-full flex-auto basis-1/3 items-center justify-start gap-7 text-base '>
        <NavLink to={'/shop-all'}>SHOP</NavLink>

        <NavLink to='/shop-all/bestsellers' state={{ sortKey: 'saleCount' }}>
          BESTSELLERS
        </NavLink>
        <NavLink to={''}>FEATURED</NavLink>
        <NavLink to={''}>NEW IN</NavLink>
      </div>

      <div className='logo-section flex h-full flex-auto basis-1/3 items-center justify-center '>
        <p className='text-3xl'>ASTORIA</p>
      </div>

      <div className='user-section flex h-full flex-auto basis-1/3 items-center justify-end gap-5  '>
        <NavLink to={`/user/${userId}/cart`}>
          <img src={cart3} className=' w-7 ' />
        </NavLink>

        <NavLink to={`/user/${userId}/favorites`}>
          {' '}
          <img src={heart3} className='w-6' />
        </NavLink>
        {userId && <NavLink to={`/user/${userId}`}>ACCOUNT</NavLink>}

        {!userId && (
          <NavLink to={`/sign-in`}>
            {' '}
            <img src={user} className=' w-6 ' />
          </NavLink>
        )}
        {userId && <button onClick={signOut}>SIGN OUT</button>}
        {/* <img src={searchIcon} className=' w-6 ' /> */}

        {/* <form onSubmit={(e) => handleFormSubmit(e)}>
          <input
            type='text'
            id='search'
            value={search}
            placeholder='search...'
            onChange={(e) => handleSearch(e)}
          ></input>
          <button>search</button>
        </form>  */}
        {/* <Search
          searchResults={searchResults}
          setSearch={setSearch}
          setSearchResults={setSearchResults}
          searchNotFound={searchNotFound}
        /> */}
      </div>
      {userId && role === 'admin' && (
        <NavLink to='/admin' className='text-red-500'>
          ADMIN
        </NavLink>
      )}
      {/* {(searchResults.products.length > 0 || searchResults.tags.length > 0) && (
        <select onChange={(e) => console.log(e.target.dataset.type)}>
          {searchResults.products.map((prod) => (
            <option
              key={prod.productId}
              value={prod.productId}
              onClick={() =>
                handleSelectSearchItem({ type: 'product', id: prod.productId })
              }
            >
              {prod.productName}
            </option>
          ))}
          {searchResults.tags.map((tag) => (
            <option
              onClick={() =>
                handleSelectSearchItem({ type: 'tag', name: tag.tagName })
              }
              key={tag.tagId}
              value={tag.tagId}
              data-type="tag"
            >
              {tag.tagName}
            </option>
          ))}
        </select> */}
      {/* )} */}
    </nav>
  );
}
