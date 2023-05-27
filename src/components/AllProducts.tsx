import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';
import { useSearchParams, Link } from 'react-router-dom';
import { addToFavorites } from '../redux/slices/userSlice';
import { getUserId, selectAuthUserId } from '../redux/slices/authSlice';
import { fetchAllTags, selectTagState } from '../redux/slices/tagSlice';

const PRODS_PER_PAGE = 9;

/**
 * sort by name or price (ascending & descending)
 */

type SortKey = 'productName' | 'price' | 'saleCount';
type SortDir = 'asc' | 'desc';

export type TSort = {
  key: SortKey;
  direction: SortDir;
};

export type AllProductsProps = {
  sortKey?: SortKey;
  sortDir?: SortDir;
};

export default function AllProducts({
  sortKey = 'productName',
  sortDir = 'asc',
}: AllProductsProps) {
  const dispatch = useAppDispatch();

  if (sortKey === 'saleCount') sortDir = 'desc';

  const [params, setParams] = useSearchParams();
  const [pageNum, setPageNum] = useState<number | undefined>();
  const [sort, setSort] = useState<TSort>({
    key: sortKey,
    direction: sortDir,
  });
  const [filter, setFilter] = useState('all');

  let curPage = Number(params.get('page'));

  const allProducts = useAppSelector(selectAllProducts);

  const userId = useAppSelector(selectAuthUserId);

  const tagState = useAppSelector(selectTagState);

  const maxPages = Math.ceil(allProducts.count! / PRODS_PER_PAGE);

  useEffect(() => {
    console.log('loc', window.location.pathname); //TODO: read url & conditionally render some shit (and/or not) based on whether or not we're in bestsellers route
    dispatch(fetchAllTags());
  }, []);

  useEffect(() => {
    dispatch(getUserId());
  }, [userId]);

  useEffect(() => {
    setSort({ key: sortKey, direction: sortDir });
  }, [sortKey]);

  useEffect(() => {
    if (!curPage) setParams({ page: '1' });
    // else if (curPage > maxPages) setParams({ page: maxPages.toString() });
    else setPageNum(Number(params.get('page')));
  }, [curPage]);

  useEffect(() => {
    if (pageNum && pageNum > 0)
      dispatch(fetchAllProducts({ page: pageNum, sort, filter }));
  }, [pageNum, sort, filter]);

  useEffect(() => {
    setParams({ page: '1' });
  }, [filter]);

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

  // function handleSort(sortKey: 'productName' | 'price'): void {
  //   if (sort.key === sortKey)
  //     setSort({
  //       key: sortKey,
  //       direction: sort.direction === 'asc' ? 'desc' : 'asc',
  //     });
  //   else setSort({ key: sortKey, direction: 'asc' });
  // }
  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(JSON.parse(e.target.value));
  }

  if (!allProducts.products.length) return <p>...Loading</p>;
  if (!tagState.tags.length) return <p>...Tags loading</p>;

  const tagList = tagState.tags;

  return (
    <section className="all-product-container">
      <h1 className="text-2xl">SHOP ALL</h1>
      <div className="controls flex">
        <div className="sort-selector border">
          <h2>Sort by:</h2>
          <select
            onChange={handleSort}
            defaultValue={JSON.stringify({
              key: sortKey || 'productName',
              direction: sortDir || 'desc',
            })}
            // defaultValue={
            //   sortKey === 'saleCount'
            //     ? JSON.stringify({ key: sortKey || 'productName', direction: sortDir || 'desc' })
            //     : JSON.stringify({ key: 'productName', direction: 'asc' })
            // }
          >
            <option
              value={JSON.stringify({ key: 'productName', direction: 'asc' })}
              // selected={sort.key === 'productName' && sort.direction === 'asc'}
            >
              Alphabetical, ascending
            </option>
            <option
              value={JSON.stringify({ key: 'productName', direction: 'desc' })}
              // selected={sort.key === 'productName' && sort.direction === 'desc'}
            >
              Alphabetical, descending
            </option>
            <option
              className="capitalize"
              value={JSON.stringify({ key: 'saleCount', direction: 'desc' })}
              // selected={sort.key === 'saleCount' && sort.direction === 'desc'}
            >
              best sellers, high-to-low
            </option>
            <option
              className="capitalize"
              value={JSON.stringify({ key: 'saleCount', direction: 'asc' })}
              // selected={sort.key === 'saleCount' && sort.direction === 'asc'}
            >
              best sellers, low-to-high
            </option>
            <option
              value={JSON.stringify({ key: 'price', direction: 'asc' })}
              // selected={sort.key === 'price' && sort.direction === 'asc'}
            >
              Price, low-to-high
            </option>
            <option
              value={JSON.stringify({ key: 'price', direction: 'desc' })}
              // selected={sort.key === 'price' && sort.direction === 'desc'}
            >
              Price, high-to-low
            </option>
          </select>
        </div>
        <div className="filter-selector border">
          <h2>Filter by:</h2>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option className="capitalize" value="all">
              all
            </option>

            {tagList.map((tag) => (
              <option className="capitalize" value={tag.tagName} key={tag._id}>
                {tag.tagName}
              </option>
            ))}
          </select>
          ({allProducts.count})
        </div>
      </div>
      <div>
        {/* TODO: conditional favorite button */}
        {allProducts.products.map((product) => (
          <li className="list-none" key={product._id.toString()}>
            <img src={product.imageURL} alt="cat" />
            <p>
              <Link to={'/product/' + product._id}>
                {product.productName.toUpperCase()}
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
        {curPage < maxPages && <button onClick={pageIncrementor}>next</button>}
        <br />
        {curPage > 1 && <button onClick={pageDecrementor}>previous</button>}
      </div>
    </section>
  );
}
