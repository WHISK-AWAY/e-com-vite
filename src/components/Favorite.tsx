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
    <section className='user-favorites-container fixed right-0 top-0 z-10 flex h-screen w-[100vw] flex-col overflow-hidden bg-[#35403F]/50'>
      <div className='  self-end flex h-full     flex-col bg-white '>
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
              onClick={() => setIsFavHidden((prev) => !prev)}
            />
          </div>

          <div className='favorite-product-info m-10 h-full w-10/12 overflow-hidden border border-charcoal p-5 py-8 pl-8 md:pl-4 md:pr-3 lg:p-10'>
            <div className='flex  h-full flex-col items-center  justify-between overflow-hidden'>
              {userFavorite?.length && userId ? (
                <div className='flex flex-col overflow-auto'>
                  {userFavorite.map((product, productId) => {
                    return (
                      <div key={product._id} className='relative '>
                        <FavoriteItem
                          product={product}
                          handleAddToCart={handleAddToCart}
                          userId={userId}
                        />
                        <div className='  items-center'>
                          <img
                            src={x}
                            alt='x-icon'
                            className='absolute right-0 top-0  h-2 w-3 lg:h-3 lg:w-3'
                            onClick={() =>
                              handleRemove({ userId, productId: product._id })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='text-center font-marcellus text-sm'>
                  you don't have any favorites
                </div>
              )}

              <div className='flex w-11/12 flex-col items-center self-center border-t-[0.75px] border-charcoal/80 pt-5 align-bottom'>
                <Link
                  to={'/shop-all'}
                  className='w-fit self-center border border-charcoal px-6 py-1 font-italiana text-sm md:px-4 md:text-sm lg:py-1 xl:text-base'
                >
                  continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
