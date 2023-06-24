import { TOrder } from '../../redux/slices/orderSlice';
import OrderHistoryProductCard from './OrderHistoryProductCard';
import x from '../../assets/icons/x.svg';

export type OrderHistoryDetailProps = {
  order: TOrder;
  setDetailOrder: React.Dispatch<React.SetStateAction<TOrder | null>>;
};

export default function OrderHistoryDetail({
  order,
  setDetailOrder,
}: OrderHistoryDetailProps) {
  return (
    <div className='order-detail-wrapper relative h-full w-full bg-slate-200'>
      <img
        className='absolute right-0 top-0 cursor-pointer'
        onClick={() => setDetailOrder(null)}
        src={x}
        alt='return to summary'
      />
      <h2 className='font-marcellus text-base uppercase'>order {order._id}</h2>
      <h3 className='text-sm'>
        placed {new Date(order.date).toLocaleDateString()}
      </h3>
      <div className='product-listing flex flex-col items-center gap-2'>
        {order.orderDetails.map((product) => (
          <OrderHistoryProductCard key={product.productId} product={product} />
        ))}
      </div>
      <div className='total-info'>
        <p>Subtotal: ${order.subtotal?.toFixed(2)}</p>
        <p>Discount: ${(order.total! - order.subtotal!).toFixed(2)}</p>
        <p>Order Total: ${order.total?.toFixed(2)}</p>
      </div>
    </div>
  );
}

// (
//   <div className='order-card' key={order._id}>
//     <h2>Order Date: {new Date(order.date).toLocaleDateString()}</h2>
//     <p>
//       Status: <span className='text-red-600'>{order.orderStatus}</span>
//     </p>
//     <p>Order subtotal: {order.subtotal}</p>
//     <p>
//       Discount from promo:{' '}
//       {(order.total! - order.subtotal!).toLocaleString()}
//     </p>
//     <p className='text-green-500'>Total: {order.total}</p>
//     <div className='products'>
//       <h2 className='uppercase underline'>Order Details:</h2>
//       {order.orderDetails.map((prod) => (
//         <div className='product-detail' key={prod.productId}>
//           <p>Product name: {prod.productName}</p>
//           <div className='product-image'>
//             <img src={prod.imageURL} alt='probably a kisa' />
//           </div>
//           <p>Product s-desc: {prod.productShortDesc}</p>
//           <p>Qty: {prod.qty}</p>
//           <p>Unit price: {prod.price}</p>
//           <p>Line tot: {(prod.price * prod.qty).toLocaleString()}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// )
