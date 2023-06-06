import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

// Chart shit
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  fetchReportOrders,
  selectReportOrders,
} from '../../../redux/slices/admin/reportsAdminSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'This is my report.',
    },
  },
};

export default function SalesByProduct() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectReportOrders);
  const [labels, setLabels] = useState<string[]>();

  useEffect(() => {
    dispatch(fetchReportOrders());
  }, []);

  useEffect(() => {
    if (orders.length > 1) {
      const productSet = new Set();
      orders.forEach((order) => {
        order.orderDetails.forEach((product) => {
          // return product name
        });
      });
      // setLabels()
    }
  }, [orders]);

  // const allProducts = dispatch()
  if (!orders.length) return <h1>Loading orders...</h1>;

  return (
    <>
      <header>
        <h1>Sales by Product</h1>
      </header>
      <main>(product sales graph goes here)</main>
    </>
  );
}
