import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  TProduct,
  fetchAllProducts,
  selectAllProducts,
} from '../../redux/slices/allProductSlice';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import {
  addToFavorites,
  removeFromFavorites,
  selectSingleUserFavorites,
} from '../../redux/slices/userSlice';
import { getUserId, selectAuthUserId } from '../../redux/slices/authSlice';
import { fetchAllTags, selectTagState } from '../../redux/slices/tagSlice';
import allProdsBg from '../../assets/bg-img/all-prods.jpg';
import filterI from '../../../src/assets/icons/filter.svg';
import heartBlanc from '../../../src/assets/icons/heart-blanc.svg';
import heartFilled from '../../../src/assets/icons/heart-filled.svg';
import arrowRight from '../../../src/assets/icons/arrowRight.svg';
import arrowLeft from '../../../src/assets/icons/arrowLeft.svg';
import dots from '../../../src/assets/icons/threeDots.svg';

import SortFilterAllProds from '../SortFilterAllProds';
import AllProductsHeader from './AllProductsHeader';
import BestsellersHeader from './BestsellersHeader';
const PRODS_PER_PAGE = 9;

/**
 * sort by name or price (ascending & descending)
 */

export type SortKey = 'productName' | 'price' | 'saleCount';
export type SortDir = 'asc' | 'desc';

export const randomProduct = (allProducts: {
  products: TProduct[];
  count: number | null;
}) => {
  let randomIdx = Math.floor(Math.random() * allProducts.products.length);
  return allProducts.products[randomIdx];
};

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

  const topElement = useRef<HTMLHeadingElement | null>(null);

  const [bestsellers, setBestsellers] = useState(false);

  const [filter, setFilter] = useState('all');

  let { state } = useLocation();

  const userFavorites = useAppSelector(selectSingleUserFavorites);

  useEffect(() => {
    if (state?.filterKey) setFilter(state.filterKey);
  }, [state]);

  let curPage = Number(params.get('page'));

  const allProducts = useAppSelector(selectAllProducts);

  const userId = useAppSelector(selectAuthUserId);

  const tagState = useAppSelector(selectTagState);

  const [isSearchHidden, setIsSearchHidden] = useState(true);
  const [randomProd, setRandomProd] = useState<TProduct>();

  useEffect(() => {
    if (topElement?.current) topElement.current.scrollIntoView(true);
  }, []);

  const maxPages = bestsellers
    ? 1
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

    // Set bestsellers to true if we're in the bestsellers route
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
    topElement.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pageDecrementor = () => {
    const prevPage = curPage - 1;
    if (prevPage < 1) return;
    setParams({ page: String(prevPage) });
    topElement.current?.scrollIntoView({ behavior: 'smooth' });
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

  useEffect(() => {
    setRandomProd(randomProduct(allProducts));
  }, [allProducts]);

  type TPageFlipper = {
    firstPage: number;
    currentPage: number;
    nextPage: number;
    lastPage: number;
  };

  const pageFlipper = () => {
    let pages = {} as TPageFlipper;
    let currentPage = Number(params.get('page'));

    pages.firstPage = 1;
    pages.currentPage = currentPage;
    pages.nextPage = currentPage + 1;
    pages.lastPage = maxPages;

    return pages;
  };

  // pageFlipper();

  if (!allProducts.products.length) return <p>...Loading</p>;
  // if(!userFavorites) return <p>no favs</p>
  if (!tagState.tags.length) return <p>...Tags loading</p>;
  if (!randomProd) return <p>..Loading random prod</p>;

  return (
    <section className='all-product-container mx-auto flex w-11/12 max-w-screen-2xl flex-col items-center px-10 pt-5'>
      {/* {filter === 'all' && <h1>{filter} products</h1>} */}
      <section className='header-section relative flex w-full justify-center'>
        {bestsellers ? (
          <BestsellersHeader />
        ) : (
          <AllProductsHeader
            allProdsBg={allProdsBg}
            filter={filter}
            randomProd={randomProd}
          />
        )}
      </section>
      {!bestsellers && (
        <div
          ref={topElement}
          className='sub-header pt-28 font-marcellus text-3xl uppercase tracking-wide'
        >
          {filter && filter === 'all' ? (
            <p>{filter} products</p>
          ) : (
            <p>all {filter}</p>
          )}
        </div>
      )}

      {!bestsellers && (
        <section className='filter-section flex flex-col self-end pb-10 pt-20'>
          <div className='flex gap-6  self-end '>
            <p className='flex  font-marcellus lg:text-lg'>sort/filter by </p>

            <img
              src={filterI}
              className='flex w-6 flex-row'
              onClick={() => setIsSearchHidden((prev) => !prev)}
            />
          </div>
          {!isSearchHidden && (
            <SortFilterAllProds
              setSort={setSort}
              sort={sort}
              filter={filter}
              setFilter={setFilter}
              allProducts={allProducts}
              sortKey={sortKey}
              sortDir={sortDir}
            />
          )}
        </section>
      )}
      <div className='grid grid-cols-3 gap-16 p-[6%] lg:gap-36 '>
        {/* ALL PRODUCTS + ADD/REMOVE FAVORITE */}
        {allProducts.products.map((product) => (
          <li
            className='flex list-none flex-col justify-between'
            key={product._id.toString()}
          >
            <div className='relative'>
              <Link to={'/product/' + product._id}>
                <img
                  src={
                    product.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || product.images[0].imageURL
                  }
                  alt='cat'
                  className='aspect-[3/4] w-full object-cover'
                />
              </Link>

              {(userId &&
                !userFavorites
                  ?.map((fav) => fav._id)
                  .includes(product._id.toString())) ||
              !userId ? (
                <div
                  className=' absolute right-[6%] top-[5%]'
                  onClick={() => {
                    handleAddOrRemoveFromFavorites({
                      userId: userId!,
                      productId: product._id.toString(),
                    });
                  }}
                >
                  <img src={heartBlanc} alt='heart-blanc' className='' />
                </div>
              ) : (
                <div
                  className='absolute right-[6%] top-[5%]'
                  onClick={() => {
                    handleAddOrRemoveFromFavorites({
                      userId: userId!,
                      productId: product._id.toString(),
                    });
                  }}
                >
                  <img src={heartFilled} alt='heart-filled' className='' />
                </div>
              )}
            </div>

            <p className='place-items-stretch pt-10 text-center font-hubbali  lg:text-xl'>
              <Link to={'/product/' + product._id}>
                {product.productName.toUpperCase()}
              </Link>
            </p>
            <p className='pt-3 text-center font-grotesque lg:text-xl'>
              ${product.price}
            </p>
          </li>
        ))}
      </div>
      {maxPages > 1 && (
        <div className='flex w-full justify-center pt-20 tracking-widest'>
          <div className='flex items-center font-grotesque text-xl '>
            <img
              src={arrowLeft}
              alt='left-arrow'
              className='h-4 cursor-pointer pr-8'
              onClick={pageDecrementor}
            />
            {pageFlipper().firstPage}
            {pageNum! !== 1 && pageNum! !== maxPages && (
              <img
                src={dots}
                alt='three-dots'
                className='flex h-6 w-8 translate-y-[30%] cursor-pointer'
              />
            )}
            {pageNum! !== 1 && pageNum! !== maxPages && (
              <p>{pageFlipper().currentPage}</p>
            )}
            <img
              src={dots}
              alt='three-dots'
              className='flex h-6 w-8 translate-y-[30%] cursor-pointer'
            />
            {pageFlipper().lastPage}
            <img
              src={arrowRight}
              alt='right-arrow'
              className='h-4 rotate-180 cursor-pointer pr-8'
              onClick={pageIncrementor}
            />
          </div>
        </div>
      )}
    </section>
  );
}

// {
//   pageNum! >= 1 && (
//     <img
//       src={arrowLeft}
//       alt='left-arrow'
//       className='h-5 cursor-pointer pr-5'
//       onClick={pageDecrementor}
//     />
//   );
// }
// {
//   /* {pageFlipper().firstPage} */
// }
// {
//   pageFlipper().nextPage > 1 && pageFlipper().nextPage < maxPages && (
//     <>
//       <span>
//         {' '}
//         {pageFlipper().firstPage}, {pageFlipper().currentPage}
//       </span>
//     </>
//   );
// }
// {
//   pageFlipper().currentPage <= maxPages && (
//     <>
//       <img
//         src={dots}
//         alt='three-dots'
//         className='flex w-8 translate-y-[20%] cursor-pointer'
//       />
//       <p className=''>{pageFlipper().lastPage}</p>
//     </>
//   );
// }
// {
//   /* {pageNum === maxPages ? pageFlipper().firstPage : pageFlipper().lastPage} */
// }
// {
//   pageNum! <= maxPages && (
//     <img
//       src={arrowRight}
//       alt='right-arrow'
//       className='h-5 rotate-180 cursor-pointer pr-5'
//       onClick={pageIncrementor}
//     />
//   );
// }
