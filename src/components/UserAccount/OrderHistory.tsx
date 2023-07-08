import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TOrder, fetchAllOrders } from '../../redux/slices/orderSlice';
import OrderHistorySummary from './OrderHistorySummary';
import OrderHistoryDetail from './OrderHistoryDetail';
import { getUserId } from '../../redux/slices/authSlice';

export default function OrderHistory() {
  const dispatch = useAppDispatch();
  const [detailOrder, setDetailOrder] = useState<TOrder | null>(null);
  const allOrders = useAppSelector((state) => state.order.allOrders);
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) dispatch(fetchAllOrders(userId));
    // else dispatch(getUserId());
  }, [userId]);

  // if (orderState.loading) return <h1>Loading orders history...</h1>;
  return (
    <div className='history-container max-h-full max-w-[50vw] p-4 font-marcellus text-xs lg:text-sm xl:text-xl'>
      {allOrders?.length > 0 ? (
        !detailOrder ? (
          <OrderHistorySummary
            allOrders={allOrders}
            setDetailOrder={setDetailOrder}
          />
        ) : (
          <OrderHistoryDetail
            order={detailOrder}
            setDetailOrder={setDetailOrder}
          />
        )
      ) : (
        <h1 className='text-center text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'>
          No orders found.
        </h1>
      )}
    </div>
  );
}
