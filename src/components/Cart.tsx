import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserCart, selectCart } from '../redux/slices/cartSlice';
import CartItem from './CartItem';
import x from '../../src/assets/icons/x.svg';
import { selectAuthUserId } from '../redux/slices/authSlice';

export default function Cart({
  setIsCartHidden,
}: {
  setIsCartHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const userId = useAppSelector(selectAuthUserId);
  console.log('UID from cart', userId);

  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);

  if (!userCart.cart.products?.length) return <p>Your cart is empty</p>;

  return (
    <section className='cart-container absolute right-0 top-0 z-10 flex h-[100vh] w-[100vw] flex-col bg-[#35403F]/50 '>
      <div className='flex h-full max-w-[40vw] flex-col self-end bg-white'>
        <div className='flex flex-col justify-center border border-red-700  pt-5'>
          <h1 className='flex justify-center pb-3 font-italiana text-2xl '>
            YOUR CART (
            {userCart.cart.products.reduce((total, product) => {
              return total + product.qty;
            }, 0)}
            )
          </h1>
            <div className=' border-b border-blue-500 w-full'>
          <img
            src={x}
            alt='x-icon'
            className='absolute right-0 top-6 h-5 w-10'
            onClick={() => setIsCartHidden((prev) => !prev)}
          />
        </div>

          <div className='h-full border m-10 border-green-400 '>
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

          <div>Subtotal:{userCart.cart.subtotal}</div>

          <div className='flex h-full flex-col items-center gap-3'>
            <Link
              to={'/checkout'}
              className='rounded-sm bg-charcoal px-10 py-3  text-center font-italiana text-xl text-white'
            >
              PROCEED TO CHECKOUT
            </Link>
            {/* <Recap userCart={userCart}/> */}

            <Link
              to={'/shop-all'}
              className='w-fit border border-charcoal px-6 py-2 font-italiana '
            >
              continue shopping
            </Link>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
