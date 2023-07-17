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
import { gsap } from 'gsap';

import Fuse from 'fuse.js';

import heartBlanc from '../../assets/icons/heart-blanc.svg';
import heartFilled from '../../assets/icons/heart-filled.svg';
import user from '../../assets/icons/user.svg';
import bag from '../../assets/icons/bag-blanc.svg';
import searchIcon from '../../assets/icons/search.svg';

import { fetchAllTags, selectTagState } from '../../redux/slices/tagSlice';
import Search from './Search';
import SearchContainer from './SearchContainer';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export type TCFMode = 'cart' | 'fav';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectAuth);
  const singleUserState = useAppSelector(selectSingleUser);
  const catalogue = useAppSelector(selectSearchProducts);
  const [search, setSearch] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [isSignFormHidden, setIsSignFormHidden] = useState(true);
  const [isCartFavWrapperHidden, setIsCartFavWrapperHidden] = useState(true);
  const [mode, setMode] = useState<TCFMode>('cart');
  const [isHover, setHover] = useState(false);
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const tagState = useAppSelector(selectTagState);
  const [isSearchHidden, setIsSearchHidden] = useState(true);
  const test = useRef(null);

  const [searchResults, setSearchResults] = useState<TSearch>({
    products: [],
    tags: [],
  });

  useEffect(() => {
    // if (!userId && !authError) dispatch(getUserId());

    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(getUserId());
    dispatch(searchProducts());
    dispatch(fetchAllTags());
  }, []);

  // * this part doesn't really work all that well, but the navigates should
  // * at least be in the ball park of what we want
  // function handleSelectSearchItem(args: {
  //   type: 'tag' | 'product';
  //   name?: string;
  //   id?: string;
  // }) {
  //   if (args.type === 'tag') {
  //     navigate('/shop-all?page=1', { state: { filterKey: args.name } });
  //   } else {
  //     navigate('/product/' + args.id);
  //   }
  // }

  // * on-change search handler more or less works -- not sure yet how exactly
  // * to render the results...needs to be a pop-up with the results listed below
  // * and linking to either the filtered shop-all page (for tags) or the
  // * single-product page (for products); or if the user wants to see all
  // * results, we should make a separate page for that...

  // //fuse fuzzy product search

  // /**
  //  * ! look into category/ search, have a discussion
  //  */
  // const SCORE_THRESHOLD = 0.6;
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(e.target.value);
  //   const searchTerm = e.target.value;
  //   // console.log('searchTerm', searchTerm);

  //   const productResults = catalogue.products.filter((prod) => {
  //     return prod.productName.toLowerCase().includes(searchTerm.toLowerCase());
  //   });
  //   const tagResults = catalogue.tags.filter((tag) => {
  //     return tag.tagName.toLowerCase().includes(searchTerm.toLowerCase());
  //   });

  //   const options = {
  //     includeScore: true,
  //     // ignoreLocation: true,

  //     keys: ['productName', 'tagName'],
  //   };

  //   const fuse = new Fuse(catalogue.products, options);

  //   const searchResults = fuse
  //     .search(searchTerm)
  //     .filter((result) => result.score! < SCORE_THRESHOLD)
  //     .map((result) => result.item);
  //   console.log('search results', searchResults);

  //   setSearchResults({ products: searchResults, tags: [] });
  // };

  // useEffect(() => {
  //   if (search === '') {
  //     setSearchNotFound(false);
  //     if (searchResults.products.length || searchResults.tags.length) {
  //       setSearchResults({
  //         products: [],
  //         tags: [],
  //       });
  //     }
  //   } else {
  //     if (!searchResults.products.length && !searchResults.tags.length) {
  //       setSearchNotFound(true);
  //     } else {
  //       setSearchNotFound(false);
  //     }
  //   }
  // }, [search, searchResults]);

  // const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (searchResults.products.length + searchResults.tags.length > 1) return;
  //   setSearch('');

  //   if (searchResults.tags.length === 1) {
  //     navigate(`/shop-all?page=1`, {
  //       state: { filterKey: searchResults.tags[0].tagName },
  //     });
  //   }

  //   if (searchResults.products.length === 1) {
  //     navigate(`/product/${searchResults.products[0].productId}`, {});
  //   }

  //   setSearchResults({
  //     products: [],
  //     tags: [],
  //   });
  // };

  // window.addEventListener('scroll', function () {
  //   const navbar = document.getElementById('navbar');
  //   const scrollPosition = window.scrollY;

  //   if (scrollPosition > 0) {
  //     navbar?.classList.add('navbar-scrolled');
  //   } else {
  //     navbar?.classList.remove('navbar-scrolled');
  //   }
  // });

  return (
<>
          <motion.div
        className='slide-in fixed left-0 top-0 z-50 h-screen w-screen origin-bottom bg-[#0f0f0f]'
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
        />


      <motion.div
        className='slide-out  fixed left-0 top-0 z-50 h-screen w-screen origin-top bg-[#0f0f0f]'
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ delay: 0.6, duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
        />
    <nav
      id='navbar'
      className='navbar-container sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 lg:px-10'
      >
      <Toaster
        position='top-right'
        containerStyle={{ position: 'absolute', right: 0 }}
        toastOptions={{
          className:
          'rounded-sm shadow-none font-raleway text-center uppercase  border border-charcoal/60 text-[1vw] p-[2%] text-[#262626] 2xl:text-[1rem]',
          duration: 5000,
          style: {
            maxWidth: 700,
            position: 'sticky',
            top: '10',
            zIndex: '50',
          },
        }}
        />
      <div className='shop-links shrink-1 group flex h-full grow-0 basis-1/2 items-center justify-start gap-4 font-hubbali  text-xs lg:gap-5 lg:text-lg 2xl:gap-6'>
        <div
          className='shop cursor-pointer'
          onMouseEnter={() => setIsMenuHidden(false)}
          onClick={() => setIsMenuHidden(false)}
          >
          SHOP
        </div>

        {!isMenuHidden && <DropDownMenu setIsMenuHidden={setIsMenuHidden} />}

        <NavLink to='/shop-all/bestsellers' state={{ sortKey: 'saleCount' }}>
          BESTSELLERS
        </NavLink>
        <NavLink to={'/new-in'}>NEW IN</NavLink>
      </div>

      <div className='logo-section max-w-1/3 flex h-full items-center justify-center'>
        <Link
          to='/'
          className='font-notable text-[2.5vw] text-[#262626]  3xl:text-[1.6vw]'
          onClick={() => setIsMenuHidden(true)}
          >
          ASTORIA
        </Link>
      </div>

      <div className='user-section shrink-1 flex h-full w-1/2 items-center justify-end gap-2'>
        <img
          src={searchIcon}
          className='h-3 cursor-pointer lg:h-[18px] xl:h-[21px]'
          onClick={() => setIsSearchHidden((prev) => !prev)}
          />
        {!isSearchHidden && (
          <SearchContainer setIsSearchHidden={setIsSearchHidden} />
          )}

        {
          <div>
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
            <button onClick={() => setIsSignFormHidden((prev) => !prev)}>
              <img src={user} className='w-3 lg:w-4 xl:w-5' />
            </button>
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
      </>
  );
}
