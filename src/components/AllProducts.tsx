import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';
import { useSearchParams, Link } from 'react-router-dom';

const PRODS_PER_PAGE = 9;

export default function AllProducts() {
  const dispatch = useAppDispatch();

  const [params, setParams] = useSearchParams();
  const [pageNum, setPageNum] = useState<number | undefined>();
  let curPage = Number(params.get('page'));
  const allProducts = useAppSelector(selectAllProducts);

  const maxPages = Math.ceil(allProducts.count! / PRODS_PER_PAGE);

  useEffect(() => {
    if (!curPage) setParams({ page: '1' });
    else setPageNum(Number(params.get('page')));
  }, [curPage]);

  useEffect(() => {
    if (pageNum && pageNum > 0) dispatch(fetchAllProducts(pageNum));
  }, [pageNum]);

  const pageIncrementor = () => {
    const nextPage = curPage + 1;
    if (nextPage > maxPages) return;
    setParams({ page: String(nextPage) });
  };

  const pageDecrementor = () => {
    const prevPage = curPage - 1;
    if (prevPage < 1) return;
    setParams({ page: String(prevPage) });
  };

  if (!allProducts.products.length) return <p>...Loading</p>;
  return (
    <section className="all-product-container">
      <h1 className="text-2xl">SHOP ALL</h1>
      <div>
        {allProducts.products.map((product) => (
          <li className="list-none" key={product._id.toString()}>
            <img src={product.imageURL} alt="cat" />
            <p>
              <Link to={'/product/' + product._id}>
                {' '}
                {product.productName.toUpperCase()}{' '}
              </Link>
            </p>
            <p>{product.productShortDesc}</p>
            <p> {product.price}</p>
          </li>
        ))}
        <button onClick={pageIncrementor}>next</button>
        <br />
        <button onClick={pageDecrementor}>previous</button>
      </div>
    </section>
  );
}
