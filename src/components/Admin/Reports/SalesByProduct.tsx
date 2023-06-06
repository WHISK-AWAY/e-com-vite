import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

// Chart shit
import {
  BarElement,
  BubbleDataPoint,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Point,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  fetchReportOrders,
  fetchReportProducts,
  selectReportOrders,
  selectReportProducts,
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
    // legend: {
    //   position: 'top' as const,
    // },
    title: {
      display: true,
      text: 'Sales by Product (all time)',
    },
  },
};

export default function SalesByProduct() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectReportProducts);
  const [labels, setLabels] = useState<string[]>();
  const [figures, setFigures] = useState<number[]>();
  const [data, setData] =
    useState<
      ChartData<
        'bar',
        (number | [number, number] | Point | BubbleDataPoint | null)[],
        unknown
      >
    >();

  useEffect(() => {
    dispatch(fetchReportProducts());
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      let tempProducts = [...products].sort(
        (a, b) => b.saleCount - a.saleCount
      );
      let tempLabels = tempProducts.map((prod) => prod.productName);
      let tempData = tempProducts.map((prod) => prod.saleCount);
      setLabels(tempLabels);
      setFigures(tempData);
    }
  }, [products]);

  useEffect(() => {
    if (labels?.length && figures?.length) {
      setData({
        labels,
        datasets: [
          {
            label: 'Product Sales (count)',
            data: figures,
            backgroundColor: 'rgba(50, 50, 50, 0.8)',
          },
        ],
      });
    }
  }, [labels, figures]);

  // const allProducts = dispatch()
  if (!products.length) return <h1>Loading orders...</h1>;
  if (!data) return <h1>Loading data...</h1>;

  return (
    <>
      <header>
        <h1>Sales by Product</h1>
      </header>
      <main className='h-screen w-[80vw]'>
        <Bar options={options} data={data} />
      </main>
    </>
  );
}
