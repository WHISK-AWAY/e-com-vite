import React from 'react';
import { TOrder } from '../../redux/slices/orderSlice';

export type OrderHistorySummaryProps = {
  allOrders: TOrder[];
  setDetailOrder: React.Dispatch<React.SetStateAction<TOrder | null>>;
};

const columnHeaders = [
  'order no.',
  'order date',
  'subtotal',
  'discount',
  'total',
  'details',
];

export default function OrderHistorySummary({
  allOrders,
  setDetailOrder,
}: OrderHistorySummaryProps) {
  return (
    <div className="grid-wrapper grid grid-cols-6 place-items-stretch justify-around text-center portrait:w-full portrait:grid-cols-4 portrait:md:text-base">
      {columnHeaders.map((col) => (
        <div
          key={col}
          className={`mb-1 border-b border-charcoal font-semibold ${
            ['subtotal', 'discount'].includes(col) ? 'portrait:hidden' : ''
          }`}
        >
          {col}
        </div>
      ))}
      {allOrders.map((order) => (
        <React.Fragment key={order._id}>
          <div className="order-number place-self-center">
            {'...' + order._id?.slice(-5)}
          </div>
          <div className="order-date">
            {new Date(order.date).toLocaleDateString()}
          </div>
          <div className="order-subtotal place-self-end portrait:hidden">
            {order.subtotal!.toFixed(2)}
          </div>
          <div className="order-discount place-self-end portrait:hidden">
            {(order.total! - order.subtotal!).toFixed(2)}
          </div>
          <div className="order-total place-self-end">
            {order.total!.toFixed(2)}
          </div>
          <button
            className="place-self-center"
            onClick={() => {
              setDetailOrder(order);
            }}
          >
            (view)
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
