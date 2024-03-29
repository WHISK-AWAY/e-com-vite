import {
  fetchSingleUser,
  selectSingleUserFavorites,
  removeFromFavorites,
} from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { selectAuth } from '../redux/slices/authSlice';
import { addToCart } from '../redux/slices/cartSlice';
import FavoriteItem from './FavoriteItem';
import x from '../../src/assets/icons/x.svg';

export default function Favorite({ closeSlider }: { closeSlider: () => void }) {
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
    if (userId && qty > 0)
      dispatch(addToCart({ userId, productId, qty })).then(() =>
        handleRemove({ userId, productId })
      );
  };

  return (
    <div className="flex h-full  flex-col items-center justify-start lg:gap-4">
      <div className="header w-full border-b border-charcoal pt-5">
        <h1 className="flex translate-x-[4%] justify-center pb-3 font-poiret  text-base  lg:text-xl portrait:text-[1.4rem]">
          {userFavorite?.length
            ? 'YOUR FAVORITES ' + `(${userFavorite?.length})`
            : 'YOUR FAVORITES'}
        </h1>

        <img
          className="absolute right-0 top-6 h-3 w-10 cursor-pointer lg:h-5  portrait:top-4 portrait:h-6"
          src={x}
          alt="close favorites"
          onClick={closeSlider}
        />
      </div>

      <div className="favorite-product-info m-10 h-full w-10/12 overflow-hidden border border-charcoal p-3 lg:p-6 landscape:short:p-3">
        <div className="flex h-full flex-col items-center justify-between overflow-hidden">
          {userFavorite?.length && userId ? (
            <div className="no-scrollbar flex flex-col gap-6 overflow-auto">
              {userFavorite.map((product) => {
                return (
                  <div
                    key={product._id}
                    className="relative"
                  >
                    <FavoriteItem
                      product={product}
                      handleAddToCart={handleAddToCart}
                      userId={userId}
                      closeSlider={closeSlider}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center font-grotesque text-sm">
              you don't have any favorites
            </div>
          )}

          <div className="flex w-11/12 flex-col items-center justify-center border-t-[0.75px] border-charcoal/80 pt-5 align-bottom">
            <button
              onClick={closeSlider}
              className="w-fit border border-charcoal px-6 font-grotesque text-xs lg:py-1 lg:text-sm xl:text-base 2xl:px-10 2xl:text-lg portrait:py-2 portrait:text-[1rem] landscape:short:py-1 landscape:short:text-sm"
            >
              continue shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
