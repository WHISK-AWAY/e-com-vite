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
      <div className=' flex  justify-between '>
        <img
          className='aspect-[3/4] lg:h-48 h-32 w-4/12 object-cover'
          src={
            images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || images[0].imageURL
          }
        />
        <div className='relative flex flex-col w-8/12 items-center'>
          <img
            src={x}
            alt='x-icon'
            onClick={() => handleRemove(_id, qty)}
            className='absolute right-0 top-0 lg:h-3 lg:w-3 h-2 w-3'
          />
       

          <h4 className='top-10 lg:mt-10 mt-5 mb-2 lg:mx-1 text-center font-hubbali  lg:text-md xl:text-xl text-sm uppercase'>
            {productName}
          </h4>
          <div className='text-center font-grotesque lg:text-md xl:text-lg  text-sm mb-1'>${price}</div>
          < div className='flex xl:w-24 lg:w-16 w-14 items-center self-center rounded-full border justify-around  border-charcoal'>
            <img
              src={minus}
              alt='minus-icon'
              onClick={handleDecrement}
              className='xl:h-5 lg:h-3 h-3'
              />
            <span className='xl:px-4 lg:px-2  font-grotesque xl:text-lg lg:text-md text-sm'>{count}</span>
            <img
              src={plus}
              alt='plus-icon'
              onClick={handleIncrement}
              className='xl:h-5 lg:h-3 h-3'
              />
          
        </div>
              </div>
      </div>
    </div>
  );
}
