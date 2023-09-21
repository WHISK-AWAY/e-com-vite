import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

import unfilledHeartIcon from '../../assets/icons/heart-blanc.svg'
import filledHeartIcon from '../../assets/icons/heart-filled.svg'
import { addToFavorites, removeFromFavorites } from "../../redux/slices/userSlice";
import { toastGuestFavorite } from "../../utilities/toast";

import { type TProduct } from "../../redux/slices/allProductSlice";

type FavoritesButtonProps = {
  product: TProduct
}

// TODO: optimistically highlight / clear favorite icon if user is logged in

export default function FavoritesButton({ product }: FavoritesButtonProps) {
  const dispatch = useAppDispatch();

  const { userId } = useAppSelector(state => state.auth);
  const { favorites: userFavorites } = useAppSelector(state => state.user.user)

  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (product._id) {
      setIsFavorited(userFavorites?.some(fav => fav._id === product._id) || false)
    }
  }, [product._id, userFavorites])

  // useEffect(() => {
  //   // ! debug log
  //   console.log(`${product.productName} ${isFavorited ? 'is' : 'is not'} favorited.`)

  // }, [isFavorited])

  function toggleFavorite({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    if (userId) {
      let favId = [] as string[];
      userFavorites.forEach((fav) => {
        favId.push(fav._id);
      });

      if (!favId?.includes(productId)) {
        dispatch(addToFavorites({ userId, productId }));
      } else {
        dispatch(removeFromFavorites({ userId, productId }));
      }
    } else {
      toastGuestFavorite();
    }
  };

  return (
    <div
      className='absolute right-[4%] top-[3%] cursor-pointer'
      onClick={() => {
        toggleFavorite({
          userId: userId!,
          productId: product._id.toString(),
        });
      }}
    >
      <img
        src={isFavorited ? filledHeartIcon : unfilledHeartIcon}
        alt={`${isFavorited ? 'remove from' : 'add to'} favorites`}
        width="20"
        height="17"
        className='h-3 lg:h-4 xl:w-5 portrait:h-5 portrait:md:h-6'
      />
    </div>
  )
}