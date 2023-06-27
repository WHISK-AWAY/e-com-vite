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

  useEffect(() => {
    dispatch(fetchUserCart(userId));
  }, [userId]);


  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return (() => {
      document.body.style.overflow = ''
    })
  }, [])


  return (
    <section className='cart-container fixed right-0 top-0 z-10 flex  h-screen w-[100vw] flex-col overflow-hidden bg-[#35403F]/50'>
      <div className='flex h-full max-w-[40vw]  flex-col self-end  bg-white 2xl:max-w-[40vw] '>
        <div className='flex h-full flex-col items-center justify-start lg:gap-4 '>
          <div className='header w-full border-b border-charcoal pt-5'>
            <h1 className='flex justify-center pb-3 font-italiana text-base lg:text-2xl'>
              {userCart.cart.products?.length
                ? 'YOUR CART' +
                 ` (${
                userCart.cart.products.reduce((total, product) => {
                  return total + product.qty;
                }, 0)})`
                : 'YOUR CART'}
            </h1>

            <img
              src={x}
              alt='x-icon'
              className='absolute right-0 top-6 h-3 w-10 lg:h-5'
              onClick={() => setIsCartHidden((prev) => !prev)}
            />
          </div>

          <div className='h-full w-full overflow-hidden p-6  lg:p-10'>
            <div className='flex h-full w-full flex-col justify-between overflow-hidden border  border-charcoal p-5 lg:p-10 '>
              {userCart.cart.products?.length ? (
                <div className='flex h-full flex-col gap-6 overflow-auto no-scrollbar'>
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
              ) : (
                <span className='text-center font-marcellus md:text-sm'>
                  you don't have any products in your cart
                </span>
              )}

              <div className='flex flex-col items-center justify-end  gap-3 border-t-[0.75px] border-charcoal/80 pt-5'>
                {userCart.cart.subtotal > 0 && (
                  <div className='font-italiana text-base lg:text-base xl:text-xl '>
                    subtotal: ${userCart.cart.subtotal}
                  </div>
                )}

                {userCart.cart.products?.length ? (
                  <Link
                    to={'/checkout'}
                    className='rounded-sm bg-charcoal px-6  py-3 text-center  font-italiana text-base text-white lg:px-10 xl:px-14 xl:text-xl'
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                ) : (
                  ''
                )}

                {/* <Recap userCart={userCart}/> */}

                <Link
                  to={'/shop-all'}
                  onClick={() => setIsCartHidden(true)}
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
