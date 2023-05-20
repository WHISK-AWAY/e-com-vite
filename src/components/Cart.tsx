import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserCart, selectCart, removeFromCart } from '../redux/slices/cartSlice';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './CartItem';

export default function Cart() {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const { userId } = useParams();
  const navigate = useNavigate();

  // console.log('usercart', userCart);
  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);


  const handleCheckout = () => {
    navigate('/checkout')
  }


  if(!userCart.cart.products) return <p>...Loading</p>
  return (
    <section className='cart-container'>
      <h1>YOUR CART ({userCart.cart.products.reduce((total, product) => {
        return total + product.qty
      }, 0)})</h1>

<br/>
      <div>
        {userCart.cart.products.map(({ product, qty}) => {
        return   <CartItem product={product} qty={qty} userId={userId!}  key={product._id}/>;
        })}
      </div>
     
      <div>Subtotal:{userCart.cart.subtotal}</div>
      <button onClick={handleCheckout}>CHECKOUT</button>
      <br/>
      <Link to={'/shop-all'}>back to shopping</Link>
    </section>
  );
}
