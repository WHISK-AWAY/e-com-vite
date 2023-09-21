import { useEffect, useState, useRef, Key } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  TProduct,
  fetchAllProducts,
  selectAllProducts,
} from '../../redux/slices/allProductSlice';
import {
  selectSingleUserFavorites,
} from '../../redux/slices/userSlice';
import { selectAuthUserId } from '../../redux/slices/authSlice';
import { fetchAllTags, selectTagState } from '../../redux/slices/tagSlice';
import filterIcon from '../../../src/assets/icons/filter.svg';
import arrowRight from '../../../src/assets/icons/arrowRight.svg';
import arrowLeft from '../../../src/assets/icons/arrowLeft.svg';
import dots from '../../../src/assets/icons/threeDots.svg';

import SortFilterAllProds from '../SortFilterAllProds';
import AllProductsHeader from './AllProductsHeader';
import BestsellersHeader from './BestsellersHeader';

import 'lazysizes';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { motion, useIsPresent } from 'framer-motion';
import ProductCard from './ProductCard';

const PRODS_PER_PAGE = 9;
/**
 * sort by name or price (ascending & descending)
 */

// function log(name:string, ...args:any[]): void {
//   // Extract the current timestamp
//   // const timestamp = new Date().toISOString();

//   // Prepend the timestamp to the log message
//   const message = `${name} ${args.join(' ')}`;

//   // Output the custom log message
//   console.log(message);
// }

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
  mobileMenu: boolean

  // filterKey?: string;
};

export default function AllProducts({
  sortKey = 'productName',
  sortDir = 'asc',
  mobileMenu
}: // filterKey = 'all',
  AllProductsProps) {
  const dispatch = useAppDispatch();
  if (sortKey === 'saleCount') sortDir = 'desc';

  const [params, setParams] = useSearchParams();
  const [pageNum, setPageNum] = useState<number | undefined>();
  const [sort, setSort] = useState<TSort>({
    key: sortKey,
    direction: sortDir,
  });

  const topElement = useRef<HTMLHeadingElement | null>(null);

  const [bestsellers, setBestsellers] = useState(false);

  const [filter, setFilter] = useState('all');
  const [prevFilter, setPrevFilter] = useState('all');

  let { state } = useLocation();
  const isPresent = useIsPresent();

  const userFavorites = useAppSelector(selectSingleUserFavorites);

  useEffect(() => {
    if (state?.filterKey) setFilter(state.filterKey);
  }, [state?.filterKey]);

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
    // make sure we have all tags upon page load in order to populate filter selector
    dispatch(fetchAllTags());
  }, []);

  // useEffect(() => {
  //   dispatch(getUserId());
  // }, [userId]);

  useEffect(() => {
    setSort({ key: sortKey, direction: sortDir });
  }, [sortKey]);

  useEffect(() => {
    if (!curPage) {
      setParams({ page: '1' });
    }
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
  }, [pageNum, sort.key, sort.direction, filter]);

  useEffect(() => {
    if (filter !== prevFilter) {
      setParams({ page: '1' });
      setPrevFilter(filter); // attempts to prevent resetting page # when reloading page
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
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

  const lenis = new Lenis({
    duration: 2.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    lerp: 0,
  });

  lenis.on('scroll', ScrollTrigger.update);

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  requestAnimationFrame(raf);



  if (!allProducts.products.length) return <p>...Loading</p>;
  if (!tagState.tags.length) return <p>...Tags loading</p>;
  if (!randomProd) return <p>..Loading random prod</p>;

  return (
    <>
      <section
        data-lenis-prevent
        className='all-product-container mx-auto flex w-11/12 max-w-screen-2xl flex-col items-center pt-5 portrait:w-[100dvw] portrait:px-0'
      >
        <section className={`${mobileMenu ? 'flex-col' : 'flex'} header-section relative  w-full justify-center `}>
          {bestsellers ? (
            <BestsellersHeader />
          ) : (
            <AllProductsHeader
              // allProdsBg={allProdsBg}
              mobileMenu={mobileMenu}
              filter={filter}
              randomProd={randomProd}
            />
          )}
        </section>
        {!bestsellers && (
          <div
            ref={topElement}
            className='sub-header pt-28 font-grotesque text-[2rem] font-light uppercase tracking-wide portrait:px-2 portrait:pt-5'
          >
            {filter && filter === 'all' ? (
              <p>{filter} products</p>
            ) : (
              <p>all {filter}</p>
            )}
          </div>
        )}

        {!bestsellers && (
          <section className='filter-section flex flex-col self-end pb-10 pt-20 portrait:w-fit portrait:pr-3 portrait:pt-7'>
            <div className='flex gap-6  self-end '>
              <p className='flex  font-grotesque text-sm 2xl:text-base'>sort/categories</p>
              {/* TODO: intrinsic height/width */}
              <img
                src={filterIcon}
                alt={`${isSearchHidden ? 'show' : 'hide'} filter options`}
                className='flex w-6 cursor-pointer flex-row'
                onClick={() => setIsSearchHidden((prev) => !prev)}
              />
            </div>
            {!isSearchHidden && (
              <SortFilterAllProds
                setSort={setSort}
                // sort={sort}
                filter={filter}
                setFilter={setFilter}
                allProducts={allProducts}
                sortKey={sortKey}
                sortDir={sortDir}
              />
            )}
          </section>
        )}

        <div id="product-card-container" className='grid grid-cols-4 border-primary-gray portrait:grid-cols-2 landscape:border-t'>
          {allProducts?.products?.map(product => (
            <ProductCard product={product} key={product._id as Key} />
          ))}
        </div>
        {maxPages > 1 && (
          <div className='flex w-full justify-center border-primary-gray pb-14 pt-20 tracking-widest portrait:border-t'>
            <div className='flex items-center font-grotesque text-xl '>
              <img
                src={arrowLeft}
                alt='go back one page'
                className='h-4 cursor-pointer pr-8'
                onClick={pageDecrementor}
              />
              {pageFlipper().firstPage}
              {pageNum! !== 1 && pageNum! !== maxPages && (
                <img
                  src={dots}
                  alt=''
                  className='flex h-6 w-8 translate-y-[30%] cursor-pointer'
                />
              )}
              {pageNum! !== 1 && pageNum! !== maxPages && (
                <p>{pageFlipper().currentPage}</p>
              )}
              <img
                src={dots}
                alt=''
                className='flex h-6 w-8 translate-y-[30%] cursor-pointer'
              />
              {pageFlipper().lastPage}
              <img
                src={arrowRight}
                alt='go forward one page'
                className='h-4 rotate-180 cursor-pointer pr-8'
                onClick={pageIncrementor}
              />
            </div>
          </div>
        )}
      </section>
      <motion.div
        className='slide-in fixed left-0 top-0 z-50 h-screen w-screen bg-[#0f0f0f]'
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        style={{ originY: isPresent ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
