import {
  fetchSingleUser,
  selectSingleUserFavorites,
  removeFromFavorites,
} from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import { getUserId, selectAuth } from '../redux/slices/authSlice';
import { addToCart } from '../redux/slices/cartSlice';
import FavoriteItem from './FavoriteItem';
import x from '../../src/assets/icons/x.svg';

export default function Favorite({
  setIsFavHidden,
}: {
  setIsFavHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const userFavorite = useAppSelector(selectSingleUserFavorites);
  const { userId } = useAppSelector(selectAuth);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  const handleRemove = ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    dispatch(removeFromFavorites({ userId, productId }));
  };

  const handleAddToCart = ({
    userId,
    productId,
    qty,
  }: {
    userId: string;
    productId: string;
    qty: number;
  }) => {
    if (userId)
      dispatch(addToCart({ userId, productId, qty })).then(() =>
        handleRemove({ userId, productId })
      );
  };

  if (!userFavorite || !userFavorite[0])
    return <p>You don't have any favorites</p>;

  if (!userId) return <p>You don't have any favorites</p>;
  return (
    <section className='user-favorites-container fixed right-0 top-0 z-10 flex h-screen w-[100vw] flex-col overflow-hidden bg-[#35403F]/50'>
      <div className='flex h-full max-w-[40vw] flex-col self-end  bg-white 2xl:max-w-[40vw]'>
        <div className='flex h-full  flex-col items-center justify-start lg:gap-4'>
          <div className='header border-b border-charcoal pt-5 w-full'>
            <h1 className='flex justify-center pb-3 font-italiana text-base lg:text-2xl'>
              YOUR FAVORITES
            </h1>

         
            <img
              className='absolute right-0 top-6 h-3 w-10 lg:h-5'
              src={x}
              alt='x-icon'
              onClick={() => setIsFavHidden((prev) => !prev)}
              />
          </div>

          <div className='favorite-product-info border border-charcoal m-10 h-full bg-pink-200'>
            {userFavorite.map((product, productId) => {
              return (
                <div key={product._id}>
                  <FavoriteItem
                    product={product}
                    handleAddToCart={handleAddToCart}
                    userId={userId}
                  />
                  <div className='relative  items-center'>
                    <img
                      src={x}
                      alt='x-icon'
                      className='absolute right-5 -top-60  h-2 w-3 lg:h-3 lg:w-3'
                      onClick={() =>
                        handleRemove({ userId, productId: product._id })
                      }
                      />
                  </div>
                </div>
              );
            })}
          </div>
           
        </div>
      </div>
    </section>
  );
}
