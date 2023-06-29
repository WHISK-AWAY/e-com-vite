import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
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
import heartBlanc from '../../src/assets/icons/heart-blanc.svg';
import heartFilled from '../../src/assets/icons/heart-filled.svg';

import user from '../../src/assets/icons/fuser.svg';
import searchIcon from '../../src/assets/icons/search.svg';
import bag from '../../src/assets/icons/bag-blanc.svg';
import Cart from './Cart';
import Favorite from './Favorite';
import SignIn from './SignIn';
import SignWrapper from './SignWrapper';
import CartFavWrapper from './CartFavWrapper';
// import { ReactSVG } from 'react-svg';

export type TCFMode = 'cart' | 'fav';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId, error: authError } = useAppSelector(selectAuth);
  const singleUserState = useAppSelector(selectSingleUser);
  const auth = useAppSelector(selectAuth);
  const catalogue = useAppSelector(selectSearchProducts);
  const [search, setSearch] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [isCartHidden, setIsCartHidden] = useState(true);
  const [isFavHidden, setIsFavHidden] = useState(true);
  const [isSignFormHidden, setIsSignFormHidden] = useState(true);
  const [isCartFavWrapperHidden, setIsCartFavWrapperHidden] = useState(true);
  const [mode, setMode] = useState<TCFMode>('cart');

  const [searchResults, setSearchResults] = useState<TSearch>({
    products: [],
    tags: [],
  });

  // console.log('user', singleUserState.user.favorites)
  useEffect(() => {
    if (!userId && !authError) dispatch(getUserId());

    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(getUserId());
    dispatch(searchProducts());
  }, []);

  // useEffect(() => {
  //   console.log(isCartFavWrapperHidden);
  // }, [isCartFavWrapperHidden]);
  // function signOut() {
  //   dispatch(requestLogout());
  //   dispatch(resetUserState());
  //   navigate('/');
  // }

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
    <nav className='navbar-container flex h-16 items-center justify-between px-6 lg:px-10'>
      <div className='shop-links shrink-1 flex h-full grow-0  basis-1/2   items-center justify-start gap-4 font-hubbali  text-xs lg:gap-5  lg:text-lg 2xl:gap-6'>
        <NavLink to={'/shop-all'}>SHOP</NavLink>

        <NavLink to='/shop-all/bestsellers' state={{ sortKey: 'saleCount' }}>
          BESTSELLERS
        </NavLink>
        <NavLink to={''}>FEATURED</NavLink>
        <NavLink to={''}>NEW IN</NavLink>
      </div>

      <div className='logo-section max-w-1/3 flex h-full items-center justify-center'>
        <Link to='/' className='font-chonburi text-2xl lg:text-3xl xl:text-4xl'>
          ASTORIA
        </Link>
      </div>

      <div className='user-section shrink-1 flex h-full w-1/2 items-center justify-end gap-5'>
       
        {

         
          <div>
            <img
              src={bag}
              className='cursor-pointer  h-4'
              onClick={async () => {
                await setMode('cart');
                setIsCartFavWrapperHidden(false);
              }}
            />
            {!isCartFavWrapperHidden && mode === 'cart' && (
              <CartFavWrapper
                setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
                mode={mode}
              />
            )}
          </div>
        }
        {
          <div>
            {!isCartFavWrapperHidden && mode === 'fav' && (
              <CartFavWrapper
                setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
                mode={mode}
              />
            )}
            
              <img
                src={singleUserState.user?.favorites?.length >= 1 ? heartFilled : heartBlanc}
                // style={{strokeWidth: '2'}}
                className='cursor-pointer stroke-[6px] h-4'
                onClick={async () => {
                  await setMode('fav');
                  setIsCartFavWrapperHidden(false);
                }}
              />
            
          </div>
        }

        {userId ? (
          <NavLink to={`/user/${userId}`}>
            <img src={user} className='  h-4' />
          </NavLink>
        ) : (
          <>
            <div onClick={() => setIsSignFormHidden((prev) => !prev)}>
              <img src={user} className=' lg:w-5' />
            </div>
            {!isSignFormHidden && (
              <SignWrapper setIsSignFormHidden={setIsSignFormHidden} />
              )}
          </>
        )}
        

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
      {userId && singleUserState.user.role === 'admin' && (
        <NavLink
          to='/admin'
          className='fixed bottom-[5%] left-[5%] z-50 font-marcellus text-red-600 transition-all hover:-translate-x-2 hover:translate-y-1 hover:rounded-sm hover:border hover:border-charcoal hover:bg-red-500 hover:px-2 hover:py-1 hover:text-white'
        >
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
