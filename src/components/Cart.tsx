import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserCart, selectCart } from '../redux/slices/cartSlice';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export default function Cart() {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const { userId } = useParams();


  console.log('usercart', userCart);
  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);

  if(!userCart.cart.products) return <p>...Loading</p>
  return <section className='cart-container'>
    <div>{userCart.cart.products.map(({product, qty}) => {
      const {productName, productShortDesc, price, imageURL, brand} = product;
      return <div key={product._id}>
       <div>{productName}</div>
       <div>{brand}</div>
      <img src={imageURL}/>
      <div>{productShortDesc}</div>
      <div>{price}</div>
      <div>{qty}</div>
      <div>Subtotal:{userCart.cart.subtotal}</div>

      </div>
    })}</div>
    <button>CHECKOUT</button>
    <Link to={'/shop-all'}>back to shopping</Link>
  </section>;
}
