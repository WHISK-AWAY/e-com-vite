import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserCart, selectCart } from '../redux/slices/cartSlice';
import CartItem from './CartItem';
import x from '../../src/assets/icons/x.svg';
import { selectAuthUserId } from '../redux/slices/authSlice';

export default function Cart({
  setIsHidden,
}: {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const userId = useAppSelector(selectAuthUserId);

  useEffect(() => {
    dispatch(fetchUserCart(userId));
  }, [userId]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start lg:gap-4'>
      <div className='header w-full border-b border-charcoal pt-5'>
        <h1 className='flex justify-center pb-3 font-italiana text-base lg:text-2xl'>
          {userCart.cart.products?.length
            ? 'YOUR CART' +
              ` (${userCart.cart.products.reduce((total, product) => {
                return total + product.qty;
              }, 0)})`
            : 'YOUR CART'}
        </h1>

        <img
          src={x}
          alt='x-icon'
          className='absolute right-0 top-6 h-3 w-10 cursor-pointer lg:h-5'
          onClick={() => setIsHidden(true)}
        />
      </div>

      <div className='m-10 flex h-full w-10/12 flex-col justify-between overflow-hidden border border-charcoal p-3 lg:p-10 '>
        {userCart.cart.products?.length ? (
          <div className='no-scrollbar flex h-full flex-col gap-6 overflow-auto'>
            {userCart.cart.products.map(({ product, qty }) => {
              return (
                <CartItem
                  product={product}
                  qty={qty}
                  userId={userId!}
                  key={product._id}
                  setIsHidden={setIsHidden}
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
              onClick={() => setIsHidden(true)}
              className='rounded-sm bg-charcoal px-6 py-3 text-center font-italiana text-xs text-white lg:px-10 lg:text-sm xl:px-14 xl:text-lg 2xl:text-xl'
            >
              PROCEED TO CHECKOUT
            </Link>
          ) : (
            ''
          )}

          {/* <Recap userCart={userCart}/> */}

          <Link
            to={'/shop-all'}
            onClick={() => setIsHidden(true)}
            className='w-fit border border-charcoal px-6 font-italiana text-xs lg:py-1 lg:text-sm xl:text-base 2xl:px-10 2xl:text-lg'
          >
            continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
