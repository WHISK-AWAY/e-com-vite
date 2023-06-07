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
            <th>ORDER ID</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th colSpan={2}>PROMO</th>
            <th>SUBTOTAL</th>
            <th>DISCOUNT</th>
            <th>TOTAL</th>
            <th>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {userOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.promoCode?.promoCodeName}</td>
              <td>
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
                  navigate(`/admin/users/${userId}/orders/details`)
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
