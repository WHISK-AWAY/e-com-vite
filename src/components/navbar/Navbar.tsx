import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { getUserId, selectAuth } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import {
  searchProducts,
  selectSearchProducts,
} from '../../redux/slices/allProductSlice';
import type { TSearch } from '../../redux/slices/allProductSlice';
import SignWrapper from '../SignWrapper';
import CartFavWrapper from '../CartFavWrapper';
import DropDownMenu from './DropdownMenu';

import Fuse from 'fuse.js';

import heartBlanc from '../../assets/icons/heart-blanc.svg';
import heartFilled from '../../assets/icons/heart-filled.svg';
import user from '../../assets/icons/user.svg';
import bag from '../../assets/icons/bag-blanc.svg';
import dot from '../../assets/icons/dot.svg';
import searchIcon from '../../assets/icons/search.svg';

import { fetchAllTags, selectTagState } from '../../redux/slices/tagSlice';
import Search from '../Search';

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
  // const [isCartHidden, setIsCartHidden] = useState(true);
  // const [isFavHidden, setIsFavHidden] = useState(true);
  const [isSignFormHidden, setIsSignFormHidden] = useState(true);
  const [isCartFavWrapperHidden, setIsCartFavWrapperHidden] = useState(true);
  const [mode, setMode] = useState<TCFMode>('cart');
  const [isHover, setHover] = useState(false);
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const tagState = useAppSelector(selectTagState);
  const [isSearchHidden, setIsSearchHidden] = useState(true);
  const test = useRef(null)

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

  useEffect(() => {
    if (!tagState.tags.length) {
      dispatch(fetchAllTags());
    }
  }, [tagState]);

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

  const SCORE_THRESHOLD = 0.6;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const searchTerm = e.target.value;
    console.log('searchTerm', searchTerm);

    const productResults = catalogue.products.filter((prod) => {
      return prod.productName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const tagResults = catalogue.tags.filter((tag) => {
      return tag.tagName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const options = {
      includeScore: true,
      // ignoreLocation: true,
    
      keys: ['productName', 'tagName'],
    };

    const fuse = new Fuse(catalogue.products, options);
    // const result = fuse.search(searchTerm);

    const searchResults = fuse.search(searchTerm).filter((result) => result.score! < SCORE_THRESHOLD).map((result) => result.item)
    console.log('search results', searchResults);
    // console.log('score', options)

    setSearchResults({ products: searchResults, tags: [] });
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
    <nav className='navbar-container z-50 sticky bg-white top-0 flex h-16 items-center justify-between px-6 lg:px-10'>
      <div className='shop-links shrink-1 group flex h-full grow-0 basis-1/2 items-center   justify-start gap-4 font-hubbali text-xs  lg:gap-5  lg:text-lg 2xl:gap-6'>
        <div
          className=''
          onMouseEnter={() => setIsMenuHidden(false)}
          onClick={() => setIsMenuHidden(false)}
        >
          SHOP
          {/* <NavLink to={'/shop-all'} onClick={() => setIsMenuHidden(true)}>
              SHOP
            </NavLink> */}
        </div>

        {!isMenuHidden && (
          <DropDownMenu
            setIsMenuHidden={setIsMenuHidden}
            isMenuHidden={isMenuHidden}
          />
        )}

        <NavLink to='/shop-all/bestsellers' state={{ sortKey: 'saleCount' }}>
          BESTSELLERS
        </NavLink>
        {/* <NavLink to={'/featured'}>FEATURED</NavLink> */}
        <NavLink to={'/new-in'}>NEW IN</NavLink>
      </div>

      <div className='logo-section max-w-1/3 flex h-full items-center justify-center'>
        {!isMenuHidden ? (
          <Link
            to='/'
            className='relative z-50 font-chonburi text-[2.5vw] text-[#262626]  min-[1600px]:text-[1.6vw]'
            onClick={() => setIsMenuHidden(true)}
          >
            <img
              src={dot}
              alt='dot-icon'
              className='absolute right-0 top-0 h-[.6vw] translate-x-[150%] translate-y-[290%]  min-[1600px]:h-[.4vw]  min-[1600px]:translate-y-[240%]'
            />
            <img
              src={dot}
              alt='dot-icon'
              className='absolute right-1/2 top-0 h-[.6vw] -translate-x-[1100%] translate-y-[290%]  min-[1600px]:h-[.4vw]  min-[1600px]:translate-y-[240%]'
            />
            ASTORIA
          </Link>
        ) : (
          <Link
            to='/'
            className='z-[60] font-chonburi text-[2.5vw] text-[#262626]  min-[1600px]:text-[1.6vw]'
            onClick={() => setIsMenuHidden(true)}
          >
            ASTORIA
          </Link>
        )}
      </div>

      <div className='user-section shrink-1 flex h-full w-1/2 items-center justify-end gap-2 '>
        <img
          src={searchIcon}
          className=' h-3 lg:h-[18px] xl:h-[21px]'
          onClick={() => setIsSearchHidden((prev) => !prev)}
        />
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className={`${
            !isSearchHidden
              ? 'absolute right-0 top-0 z-20 h-[60vh] w-full  bg-white'
              : 'hidden'
          }`}
        >
          <div className='absolute right-1/2 top-0 flex h-[4vw] w-[45vw] translate-x-[50%] translate-y-[150%] gap-5 '>
            <input
              className='w-full rounded-sm border border-charcoal font-federo text-[1.5vw] placeholder:font-aurora  placeholder:text-charcoal autofill:border-charcoal focus:border-charcoal focus:outline-none focus:outline-1 focus:outline-offset-0  focus:outline-charcoal '
              type='text'
              id='search'
              value={search}
              placeholder='search...'
              onChange={(e) => handleSearch(e)}
            ></input>
            <button className='bg-charcoal px-[10%] font-italiana text-[1.5vw] uppercase text-white '>
              search
            </button>
          </div>
        </form>

        <Search
          isSearchHidden={isSearchHidden}
          setIsSearchHidden={setIsSearchHidden}
          searchResults={searchResults}
          setSearch={setSearch}
          setSearchResults={setSearchResults}
          searchNotFound={searchNotFound}
        />

         {/* {(searchResults.products.length > 0 ||
          searchResults.tags.length > 0) && (
          <select onChange={(e) => console.log(e.target.dataset.type)}>
            {searchResults.products.map((prod) => (
              <option
                key={prod.productId}
                value={prod.productId}
                onClick={() =>
                  handleSelectSearchItem({
                    type: 'product',
                    id: prod.productId,
                  })
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
                data-type='tag'
              >
                {tag.tagName}
              </option>
            ))}
          </select>
        )}  */}

        {
          <div >
            <img
              src={bag}
              className='w-[14px] cursor-pointer lg:w-[19px] xl:w-[23px]'
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
              src={
                singleUserState.user?.favorites?.length >= 1
                  ? heartFilled
                  : heartBlanc
              }
              // style={{strokeWidth: '2'}}
              className='w-3 cursor-pointer lg:w-[16px] xl:w-5 '
              onClick={async () => {
                await setMode('fav');
                setIsCartFavWrapperHidden(false);
              }}
            />
          </div>
        }

        {userId ? (
          <NavLink to={`/user/${userId}`}>
            <img src={user} className='w-3 lg:w-4 xl:w-5' />
          </NavLink>
        ) : (
          <>
            <div onClick={() => setIsSignFormHidden((prev) => !prev)}>
              <img src={user} className='w-3 lg:w-4 xl:w-5' />
            </div>
            {!isSignFormHidden && (
              <SignWrapper setIsSignFormHidden={setIsSignFormHidden} />
            )}
          </>
        )}
      </div>
      {userId && singleUserState.user.role === 'admin' && (
        <NavLink
          to='/admin'
          className='fixed bottom-[5%] left-[5%] z-50 font-marcellus text-red-600 transition-all hover:-translate-x-2 hover:translate-y-1 hover:rounded-sm hover:border hover:border-charcoal hover:bg-red-500 hover:px-2 hover:py-1 hover:text-white'
        >
          ADMIN
        </NavLink>
      )}
    </nav>
  );
}
