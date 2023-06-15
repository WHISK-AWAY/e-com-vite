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
  // console.log('UID from cart', userId);

  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);

  if (!userCart.cart.products?.length) return <p>Your cart is empty</p>

  return (
    <section className='cart-container h-screen fixed right-0 top-0 z-10  flex w-[100vw] flex-col overflow-hidden bg-[#35403F]/50'>
      <div className='flex max-w-[40vw] flex-col self-end h-full  bg-white 2xl:max-w-[40vw] '>
        <div className='flex flex-col  items-center justify-start h-full lg:gap-4 '>
          <div className='header w-full border-b border-charcoal pt-5'>
            <h1 className='flex justify-center pb-3 font-italiana text-base lg:text-2xl'>
              YOUR CART (
              {userCart.cart.products.reduce((total, product) => {
                return total + product.qty;
              }, 0)}
              )
            </h1>

            <img
              src={x}
              alt='x-icon'
              className='absolute right-0 top-6 h-3 w-10 lg:h-5'
              onClick={() => setIsCartHidden((prev) => !prev)}
            />
          </div>

          <div className='h-full overflow-hidden w-full p-6  lg:p-10'>
            <div className='flex overflow-hidden h-full w-full flex-col justify-between border  border-charcoal p-5 lg:p-10 '>
              <div className='flex flex-col overflow-auto h-full gap-6'>
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

              <div className='flex flex-col items-center justify-end  gap-3 pt-5 border-t-[0.75px] border-charcoal/80'>
                <div className='font-italiana text-base lg:text-base xl:text-xl '>
                  subtotal: ${userCart.cart.subtotal}
                </div>
                <Link
                  to={'/checkout'}
                  className='rounded-sm bg-charcoal px-6  py-3 text-center  font-italiana text-base text-white lg:px-10 xl:px-14 xl:text-xl'
                >
                  PROCEED TO CHECKOUT
                </Link>
                {/* <Recap userCart={userCart}/> */}

                <Link
                  to={'/shop-all'}
                  className='w-fit border border-charcoal px-6 font-italiana text-sm lg:py-1  xl:text-base '
                >
                  continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
