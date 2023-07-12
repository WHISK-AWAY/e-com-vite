import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectSingleOrder,
  fetchSingleOrder,
} from '../../../redux/slices/orderSlice';

export default function AdminOrderDetails() {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectSingleOrder);
  const { orderId } = useParams();
  const { userId } = useParams();

  useEffect(() => {
    if (userId && orderId) dispatch(fetchSingleOrder({ userId, orderId }));
  }, []);

  if (!userId) return <h1>No user ID found...</h1>;
  return (
    <section className='order-history-details'>
      <table>
        <thead>
          <th>ORDER DETAILS</th>
          <br />
          <tr>
            <th className='pr-10'> USER ID </th>
            <th className='pr-10'>PRODUCT ID </th>
            <th className='pr-10'>DATE</th>
            <th className='pr-10'>PRODUCT NAME </th>
            <th className='pr-10'>PRICE </th>
            <th className='pr-10'> QTY </th>
            <th className='pr-10' colSpan={3}>
              DISCOUNT
              <td className='pr-2'>promo code</td>
              <td className='pr-2'>promo rate</td>
              <td className='pr-2'>discount amount</td>
            </th>
            <th className='pr-10'> ORDER SUBTOTAL </th>
            <th className='pr-10'> ORDER TOTAL </th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {order?.orderDetails.map((ord) => {
            return (
              <tr>
                <td className='pr-2'>{userId}</td>
                <td className='pr-2'>{ord.productId}</td>
                <td className='pr-2'>
                  {new Date(order?.date).toLocaleDateString()}
                </td>
                <td className='pr-2'>{ord.productName}</td>
                <td className='pr-2'>{ord.price}</td>
                <td className='pr-2'>{ord.qty}</td>
                <td className='pr-2'>{order?.promoCode?.promoCodeName}</td>
                <td className='pr-2'>{order?.promoCode?.promoCodeRate}</td>
                {order.promoCode ? (
                  <td>-{(order?.subtotal! - order?.total!).toFixed(2)}</td>
                ) : (
                  'No discount'
                )}
                <td className='pr-2'>{order?.subtotal}</td>
                <td className='pr-2'>{order?.total}</td>
                <td>{order?.orderStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </section>
  );
}
