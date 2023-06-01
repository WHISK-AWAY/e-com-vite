import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserCart, selectCart } from '../redux/slices/cartSlice';
import CartItem from './CartItem';

export default function Cart() {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const { userId } = useParams();

  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);

  if (!userCart.cart.products?.length) return <p>Your cart is empty</p>;

  return (
    <section className="cart-container">
      <h1>
        YOUR CART (
        {userCart.cart.products.reduce((total, product) => {
          return total + product.qty;
        }, 0)}
        )
      </h1>

      <br />
      <div>
        {userCart.cart.products.map(({ product, qty }) => {
          return (
            <CartItem
              product={product}
              qty={qty}
              userId={userId!}
              key={product._id}
            />
          );
        })}
      </div>

      <div>Subtotal:{userCart.cart.subtotal}</div>

      <Link to={'/checkout'} className="bg-teal-700">
        RECAP
      </Link>
      {/* <Recap userCart={userCart}/> */}
      <br />
      <Link to={'/shop-all'}>back to shopping</Link>
    </section>
  );
}
