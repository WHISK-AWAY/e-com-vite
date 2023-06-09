import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAllOrders,
  selectOrderState,
} from '../../redux/slices/orderSlice';

export default function OrderHistory() {
  const dispatch = useAppDispatch();
  const orderState = useAppSelector(selectOrderState);
  const userId = useAppSelector((state) => state.auth.userId);
  const allOrders = orderState.allOrders;

  useEffect(() => {
    if (userId) dispatch(fetchAllOrders(userId));
  }, [userId]);

  if (!allOrders?.length) return <h1>No orders in history...</h1>;

  return (
    <div>
      <h1>ORDER HISTORY</h1>
      <div className='history-container'>
        {allOrders.map((order) => {
          // ! we can probably re-use some product card here
          return (
            <div className='order-card' key={order._id}>
              <h2>Order Date: {new Date(order.date).toLocaleDateString()}</h2>
              <p>
                Status:{' '}
                <span className='text-red-600'>{order.orderStatus}</span>
              </p>
              <p>Order subtotal: {order.subtotal}</p>
              <p>
                Discount from promo:{' '}
                {(order.total! - order.subtotal!).toLocaleString()}
              </p>
              <p className='text-green-500'>Total: {order.total}</p>
              <div className='products'>
                <h2 className='uppercase underline'>Order Details:</h2>
                {order.orderDetails.map((prod) => (
                  <div className='product-detail' key={prod.productId}>
                    <p>Product name: {prod.productName}</p>
                    <div className='product-image'>
                      <img src={prod.imageURL} alt='probably a kisa' />
                    </div>
                    <p>Product s-desc: {prod.productShortDesc}</p>
                    <p>Qty: {prod.qty}</p>
                    <p>Unit price: {prod.price}</p>
                    <p>Line tot: {(prod.price * prod.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
