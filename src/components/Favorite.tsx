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

export default function Favorite() {
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

  if (!userFavorite || !userFavorite[0]) return <p>You don't have any favorites</p>;

  if (!userId) return <p>You don't have any favorites</p>;
  return (
    <section className='user-favorites-container'>
      <div>
        <h1>FAVORITES</h1>
        <div className='favorite-product-info'>
          {userFavorite.map((product, productId) => {
            return (
              <div key={product._id}>
                <FavoriteItem
                  product={product}
                  handleAddToCart={handleAddToCart}
                  userId={userId}
                />
                <div>
                  <button
                    onClick={() =>
                      handleRemove({ userId, productId: product._id })
                    }
                  >
                    remove
                  </button>
                  <br />
                </div>
              </div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
}
