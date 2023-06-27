import { useEffect, useRef } from 'react';
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
  const address = order.user.shippingInfo;
  const topElement = useRef<HTMLHeadingElement | null>(null); // h2

  useEffect(() => {
    if (topElement) {
      topElement.current?.scrollIntoView(false);
    }
  });

  return (
    <div className='order-detail-wrapper relative h-full w-full pb-10 font-marcellus text-xs lg:text-base xl:text-lg 2xl:text-xl'>
      <img
        className='absolute right-0 top-0 cursor-pointer'
        onClick={() => setDetailOrder(null)}
        src={x}
        alt='return to summary'
      />
      <h2 ref={topElement} className='text-center uppercase'>
        order no. {order._id}
      </h2>
      <aside className='text-center text-[0.5rem] italic lg:text-xs xl:text-sm'>
        placed {new Date(order.date).toLocaleDateString()}
      </aside>
      <div className='product-listing mb-6 flex flex-col items-center gap-2 p-4'>
        {order.orderDetails.map((product) => (
          <OrderHistoryProductCard key={product.productId} product={product} />
        ))}
      </div>
      <div className='total-info mx-auto grid w-fit grid-cols-2 gap-x-2'>
        <div>Subtotal:</div>
        <div className='place-self-end pr-1'>
          {' '}
          ${order.subtotal?.toFixed(2)}
        </div>
        <div>Discount:</div>
        <div className='place-self-end'>
          {/* the math here is intentionally backwards to prevent negative sign */}
          (${(order.subtotal! - order.total!).toFixed(2)})
        </div>
        <div className='font-semibold'>Order Total:</div>
        <div className='mb-6 place-self-end border-t border-charcoal font-semibold'>
          ${order.total?.toFixed(2)}
        </div>
      </div>
      <div className='shipping-info mx-auto mt-6 flex w-4/5 flex-col items-center'>
        <h3 className='w-3/5 border border-b-0 border-charcoal py-1 text-center font-italiana text-2xl uppercase'>
          delivery address
        </h3>
        <div className='address-wrapper grid w-full grid-cols-[2fr,_3fr] border border-charcoal xl:grid-cols-[1fr,_3fr]'>
          <div className='address-label-column grid h-full grid-cols-1 place-items-start items-center gap-2 border-r border-charcoal bg-white py-5 pl-[25%]'>
            <p className=''>full name</p>
            <p className=''>email</p>
            <p className=''>address 1</p>
            <p className=''>address 2</p>
            <p className=''>city</p>
            <p className=''>state</p>
            <p className=''>zip</p>
          </div>
          <div className='address-component-column grid h-full grid-cols-1 place-items-start items-center gap-2 bg-white py-5 pl-[10%]'>
            <p className='uppercase'>
              {address.firstName} {address.lastName}
            </p>

            <p className='uppercase'>{address.email}</p>
            <p className='uppercase'>{address.address_1}</p>
            <p className='uppercase'>
              {address.address_2 ? address.address_2 : '-'}
            </p>
            <p className='uppercase'>{address.city}</p>
            <p className='uppercase'>{address.state}</p>
            <p className='uppercase'>{address.zip}</p>
          </div>
        </div>
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
