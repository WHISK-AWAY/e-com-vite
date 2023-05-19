import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserCart, selectCart } from '../redux/slices/cartSlice';
import { useParams } from 'react-router';

export default function Cart() {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const { userId } = useParams();



  // console.log('userCart', userCart);
  // console.log('usercartdotsomething', userCart.cart.cart.products[0].product.productName)
  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);

  return <div>
    <h1>cart</h1>
  </div>;
}
