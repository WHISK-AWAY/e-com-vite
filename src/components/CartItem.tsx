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
  console.log('USERID', userId);

  useEffect(() => {}, []);
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
    <div className='cart-item-container min-w-[40vw]'>
      <div className=' m-12 flex flex-col  p-6'>
        <img
          className='aspect-[3/4] h-48  w-fit object-cover'
          src={
            images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || images[0].imageURL
          }
        />
        <div className='absolute flex flex-col self-end p-6'>
          <img
            src={x}
            alt='x-icon'
            onClick={() => handleRemove(_id, qty)}
            className='absolute right-10 top-0 h-4'
          />
          <div className='top-10 mt-10 flex  text-center font-hubbali  text-xl uppercase'>
            {productName}
          </div>
          <div className='text-center font-grotesque text-lg '>${price}</div>
          <div className='flex border border-charcoal rounded-full w-24 items-center self-center'>

          <img src={minus} alt='minus-icon' onClick={handleDecrement} className='h-5'/>
          <span className='px-4 font-grotesque text-lg'>{count}</span>
          <img src={plus} alt='plus-icon' onClick={handleIncrement} className='h-5'/>

          </div>
      
        
        </div>
      </div>
    </div>
  );
}
