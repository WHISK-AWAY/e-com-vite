import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TOrder, fetchAllOrders } from '../../redux/slices/orderSlice';
import OrderHistorySummary from './OrderHistorySummary';
import OrderHistoryDetail from './OrderHistoryDetail';

export default function OrderHistory() {
  const dispatch = useAppDispatch();
  const [detailOrder, setDetailOrder] = useState<TOrder | null>(null);
  const allOrders = useAppSelector((state) => state.order.allOrders);
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) dispatch(fetchAllOrders(userId));
  }, [userId]);

  // if (orderState.loading) return <h1>Loading orders history...</h1>;
  if (!allOrders?.length) return <h1>No orders found.</h1>;

  return (
    <div className='history-container max-h-full w-[50vw] font-marcellus text-xs lg:text-sm xl:text-xl'>
      {!detailOrder ? (
        <OrderHistorySummary
          allOrders={allOrders}
          setDetailOrder={setDetailOrder}
        />
      ) : (
        <OrderHistoryDetail
          order={detailOrder}
          setDetailOrder={setDetailOrder}
        />
      )}
    </div>
  );
}
