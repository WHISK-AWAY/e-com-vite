import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchUserCart,
  selectCart,
  addToCart,
  removeFromCart,
} from '../redux/slices/cartSlice';
import { useState, useEffect } from 'react';

import type { TProduct } from '../redux/slices/cartSlice';

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
    <div className='cart-item-container'>
      <div>{productName}</div>
      <img
        src={
          images.find((image) => image.imageDesc === 'product-front')
            ?.imageURL || images[0].imageURL
        }
      />
      <div>{productShortDesc}</div>
      <div>{price}</div>

      <button onClick={handleDecrement}>-</button>
      <span>{count}</span>
      <button onClick={handleIncrement}>+</button>
      <br />
      <button onClick={() => handleRemove(_id, qty)}>remove</button>
    </div>
  );
}
