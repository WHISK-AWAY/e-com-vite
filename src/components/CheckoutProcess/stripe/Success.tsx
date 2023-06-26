import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getUserId, selectAuthUserId } from '../../../redux/slices/authSlice';
import {
  createOrder,
  fetchGuestOrder,
  fetchSingleOrder,
  resetOrderState,
  selectOrderState,
  updateGuestOrder,
  updateOrder,
} from '../../../redux/slices/orderSlice';
import { useEffect } from 'react';
import { selectSingleUser } from '../../../redux/slices/userSlice';
import { useSearchParams } from 'react-router-dom';
import towel from '../../../assets/bg-img/order-confirmation/towel.jpg';
import hands from '../../../assets/bg-img/order-confirmation/hands.jpg';
import ladyBack from '../../../assets/bg-img/order-confirmation/lady-back.jpg';

// * 4242 4242 4242 4242
export default function Success() {
  const dispatch = useAppDispatch();
  const [params, _] = useSearchParams();
  const userId = useAppSelector(selectAuthUserId);
  const { singleOrder } = useAppSelector(selectOrderState);
  const userOrder = useAppSelector(selectOrderState);
  const orderId = params.get('order');
  // const user = useAppSelector(selectSingleUser);

  // useEffect(() => {
  //   if (userId && userOrder.singleOrder?._id)
  //     dispatch(updateOrder({ userId, orderId: userOrder.singleOrder?._id }));
  // }, [userId, userOrder.singleOrder]);

  console.log('SINGLE LIKE YOU', singleOrder);

  useEffect(() => {
    if (orderId) {
      dispatch(getUserId()).then(() => {
        if (userId) {
          dispatch(updateOrder({ userId, orderId })).then(() =>
            dispatch(fetchSingleOrder({ userId, orderId }))
          );
        } else {
          dispatch(updateGuestOrder({ orderId })).then(() =>
            dispatch(fetchGuestOrder(orderId))
          );
        }
      });
    }
  }, [userId, orderId]);

  if (!singleOrder)
    return (
      <div>
        <h1>not hooray</h1>
      </div>
    );

  return (
    <div className='order-confirmation flex flex-col py-3'>
      <div className='flex w-[100vw] flex-col items-center justify-center self-center '>
        <h1 className='flex w-[45%] justify-center  rounded-sm border-x border-t border-charcoal py-1 font-italiana text-lg tracking-wide'>
          ORDER CONFIRMATION
        </h1>
        <div className='flex h-[40vh] w-[75%] flex-col items-center justify-between border border-charcoal'>
          <div className='flex h-[85%] flex-col items-center'>
            <p className='py-[1%] font-hubbali'>
              sit back and relax, your order is on its way
            </p>

            <div className='flex h-[75%] justify-center gap-2 object-cover'>
              <img className='' src={hands} alt='' />
              <img src={towel} alt='' />
              <img src={ladyBack} alt='' />
            </div>
          </div>

          <p className=' pb-2 font-marcellus text-sm uppercase'>
            order confirmation #{userOrder.singleOrder?._id}
          </p>
        </div>
      </div>

      <div className='total-container flex  h-[20%] w-[35%] justify-center self-center border-x border-b  border-charcoal '>
        <div className='flex flex-col items-start py-1 font-marcellus text-sm uppercase'>
          <p className=''>
            order subtotal <span className='pl-3'>${singleOrder.subtotal}</span>{' '}
          </p>
          {singleOrder.promoCode && (
            <>
              <p>
                discount: -
                {(
                  singleOrder.subtotal! *
                    singleOrder.promoCode?.promoCodeRate || 0
                ).toFixed(2)}
              </p>
              <h2>
                Order Total:{' '}
                {(
                  singleOrder.total! *
                  (1 - singleOrder.promoCode?.promoCodeRate)
                ).toFixed(2)}
              </h2>
            </>
          )}
          <p>
            total <span className='pl-3'>${singleOrder.total}</span>{' '}
          </p>
        </div>
      </div>g

      <div className='details-shipping section flex w-[65%] flex-col justify-center gap-5 self-center pt-5  lg:flex-row'>
        <div className='order details flex flex-col'>
          <h2 className='order-details w-[70%] self-center border-x border-t border-charcoal py-[2%] text-center font-italiana text-l uppercase'>
            order details
          </h2>

          <div className='flex flex-col  border border-charcoal p-[5%] bg-blue-200'>
            {singleOrder.orderDetails.map((item) => (
              <div className='order-detail-item items-start self-center' key={item.productId} >
                <div className='flex  gap-4'>
                  <img src={item.imageURL} className='h-20 aspect-[3/4] ' />

                  <div className='flex flex-col items-center text-center self-center '>
                    <p className='font-marcellus text-xs uppercase'>
                      {' '}
                      {item.productName}
                    </p>
                    <p className='font-grotesque'>{item.qty}</p>
                    <p className='font-grotesque'>${item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='shipping flex flex-col'>
          <h2 className='w-[80%] font-italiana self-center border-x border-t border-charcoal py-[2%] text-center text-lg uppercase'>
            shipping address
          </h2>
          <div className='flex w-full flex-col items-center border border-charcoal px-5 py-[4%] uppercase font-marcellus text-xs leading-6'>
            <p>{singleOrder.user?.shippingInfo?.firstName}</p>
            <p>{singleOrder.user?.shippingInfo?.email}</p>
            <p>{singleOrder.user?.shippingInfo?.address_1}</p>
            <p>
              {singleOrder.user?.shippingInfo?.address_2
                ? singleOrder.user?.shippingInfo?.address_2
                : ''}
            </p>
            <p>{singleOrder.user?.shippingInfo?.city}</p>
            <p>{singleOrder.user?.shippingInfo?.state}</p>
            <p>{singleOrder.user?.shippingInfo?.zip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
