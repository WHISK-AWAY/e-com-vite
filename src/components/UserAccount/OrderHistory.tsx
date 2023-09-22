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
    // else dispatch(getUserId());
  }, [userId]);

  // if (orderState.loading) return <h1>Loading orders history...</h1>;
  return (
    <div className="history-container max-h-[60svh] max-w-[65vw] bg-white p-4 font-grotesque text-xs 5xl:text-base portrait:max-w-[100%] ">
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
        <h1 className="text-center text-xs lg:text-base xl:text-lg ">
          No orders found.
        </h1>
      )}
    </div>
  );
}
