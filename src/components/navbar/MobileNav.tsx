import menuIcon from '../../assets/icons/menu.svg';
import heartBlanc from '../../assets/icons/heart-blanc.svg';
import heartFilled from '../../assets/icons/heart-filled.svg';
import user from '../../assets/icons/user.svg';
import bag from '../../assets/icons/bag-blanc.svg';
import searchIcon from '../../assets/icons/search.svg';

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { selectAuth } from '../../redux/slices/authSlice';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import { TCFMode } from './Navbar';
import SignWrapper from '../SignWrapper';
import DropdownMenu from './DropdownMenu';
import CartFavWrapper from '../CartFavWrapper';
import SearchContainer from './SearchContainer';

export type NavbarProps = {
  setIsSearchHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchHidden: boolean;
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isCartFavWrapperHidden: boolean;
  setMode: React.Dispatch<React.SetStateAction<TCFMode>>;
  mode: TCFMode;
  setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isSignFormHidden: boolean;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuHidden: boolean;
  mobileMenu: boolean;
};

export default function MobileNav({
  setIsSearchHidden,
  isSearchHidden,
  setIsCartFavWrapperHidden,
  isCartFavWrapperHidden,
  setMode,
  mode,
  setIsSignFormHidden,
  isSignFormHidden,
  setIsMenuHidden,
  isMenuHidden,
  mobileMenu,
}: NavbarProps) {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectAuth);
  const singleUserState = useAppSelector(selectSingleUser);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  return (
    <nav className="mobile-nav-container align-center sticky top-0 z-40 flex h-16 w-[100vw] items-center justify-between bg-white p-2">
      <section className="flex h-full w-fit items-center  gap-6 pl-3">
        {/**hamburger menu section */}
        <>
          <img
            src={menuIcon}
            alt="Menu"
            className="h-9 pt-3"
            onClick={() => setIsMenuHidden(false)}
          />
          {!isMenuHidden && (
            <DropdownMenu
              setIsMenuHidden={setIsMenuHidden}
              mobileMenu={mobileMenu}
            />
          )}
        </>

        {/**logo section */}
        <Link
          to={'/'}
          className="pb-3 font-notable text-[2.5rem] leading-none text-primary-gray"
        >
          A
        </Link>
      </section>

      {/**user nav section */}
      <section className="user-navigation flex h-full w-fit items-center justify-center gap-4 pr-3">
        {/**search section */}
        <>
          <img
            src={searchIcon}
            alt="Search"
            className="h-6"
            onClick={() => setIsSearchHidden((prev) => !prev)}
          />

          {!isSearchHidden && (
            <SearchContainer setIsSearchHidden={setIsSearchHidden} />
          )}
        </>

        {/**cart section */}
        <>
          <img
            src={bag}
            alt="Cart"
            className="h-6"
            onClick={() => {
              setMode('cart');
              setIsCartFavWrapperHidden(false);
            }}
          />

          {!isCartFavWrapperHidden && mode === 'cart' && (
            <CartFavWrapper
              setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
              mode={mode}
              mobileMenu={mobileMenu}
            />
          )}
        </>

        {/**fav section */}
        <>
          <img
            src={
              userId && singleUserState.user?.favorites?.length >= 1
                ? heartFilled
                : heartBlanc
            }
            alt={
              userId && singleUserState.user?.favorites?.length >= 1
                ? 'Favorites (Filled Heart)'
                : 'Favorites (Empty Heart)'
            }
            className="h-6"
            onClick={() => {
              setMode('fav');
              setIsCartFavWrapperHidden(false);
            }}
          />

          {!isCartFavWrapperHidden && mode === 'fav' && (
            <CartFavWrapper
              setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
              mode={mode}
              mobileMenu={mobileMenu}
            />
          )}
        </>

        {/**user section */}
        {userId ? (
          <Link to={`/user/${userId}`}>
            {' '}
            <img
              src={user}
              alt={userId ? 'User Account' : 'Sign In'}
              className="h-6"
            />
          </Link>
        ) : (
          <>
            <button
              onClick={() => setIsSignFormHidden((prev) => !prev)}
              aria-label="sign in / sign up"
            >
              <img
                src={user}
                alt="sign in / sign up"
                className="h-6"
              />
            </button>
            {!isSignFormHidden && (
              <SignWrapper
                setIsSignFormHidden={setIsSignFormHidden}
                mobileMenu={mobileMenu}
              />
            )}
          </>
        )}
      </section>
    </nav>
  );
}
