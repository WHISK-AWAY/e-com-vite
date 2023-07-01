import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getUserId, selectAuthUserId } from '../../../redux/slices/authSlice';
import {
  fetchGuestOrder,
  fetchSingleOrder,
  selectOrderState,
  updateGuestOrder,
  updateOrder,
} from '../../../redux/slices/orderSlice';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import towel from '../../../assets/bg-img/order-confirmation/towel.jpg';
import hands from '../../../assets/bg-img/order-confirmation/hands.jpg';
import ladyBack from '../../../assets/bg-img/order-confirmation/lady-back.jpg';

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
    <div className='order-confirmation flex flex-col pb-[7%] pt-[3%]'>
      <div className='flex w-[100vw] flex-col items-center justify-center self-center '>
        <h1 className='flex w-[45%]  justify-center  rounded-sm border-x border-t border-charcoal py-[1%] font-italiana text-lg tracking-wide 2xl:py-[.5%] '>
          ORDER CONFIRMATION
        </h1>
        <div className='flex h-[35vh] w-[70%] flex-col items-center justify-between border border-charcoal xl:w-[55%]'>
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

          <p className=' pb-2 font-marcellus text-sm uppercase '>
            order confirmation #{userOrder.singleOrder?._id}
          </p>
        </div>
      </div>
      <div className='total-container mb-4  flex h-[20%] w-[35%] justify-center self-center border-x  border-b border-charcoal py-1'>
        <div className='flex flex-col items-start py-1 font-marcellus text-sm uppercase'>
          {singleOrder.promoCode ? (
            <>
              <p className=''>
                order subtotal{' '}
                <span className='pl-3'>${singleOrder.subtotal}</span>{' '}
              </p>
              <p>
                discount
                <span className='pl-3'>
                  -${(singleOrder.subtotal! - singleOrder.total!).toFixed(2)}
                </span>
              </p>
              <h2>
                Order Total{' '}
                <span className='pl-3'>${singleOrder.total?.toFixed(2)}</span>
              </h2>
            </>
          ) : (
            <>
              <p className=''>
                order subtotal{' '}
                <span className='pl-3'>${singleOrder.subtotal}</span>{' '}
              </p>
              <p>
                total <span className='pl-3'>${singleOrder.total}</span>{' '}
              </p>
            </>
          )}
        </div>
      </div>

      <div className='details-shipping section flex h-full w-[55%] flex-col gap-5 self-center pt-5  lg:max-h-96  lg:flex-row lg:justify-between 2xl:w-[40%]'>
        <div className='order details min-h-96 flex w-[50%] flex-col overflow-hidden md:w-full'>
          <h2 className='order-details w-[70%] self-center border-x border-t border-charcoal py-[2%] text-center font-italiana text-lg uppercase '>
            order details
          </h2>

          <div className='flex h-full w-full flex-col overflow-auto  border border-charcoal p-[5%]'>
            {singleOrder.orderDetails.map((item) => (
              <div
                className='order-detail-item flex h-full w-[80%] items-center justify-between self-center xl:w-[90%]'
                key={item.productId}
              >
                <div className='flex w-full flex-row-reverse items-center justify-between gap-4'>
                  <div className='flex w-full flex-col items-center text-center '>
                    <p className='px-[6%] font-marcellus text-xs uppercase'>
                      {' '}
                      {item.productName}
                    </p>
                    <p className='font-grotesque'>{item.qty}</p>
                    <p className='font-grotesque'>${item.price}</p>
                  </div>
                  <img
                    src={item.imageURL}
                    className='my-1  aspect-[3/4] h-20 object-cover lg:my-6 lg:h-28'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='shipping flex  w-[50%] flex-col md:w-full'>
          <h2 className='w-[70%] self-center border-x border-t border-charcoal py-[2%] text-center font-italiana text-lg uppercase '>
            shipping address
          </h2>

          <div className='flex h-full w-full flex-col items-center justify-center self-center border border-charcoal p-[5%] font-marcellus text-sm uppercase leading-9'>
            <p>
              {singleOrder.user?.shippingInfo?.firstName}{' '}
              {singleOrder.user?.shippingInfo?.lastName}
            </p>
            <p></p>
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
