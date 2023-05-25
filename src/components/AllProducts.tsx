import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';
import { useSearchParams, Link } from 'react-router-dom';
import { addToFavorites } from '../redux/slices/userSlice';
import { getUserId, selectAuthUserId } from '../redux/slices/authSlice';

const PRODS_PER_PAGE = 9;

/**
 * sort by name or price (ascending & descending)
 */

export type TSort = {
  key: 'productName' | 'price';
  direction: 'asc' | 'desc';
};

export default function AllProducts() {
  const dispatch = useAppDispatch();

  const [params, setParams] = useSearchParams();
  const [pageNum, setPageNum] = useState<number | undefined>();
  const [sort, setSort] = useState<TSort>({
    key: 'productName',
    direction: 'asc',
  });
  // TODO: turn key/direction chooser into a select box

  useEffect(() => {
    console.log('sort is now: ', sort);
  }, [sort]);

  let curPage = Number(params.get('page'));
  const allProducts = useAppSelector(selectAllProducts);

  const maxPages = Math.ceil(allProducts.count! / PRODS_PER_PAGE);

  const userId = useAppSelector(selectAuthUserId);

  useEffect(() => {
    dispatch(getUserId());
  }, [userId]);

  useEffect(() => {
    if (!curPage) setParams({ page: '1' });
    else setPageNum(Number(params.get('page')));
  }, [curPage]);

  useEffect(() => {
    if (pageNum && pageNum > 0)
      dispatch(fetchAllProducts({ page: pageNum, sort }));
  }, [pageNum, sort]);

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

  const handleAddToFavorite = ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    if (userId) dispatch(addToFavorites({ userId, productId }));
  };

  function handleSort(sortKey: 'productName' | 'price'): void {
    if (sort.key === sortKey)
      setSort({
        key: sortKey,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    else setSort({ key: sortKey, direction: 'asc' });
  }

  if (!allProducts.products.length) return <p>...Loading</p>;
  return (
    <section className="all-product-container">
      <h1 className="text-2xl">SHOP ALL</h1>
      <div className="sort-buttons">
        <h2>Sort by:</h2>
        <button onClick={() => handleSort('productName')}>
          Name{sort.key === 'productName' ? ` ${sort.direction}` : ''}
        </button>
        <br />
        <button onClick={() => handleSort('price')}>
          Price{sort.key === 'price' ? ` ${sort.direction}` : ''}
        </button>
      </div>
      <div>
        {allProducts.products.map((product, productId) => (
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
            <button
              onClick={() => {
                handleAddToFavorite({
                  userId: userId!,
                  productId: product._id.toString(),
                });
              }}
            >
              &lt;3
            </button>
          </li>
        ))}
        <button onClick={pageIncrementor}>next</button>
        <br />
        <button onClick={pageDecrementor}>previous</button>
      </div>
    </section>
  );
}
