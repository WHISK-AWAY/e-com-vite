import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useNavigate, useParams } from 'react-router';
import { fetchAllOrders } from '../../../redux/slices/orderSlice';

export default function AdminUserOrderHistory() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const userOrders = useAppSelector((state) => state.order.allOrders);

  useEffect(() => {
    if (userId) dispatch(fetchAllOrders(userId));
  }, [userId]);

  if (!userId) return <h1>UserID not found...</h1>;
  if (!userOrders.length) return <h1>No orders found...</h1>;
  return (
    <main>
      <h1>USER ORDER HISTORY</h1>
      <table>
        <thead>
          <tr>
            <th className='pr-10'>ORDER ID</th>
            <th className='pr-10'>STATUS</th>
            <th className='pr-10'>DATE</th>
            <th colSpan={2}>PROMO</th>
            <th className='pr-10'>SUBTOTAL</th>
            <th className='pr-10'>DISCOUNT</th>
            <th className='pr-10'>TOTAL</th>
            <th className='pr-10'>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {userOrders.map((order) => (
            <tr key={order._id}>
              <td className='pr-5'>{order._id}</td>
              <td className='pr-5'>{order.orderStatus}</td>
              <td className='pr-5'>
                {' '}
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className='pr-5'>{order.promoCode?.promoCodeName}</td>
              <td className='pr-5'>
                {order.promoCode?.promoCodeRate
                  ? (order.promoCode.promoCodeRate * 100).toFixed(1) + '%'
                  : ''}
              </td>
              <td>{order.subtotal?.toLocaleString()}</td>
              <td>{(order.total! - order.subtotal!).toLocaleString()}</td>
              <td>{order.total!.toLocaleString()}</td>
              <td
                className='cursor-pointer'
                onClick={() =>
                  navigate(`/admin/users/${userId}/order/${order._id}/details`)
                }
              >
                (view)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
