import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  adminSelectAllProducts,
  adminFetchAllProducts,
  adminDeleteSingleProduct,
  sort,
  TColumnFields,
} from '../../../redux/slices/admin/adminProductsSlice';
import { Link } from 'react-router-dom';

export default function Inventory() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(adminSelectAllProducts);
  const [column, setColumn] = useState<keyof TColumnFields>('productName');
  const [sortDir, setSortDir] = useState<string>('desc');

  useEffect(() => {
    dispatch(adminFetchAllProducts()).then(() =>
      dispatch(sort({ column, sortDir }))
    );
  }, []);

  useEffect(() => {
    dispatch(sort({ column, sortDir }));
  }, [sortDir, column]);

  const handleSort = (col: keyof TColumnFields) => {
    if (col === column && sortDir === 'desc') {
      setSortDir('asc');
    } else if (col === column && sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setColumn(col);
      setSortDir('desc');
    }
  };

  if (!allProducts.allProducts.products?.length) return <p>...Loading</p>;

  return (
    <section className='products-section'>
      <h1>PRODUCTS</h1>
      <table>
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th
              className='cursor-pointer'
              onClick={() => handleSort('productName')}
            >
              PRODUCT NAME
            </th>
            <th>TAGS</th>
            <th className='cursor-pointer' onClick={() => handleSort('qty')}>
              QTY
            </th>
            <th className='cursor-pointer' onClick={() => handleSort('price')}>
              PRICE
            </th>
            <th
              className='cursor-pointer'
              onClick={() => handleSort('saleCount')}
            >
              SALE COUNT
            </th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody className='pr-10'>
          {allProducts.allProducts.products.map((product) => {
            return (
              <tr key={product._id}>
                <td className='pr-10'>{product._id}</td>
                <td>
                  <Link
                    className='pr-10 text-blue-700'
                    to={`/product/${product._id}`}
                  >
                    {product.productName}
                  </Link>
                </td>
                <td className='pr-10'>
                  {product.tags.length > 0
                    ? product.tags
                        .map((tag) => tag.tagName.toLowerCase())
                        .sort((a, b) => (a > b ? 1 : -1))
                        .join(',')
                    : ''}
                </td>
                <td className='pr-10'>{product.qty}</td>
                <td className='pr-10'>{product.price}</td>
                <td className='pr-10'>{product.saleCount}</td>
                <td>
                  <Link to={`/admin/product/${product._id}`} className='pr-2'>
                    EDIT
                  </Link>

                  <button
                    onClick={async () => {
                      await dispatch(adminDeleteSingleProduct(product._id));
                      await dispatch(adminFetchAllProducts());
                    }}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
