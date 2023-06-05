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

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId, error: authError } = useAppSelector(selectAuth);
  const {
    user: { firstName },
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
    <nav className='navbar-container flex justify-end gap-4'>
      {/* {firstName && <p>{`HELLO ${firstName.toUpperCase()}`}</p>} */}
      <NavLink to={'/shop-all'}>SHOP</NavLink>

      <NavLink to='/shop-all/bestsellers' state={{ sortKey: 'saleCount' }}>
        BESTSELLERS
      </NavLink>
      {userId && <NavLink to={`/user/${userId}`}>ACCOUNT</NavLink>}
      <NavLink to={`/user/${userId}/cart`}>CART</NavLink>
      <NavLink to={`/user/${userId}/favorites`}>FAVORITES</NavLink>
      {!userId && <NavLink to={`/sign-in`}>SIGN IN</NavLink>}
      {userId && <button onClick={signOut}>SIGN OUT</button>}

      <form onSubmit={(e) => handleFormSubmit(e)}>
        <input
          type='text'
          id='search'
          value={search}
          placeholder='search...'
          onChange={(e) => handleSearch(e)}
        ></input>
        <button>search</button>
      </form>
      <Search
        searchResults={searchResults}
        setSearch={setSearch}
        setSearchResults={setSearchResults}
        searchNotFound={searchNotFound}
      />
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
