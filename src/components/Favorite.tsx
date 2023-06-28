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
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  return (
    <div className='flex h-full  flex-col items-center justify-start lg:gap-4'>
      <div className='header w-full border-b border-charcoal pt-5'>
        <h1 className='flex justify-center pb-3 font-italiana text-base lg:text-2xl'>
          {userFavorite?.length
            ? 'YOUR FAVORITES ' + `(${userFavorite?.length})`
            : 'YOUR FAVORITES'}
        </h1>

        <img
          className='absolute right-0 top-6 h-3 w-10 lg:h-5'
          src={x}
          alt='x-icon'
          onClick={() => setIsFavHidden(true)}
        />
      </div>

      <div className='favorite-product-info m-10 h-full w-10/12 overflow-hidden border border-charcoal p-3 lg:p-10'>
        <div className='flex h-full flex-col items-center justify-between overflow-hidden'>
          {userFavorite?.length && userId ? (
            <div className='no-scrollbar flex flex-col gap-6 overflow-auto'>
              {userFavorite.map((product) => {
                return (
                  <div key={product._id} className='relative'>
                    <FavoriteItem
                      product={product}
                      handleAddToCart={handleAddToCart}
                      userId={userId}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center font-marcellus text-sm'>
              you don't have any favorites
            </div>
          )}

          <div className='flex w-11/12 flex-col items-center justify-center border-t-[0.75px] border-charcoal/80 pt-5 align-bottom'>
            <Link
              to={'/shop-all'}
              onClick={() => setIsFavHidden(true)}
              className='w-fit border border-charcoal px-6 font-italiana text-xs lg:py-1 lg:text-sm xl:text-base 2xl:px-10 2xl:text-lg'
            >
              continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
