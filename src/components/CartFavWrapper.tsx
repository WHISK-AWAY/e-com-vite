import Cart from './Cart';
import Favorite from './Favorite';
import { useState } from 'react';
import { TCFMode } from './Navbar';

export default function CartFavWrapper({
  mode,
  setIsCartFavWrapperHidden,
}: {
  mode: TCFMode;
  setIsCartHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFavHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isCartFavWrapperHidden: boolean;
}) {
  return (
    <section
      // onClick={() => setIsCartFavWrapperHidden(true)}
      className='cart-container fixed right-0 top-0 z-10 flex h-screen w-screen flex-col overflow-hidden bg-[#35403F]/50'
    >
      <div
        // onClick={() => setIsCartFavWrapperHidden(true)}
        className='flex h-full max-w-[40vw] flex-col self-end bg-white'
      >
        {mode === 'cart' ? (
          <Cart setIsCartHidden={setIsCartFavWrapperHidden} />
        ) : (
          <Favorite setIsFavHidden={setIsCartFavWrapperHidden} />
        )}
      </div>
    </section>
  );
}
