import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAuthUserId } from '../../../redux/slices/authSlice';
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

  useEffect(() => {
    if (orderId) {
      if (userId) {
        dispatch(updateOrder({ userId, orderId })).then(() =>
          dispatch(fetchSingleOrder({ userId, orderId }))
        );
      } else {
        dispatch(updateGuestOrder({ orderId })).then(() =>
          dispatch(fetchGuestOrder(orderId))
        );
      }
    }
  }, [userId, orderId]);

  // function resetOrder() {
  //   dispatch(resetOrderState());
  // }

  // useEffect(() => {
  //   return resetOrder;
  // }, []);
  // useEffect(() => {
  //   if (!userId && orderId) {
  //     dispatch(fetchGuestOrder(orderId)).then(() => {
  //       dispatch(updateGuestOrder({ orderId }));
  //     });
  //   }
  // }, [orderId]);

  if (!singleOrder)
    return (
      <div>
        <h1>not hooray</h1>
      </div>
    );

  return (
    <div className='order-confirmation'>
      <h1>ORDER CONFIRMATION</h1>
      <h1>THANK YOU FOR YOUR PURCHASE</h1>
      <p>order confirmation #{userOrder.singleOrder?._id}</p>
      <h2>Items:</h2>
      {singleOrder.orderDetails.map((item) => (
        <div className='order-detail-item' key={item.productId}>
          <p> {item.productName}</p>
          <img src={item.imageURL} />
          <p>Qty: {item.qty}</p>
          <p>unit price: {item.price}</p>
        </div>
      ))}
      <h2>Subtotal: {singleOrder.subtotal}</h2>
      {singleOrder.promoCode && (
        <>
          <p>
            discount: -
            {(
              singleOrder.subtotal! * singleOrder.promoCode?.promoCodeRate || 0
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
    </div>
  );
}
