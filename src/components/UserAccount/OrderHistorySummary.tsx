import React from 'react';
import { TOrder } from '../../redux/slices/orderSlice';
import x from '../../assets/icons/x.svg';

export type OrderHistorySummaryProps = {
  allOrders: TOrder[];
  setDetailOrder: React.Dispatch<React.SetStateAction<TOrder | null>>;
};

export default function OrderHistorySummary({
  allOrders,
  setDetailOrder,
}: OrderHistorySummaryProps) {
  return (
    <div className='grid-wrapper group-[header] grid grid-cols-6 justify-around gap-x-1'>
      <div className='order-date-header border-b border-charcoal'>
        Order Date
      </div>
      <div className='order-date-header place-self-end border-b border-charcoal'>
        Order No.
      </div>
      <div className='order-subtotal-header place-self-end border-b border-charcoal'>
        Subtotal
      </div>
      <div className='order-discount-header place-self-end border-b border-charcoal'>
        Discount
      </div>
      <div className='order-total-header place-self-end border-b border-charcoal'>
        Total
      </div>
      <div className='order-total-header place-self-end border-b border-charcoal'>
        Details
      </div>
      {allOrders.map((order) => (
        <React.Fragment key={order._id}>
          <div className='order-date'>
            {new Date(order.date).toLocaleDateString()}
          </div>
          <div className='order-number place-self-end'>
            {'...' + order._id?.slice(-5)}
          </div>
          <div className='order-subtotal place-self-end'>
            {order.subtotal!.toFixed(2)}
          </div>
          <div className='order-discount place-self-end'>
            {(order.total! - order.subtotal!).toFixed(2)}
          </div>
          <div className='order-total place-self-end'>
            {order.total!.toFixed(2)}
          </div>
          <button
            className='place-self-center'
            onClick={() => {
              setDetailOrder(order);
            }}
          >
            <img src={x} alt='view order details' />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
