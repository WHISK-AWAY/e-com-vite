import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchUserCart,
  selectCart,
  addToCart,
  removeFromCart,
} from '../redux/slices/cartSlice';
import { useState, useEffect } from 'react';
import type { TProduct } from '../redux/slices/cartSlice';
import x from '../../src/assets/icons/x.svg';
import plus from '../../src/assets/icons/circlePlus.svg';
import minus from '../../src/assets/icons/circleMinus.svg';

export type CartProps = {
  product: TProduct;
  userId: string;
  qty: number;
};
export default function CartItem(props: CartProps) {
  const { product, userId, qty } = props;
  const { productName, productShortDesc, price, images, _id } = product;
  const dispatch = useAppDispatch();
  const [count, setCount] = useState<number>(qty);
  const cart = useAppSelector(selectCart);


  const handleRemove = (productId: string, qty: number) => {
    dispatch(removeFromCart({ userId: userId!, productId, qty }));
  };

  const totalQty = product.qty;

  const handleDecrement = () => {
    if (count <= 1) setCount(1);
    else setCount(count - 1);
    dispatch(
      removeFromCart({ userId: userId!, productId: product._id, qty: 1 })
    );
  };

  const handleIncrement = () => {
    if (count >= totalQty) return;
    else setCount(count + 1);
    dispatch(addToCart({ userId: userId!, productId: product._id, qty: 1 }));
  };

  return (
    <div className='cart-item-container w-9/10'>
      <div className=' flex items-center w-full justify-center '>
        <img
          className='aspect-[3/4] h-32 w-4/12 object-cover lg:h-48'
          src={
            images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || images[0].imageURL
          }
        />
        <div className='relative flex w-7/12 flex-col items-center bg-blue-300'>
          <img
            src={x}
            alt='x-icon'
            onClick={() => handleRemove(_id, qty)}
            className='absolute right-0 top-0 h-2 w-3 lg:h-3 lg:w-3'
          />

          <h4 className='top-10 mb-2 mt-5 text-center font-hubbali text-sm uppercase lg:mx-1 lg:mt-10 lg:text-base xl:text-base 2xl:text-xl'>
            {productName}
          </h4>
          <div className='font-grotesquelg:text-md mb-1 text-center text-sm xl:text-base'>
            ${price}
          </div>
          <div className='flex w-14 mt-2 items-center justify-around self-center rounded-full border border-charcoal lg:w-16  xl:w-24'>
            <img
              src={minus}
              alt='minus-icon'
              onClick={handleDecrement}
              className='h-3 lg:h-3 xl:h-5'
            />
            <span className='lg:text-md font-grotesque  text-sm lg:px-2 xl:px-4 xl:text-lg'>
              {count}
            </span>
            <img
              src={plus}
              alt='plus-icon'
              onClick={handleIncrement}
              className='h-3 lg:h-3 xl:h-5'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
