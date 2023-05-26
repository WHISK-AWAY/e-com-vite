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

export type TSort = {
  key: 'productName' | 'price';
  direction: 'asc' | 'desc';
};

// const tagList = [
//   { tagName: 'moisturizers' },
//   { tagName: 'oils' },
//   { tagName: 'spf' },
//   { tagName: 'eye care' },
//   { tagName: 'acne' },
//   { tagName: 'cleansers' },
//   { tagName: 'exfoliators' },
//   { tagName: 'essence' },
//   { tagName: 'serums' },
//   { tagName: 'lip care' },
//   { tagName: 'creams' },
// ];

export default function AllProducts() {
  const dispatch = useAppDispatch();

  const [params, setParams] = useSearchParams();
  const [pageNum, setPageNum] = useState<number | undefined>();
  const [sort, setSort] = useState<TSort>({
    key: 'productName',
    direction: 'asc',
  });
  const [filter, setFilter] = useState('all');

  let curPage = Number(params.get('page'));

  const allProducts = useAppSelector(selectAllProducts);

  const userId = useAppSelector(selectAuthUserId);

  const tagState = useAppSelector(selectTagState);

  const maxPages = Math.ceil(allProducts.count! / PRODS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchAllTags());
  }, []);

  useEffect(() => {
    dispatch(getUserId());
  }, [userId]);

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
      <div className="sort-buttons">
        <h2>Sort by:</h2>
        <select onChange={handleSort}>
          <option
            value={JSON.stringify({ key: 'productName', direction: 'asc' })}
          >
            Alphabetical, ascending
          </option>
          <option
            value={JSON.stringify({ key: 'productName', direction: 'desc' })}
          >
            Alphabetical, descending
          </option>
          <option value={JSON.stringify({ key: 'price', direction: 'asc' })}>
            Price, low-to-high
          </option>
          <option value={JSON.stringify({ key: 'price', direction: 'desc' })}>
            Price, high-to-low
          </option>
        </select>
      </div>
      <div className="filter-selector">
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
        {curPage < maxPages && <button onClick={pageIncrementor}>next</button>}
        <br />
        {curPage > 1 && <button onClick={pageDecrementor}>previous</button>}
      </div>
    </section>
  );
}
