import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getUserId, selectAuth } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { searchProducts } from '../../redux/slices/allProductSlice';
import SignWrapper from '../SignWrapper';
import CartFavWrapper from '../CartFavWrapper';
import DropDownMenu from './DropdownMenu';

import heartBlanc from '../../assets/icons/heart-blanc.svg';
import heartFilled from '../../assets/icons/heart-filled.svg';
import user from '../../assets/icons/user.svg';
import bag from '../../assets/icons/bag-blanc.svg';
import searchIcon from '../../assets/icons/search.svg';

import { fetchAllTags } from '../../redux/slices/tagSlice';
import SearchContainer from './SearchContainer';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

import MobileNav from './MobileNav';

export type TCFMode = 'cart' | 'fav';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectAuth);
  const singleUserState = useAppSelector(selectSingleUser);
  const [isSignFormHidden, setIsSignFormHidden] = useState(true);
  const [isCartFavWrapperHidden, setIsCartFavWrapperHidden] = useState(true);
  const [mode, setMode] = useState<TCFMode>('cart');
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const [isSearchHidden, setIsSearchHidden] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(getUserId());
    dispatch(searchProducts());
    dispatch(fetchAllTags());
  }, []);

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
      <MobileNav
        setIsSearchHidden={setIsSearchHidden}
        setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
        setMode={setMode}
        mode={mode}
        setIsSignFormHidden={setIsSignFormHidden}
        isSignFormHidden={isSignFormHidden}
      />
      <nav
        id='navbar'
        className='navbar-container sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 lg:px-10'
      >
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 5000,
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
                onClick={() => {
                  setMode('cart');
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
                  userId && singleUserState.user?.favorites?.length >= 1
                    ? heartFilled
                    : heartBlanc
                }
                // style={{strokeWidth: '2'}}
                className='w-3 cursor-pointer lg:w-[16px] xl:w-5 '
                onClick={() => {
                  setMode('fav');
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
