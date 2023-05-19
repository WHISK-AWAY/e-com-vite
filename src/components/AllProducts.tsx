import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';

import { useSearchParams, Link } from 'react-router-dom';

export default function AllProducts() {
  const dispatch = useAppDispatch();

  const allProducts = useAppSelector(selectAllProducts);

  let [page, setPage] = useSearchParams();

  const pageIncrementor = () => {
    const pageNum = Number(page.get('page')) + 1;
    if(pageNum > maxPages) return;
    setPage({ page: String(pageNum) });
  };

  const pageDecrementor = () => {
    const pageNum = Number(page.get('page')) -1;
    if(pageNum < 1) return;
    setPage({page: String(pageNum)});
  }
  const prodsPerPage = 9;
  const maxPages = Math.ceil(allProducts.count! / prodsPerPage);
  
  useEffect(() => {
    if(!page.get('page')) {
      setPage({page: String(1)})
    }
  }, [])

  
  useEffect(() => {
    dispatch(fetchAllProducts(Number(page.get('page'))));
  }, [page]);

  if (!allProducts.products.length) return <p>...Loading</p>;
  return (
    <section className='all-product-container'>
      <h1 className='text-2xl'>SHOP ALL</h1>
      <div>
        {allProducts.products.map((product) => (
          <li className='list-none' key={product._id.toString()}>
            <img src={product.imageURL} alt='cat' />
            <p><Link to={'/product/'+ product._id}> {product.productName.toUpperCase()} </Link></p>
            <p>{product.productShortDesc}</p>
            <p> {product.price}</p>
          </li>
        ))}
        <button onClick={pageIncrementor}>next</button>
        <br/>
        <button onClick={pageDecrementor}>previous</button>
      </div>
    </section>
  );
}
