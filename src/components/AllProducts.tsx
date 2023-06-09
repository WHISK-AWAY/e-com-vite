import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchAllProducts,
  selectAllProducts,
} from '../redux/slices/allProductSlice';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import {
  addToFavorites,
  removeFromFavorites,
  selectSingleUserFavorites,
} from '../redux/slices/userSlice';
import {
  getUserId,
  selectAuth,
  selectAuthUserId,
} from '../redux/slices/authSlice';
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
  filterKey?: string;
};

export default function AllProducts({
  sortKey = 'productName',
  sortDir = 'asc',
}: // filterKey = 'all',
AllProductsProps) {
  if (sortKey === 'saleCount') sortDir = 'desc';

  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const [pageNum, setPageNum] = useState<number | undefined>();
  const [sort, setSort] = useState<TSort>({
    key: sortKey,
    direction: sortDir,
  });
  const [bestsellers, setBestsellers] = useState(false);

  const [filter, setFilter] = useState('all');

  let { state } = useLocation();

  const userFavorites = useAppSelector(selectSingleUserFavorites);

  // console.log('uf', userFavorites);

  useEffect(() => {
    if (state?.filterKey) setFilter(state.filterKey);
  }, [state]);

  let curPage = Number(params.get('page'));

  const allProducts = useAppSelector(selectAllProducts);

  const userId = useAppSelector(selectAuthUserId);

  const tagState = useAppSelector(selectTagState);

  const maxPages = bestsellers
    ? 2
    : Math.ceil(allProducts.count! / PRODS_PER_PAGE);

  useEffect(() => {
    // console.log('loc', window.location.pathname); //TODO: read url & conditionally render some shit (and/or not) based on whether or not we're in bestsellers route
    // console.log('path', pathname);
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
    const pathname = window.location.pathname.split('/');
    setBestsellers(
      pathname[pathname.length - 1].toLowerCase() === 'bestsellers'
    );
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

  const handleAddOrRemoveFromFavorites = ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    if (userId) {
      let favId = [] as string[];
      userFavorites.forEach((fav) => {
        favId.push(fav._id);
      });

      if (!favId?.includes(productId)) {
        dispatch(addToFavorites({ userId, productId }));
      } else {
        dispatch(removeFromFavorites({ userId, productId }));
      }
    }
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

  // console.log('filter key', filterKey);

  return (
    <section className='all-product-container'>
      <h1 className='text-2xl'>{bestsellers ? 'BESTSELLERS' : 'SHOP ALL'}</h1>
      <div className='controls flex'>
        {!bestsellers && (
          <>
            <div className='sort-selector border'>
              <h2>Sort by:</h2>
              <select
                onChange={handleSort}
                defaultValue={JSON.stringify({
                  key: sortKey || 'productName',
                  direction: sortDir || 'desc',
                })}
              >
                <option
                  value={JSON.stringify({
                    key: 'productName',
                    direction: 'asc',
                  })}
                  // selected={sort.key === 'productName' && sort.direction === 'asc'}
                >
                  Alphabetical, ascending
                </option>
                <option
                  value={JSON.stringify({
                    key: 'productName',
                    direction: 'desc',
                  })}
                  // selected={sort.key === 'productName' && sort.direction === 'desc'}
                >
                  Alphabetical, descending
                </option>
                <option
                  className='capitalize'
                  value={JSON.stringify({
                    key: 'saleCount',
                    direction: 'desc',
                  })}
                  // selected={sort.key === 'saleCount' && sort.direction === 'desc'}
                >
                  best sellers, high-to-low
                </option>
                <option
                  className='capitalize'
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

            <div className='filter-selector border'>
              <h2>Filter by:</h2>
              <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              >
                <option className='capitalize' value='all'>
                  all
                </option>

                {tagList.map((tag) => (
                  <option
                    className='capitalize'
                    value={tag.tagName}
                    key={tag._id}
                  >
                    {tag.tagName}
                  </option>
                ))}
              </select>
              ({allProducts.count})
            </div>
          </>
        )}
      </div>

      <div>
        {/* ALL PRODUCTS + ADD/REMOVE FAVORITE */}
        {allProducts.products.map((product) => (
          <li className='list-none' key={product._id.toString()}>
            <img
              src={
                product.images.find(
                  (image) => image.imageDesc === 'product-front'
                )?.imageURL || product.images[0].imageURL
              }
              alt='cat'
            />
            <p>
              <Link to={'/product/' + product._id}>
                {product.productName.toUpperCase()}
              </Link>
            </p>
            <p>{product.productShortDesc}</p>
            <p> {product.price}</p>
            <button
              onClick={() => {
                handleAddOrRemoveFromFavorites({
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
