import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAllProducts } from '../redux/slices/allProductSlice';

export default function AllProducts() {
  const dispatch = useAppDispatch();

  const allProducts = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);

  useEffect(() => {
    if (allProducts.error.status) {
      console.log('something happened');
    }
  }, [allProducts]);

  return (
    <div>
      <h1>shop all</h1>
    </div>
  );
}
