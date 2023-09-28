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
import CartQtyIndicator from './CartQtyIndicator';

import heartBlanc from '../../assets/icons/heart-blanc.svg';
import heartFilled from '../../assets/icons/heart-filled.svg';
import user from '../../assets/icons/user.svg';
import bag from '../../assets/icons/bag-blanc.svg';
import searchIcon from '../../assets/icons/search.svg';

import { fetchAllTags } from '../../redux/slices/tagSlice';
import SearchContainer from './SearchContainer';
import { Toaster } from 'react-hot-toast';

import MobileNav from './MobileNav';
import { fetchUserCart, selectCart } from '../../redux/slices/cartSlice';

export type TCFMode = 'cart' | 'fav';

export type NavbarProps = {
  setIsSearchHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchHidden: boolean;
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isCartFavWrapperHidden: boolean;
  setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isSignFormHidden: boolean;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuHidden: boolean;
  mobileMenu: boolean;
  setMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Navbar({
  setIsSearchHidden,
  isSearchHidden,
  setIsCartFavWrapperHidden,
  isCartFavWrapperHidden,
  setIsSignFormHidden,
  isSignFormHidden,
  setIsMenuHidden,
  isMenuHidden,
  mobileMenu,
  setMobileMenu,
}: NavbarProps) {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(selectAuth);
  const singleUserState = useAppSelector(selectSingleUser);
  const [mode, setMode] = useState<TCFMode>('cart');
  const cart = useAppSelector(selectCart)
  const [cartQty, setCartQty] = useState(0)

  


  useEffect(() => {

    const cartItemsQty = cart.cart?.products?.reduce((accum, prod) => {
      return accum+ prod.qty
    }, 0)
    

    setCartQty(cartItemsQty)
  }, [cart.cart?.products])


  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
    else dispatch(getUserId());
    dispatch(fetchUserCart(userId))
  }, [userId]);

  useEffect(() => {
    dispatch(searchProducts());
    dispatch(fetchAllTags());
  }, []);

  return (
    <>
      <Toaster
        position={mobileMenu ? 'top-center' : 'top-right'}
        toastOptions={{
          duration: 5000,
        }}
      />

      {mobileMenu ? (
        <MobileNav
          setIsSearchHidden={setIsSearchHidden}
          isSearchHidden={isSearchHidden}
          setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
          isCartFavWrapperHidden={isCartFavWrapperHidden}
          setMode={setMode}
          mode={mode}
          setIsSignFormHidden={setIsSignFormHidden}
          isSignFormHidden={isSignFormHidden}
          setIsMenuHidden={setIsMenuHidden}
          isMenuHidden={isMenuHidden}
          mobileMenu={mobileMenu}
          cartQty={cartQty}
        />
      ) : (
        <nav
          id="navbar"
          className="navbar-container sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 lg:px-10"
        >
          <div className="shop-links shrink-1 group flex h-full grow-0 basis-1/2 items-center justify-start gap-4 font-hubbali  text-xs lg:gap-5 lg:text-lg 2xl:gap-6 portrait:md:text-[1.1rem]">
            <div
              className="shop cursor-pointer"
              onMouseEnter={() => setIsMenuHidden(false)}
              onClick={() => setIsMenuHidden(false)}
            >
              SHOP
            </div>

            {!isMenuHidden && (
              <DropDownMenu
                setIsMenuHidden={setIsMenuHidden}
                mobileMenu={mobileMenu}
              />
            )}

            <NavLink
              to="/shop-all/bestsellers"
              state={{ sortKey: 'saleCount' }}
            >
              BESTSELLERS
            </NavLink>
            <NavLink to={'/new-in'}>NEW IN</NavLink>
          </div>

          <div className="logo-section max-w-1/3 flex h-full items-center justify-center">
            <Link
              to="/"
              className="font-notable text-[2.5vw] text-[#262626]  3xl:text-[1.6vw] portrait:md:text-[1.7rem]"
              onClick={() => setIsMenuHidden(true)}
            >
              ASTORIA
            </Link>
          </div>

          <div className="user-section shrink-1 flex h-full w-1/2 items-center justify-end gap-2 portrait:md:gap-4">
            <img
              src={searchIcon}
              alt="search"
              className="h-3 cursor-pointer lg:h-[18px] xl:h-[21px] portrait:md:h-6"
              onClick={() => setIsSearchHidden((prev) => !prev)}
            />
            {!isSearchHidden && (
              <SearchContainer setIsSearchHidden={setIsSearchHidden} />
            )}

            {
              <div>
                {cart.cart?.products?.length > 0 && 
                <CartQtyIndicator
                cartItemsQty={cartQty}
                setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
                setMode={setMode}
                mobileMenu={mobileMenu}
                />
              }
                <img
                  src={bag}
                  className="w-[14px] cursor-pointer lg:w-[19px] xl:w-[23px] portrait:md:w-6"
                  alt="your cart"
                  onClick={() => {
                    setMode('cart');
                    setIsCartFavWrapperHidden(false);
                  }}
                />
                {!isCartFavWrapperHidden && mode === 'cart' && (
                  <>
                    <CartFavWrapper
                      setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
                      mode={mode}
                      mobileMenu={mobileMenu}
                    />
                  </>
                )}
              </div>
            }
            {
              <div>
                {!isCartFavWrapperHidden && mode === 'fav' && (
                  <CartFavWrapper
                    setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
                    mode={mode}
                    mobileMenu={mobileMenu}
                  />
                )}

                <img
                  src={
                    userId && singleUserState.user?.favorites?.length >= 1
                      ? heartFilled
                      : heartBlanc
                  }
                  alt="your favorites"
                  // style={{strokeWidth: '2'}}
                  className="w-3 cursor-pointer lg:w-[16px] xl:w-5 portrait:md:w-6"
                  onClick={() => {
                    setMode('fav');
                    setIsCartFavWrapperHidden(false);
                  }}
                />
              </div>
            }

            {userId ? (
              <NavLink
                to={`/user/${userId}`}
                aria-label="your account"
              >
                <img
                  src={user}
                  alt="your account"
                  className="w-3 lg:w-4 xl:w-5 portrait:md:w-6"
                />
              </NavLink>
            ) : (
              <>
                <button
                  onClick={() => setIsSignFormHidden((prev) => !prev)}
                  aria-label="sign in / sign up"
                >
                  <img
                    src={user}
                    alt="sign in / sign up"
                    className="w-3 lg:w-4 xl:w-5 portrait:md:w-6"
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
          </div>
          {userId && singleUserState.user.role === 'admin' && (
            <NavLink
              to="/admin"
              className="fixed bottom-[5%] left-[5%] z-50 font-marcellus text-red-600 transition-all hover:-translate-x-2 hover:translate-y-1 hover:rounded-sm hover:border hover:border-charcoal hover:bg-red-500 hover:px-2 hover:py-1 hover:text-white"
            >
              ADMIN
            </NavLink>
          )}
        </nav>
      )}
    </>
  );
}
