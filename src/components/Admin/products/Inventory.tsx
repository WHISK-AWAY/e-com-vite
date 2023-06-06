import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  adminSelectAllProducts,
  adminFetchAllProducts,
  adminDeleteSingleProduct,
} from '../../../redux/slices/admin/productsSlice';
import { TProduct } from '../../../redux/slices/allProductSlice';
import { Link } from 'react-router-dom';

export default function Inventory() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(adminSelectAllProducts);

  useEffect(() => {
    dispatch(adminFetchAllProducts());
  }, []);

  console.log('allprods', allProducts);

  if (!allProducts.allProducts.products?.length) return <p>...Loading</p>;

  return (
    <section className='products-section'>
      <table>
        <thead>
          <tr>
            <th colSpan={5}>PRODUCTS</th>
          </tr>
          <tr>
            <td>PRODUCT ID</td>
            <td>PRODUCT NAME</td>
            <td>PRODUCT QTY</td>
            <td>PRODUCT PRICE</td>
            <td>SALE COUNT</td>
          </tr>
        </thead>
        <tbody>
          {allProducts.allProducts.products.map((product) => {
            return (
              <tr key={product._id}>
                <td>{product._id}</td>
                <Link to={`/product/${product._id}`}>
                  <td className='text-blue-700'>{product.productName}</td>
                </Link>
                <td>{product.qty}</td>
                <td>{product.price}</td>
                <td>{product.saleCount}</td>
                <Link to={`/admin/product/${product._id}`} className='pr-2'>EDIT</Link>
                
               <button onClick={async()=> {await dispatch(adminDeleteSingleProduct( product._id)); await dispatch(adminFetchAllProducts())}}>DELETE</button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
