import { useEffect, useState, useRef, Key } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useSearchParams } from 'react-router-dom';
import {
  TProduct,
  fetchAllProducts,
  selectAllProducts,
} from '../../redux/slices/allProductSlice';
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
import ProductCard from './ProductCard';

const PRODS_PER_PAGE = 9;

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
  mobileMenu: boolean;
};

export default function AllProducts({
  sortKey = 'productName',
  sortDir = 'asc',
  mobileMenu,
}: AllProductsProps) {
  const dispatch = useAppDispatch();

  // TODO: replace this with query params
  // let { state } = useLocation();
  if (sortKey === 'saleCount') sortDir = 'desc';

  const allProducts = useAppSelector(selectAllProducts);
  const tagState = useAppSelector(selectTagState);

  const [params, setParams] = useSearchParams();
  let curPage = Number(params.get('page')) || 1;
  let filter = params.get('filter') || 'all';

  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState(false);
  const [randomProd, setRandomProd] = useState<TProduct>();
  // const [pageNum, setPageNum] = useState<number | undefined>();
  const [bestsellers, setBestsellers] = useState(false);
  const [prevFilter, setPrevFilter] = useState(filter || 'all');
  const [sort, setSort] = useState<TSort>({
    key: sortKey,
    direction: sortDir,
  });

  const topElement = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // set title according to category name
    if (filter && filter !== 'all') {
      document.title = ('astoria: ' + filter).toUpperCase();
    }

    return () => {
      document.title = 'ASTORIA SKINCARE';
    };
  }, [filter]);

  useEffect(() => {
    if (topElement?.current) topElement.current.scrollIntoView(true);
  }, []);

  const maxPages = bestsellers
    ? 1
    : Math.ceil(allProducts.count! / PRODS_PER_PAGE);

  useEffect(() => {
    // make sure we have all tags upon page load in order to populate filter selector
    // TODO: consider moving this to some central location (app, nav, etc)
    dispatch(fetchAllTags());
  }, []);

  useEffect(() => {
    setSort({ key: sortKey, direction: sortDir });
  }, [sortKey]);

  useEffect(() => {
    if (!curPage) {
      curPage = 1;
      // setParams((prev) => ({ filter: prev.get('filter') || 'all', page: '1' }));
    }
    // else if (curPage > maxPages) setParams({ page: maxPages.toString() });
    // else setPageNum(Number(params.get('page')));
  }, [curPage]);

  useEffect(() => {
    if (curPage && curPage > 0)
      dispatch(
        fetchAllProducts({ page: curPage, sort, filter: filter || 'all' })
      );
    const pathname = window.location.pathname.split('/');

    // Set bestsellers to true if we're in the bestsellers route
    setBestsellers(
      pathname[pathname.length - 1].toLowerCase() === 'bestsellers'
    );
  }, [curPage, sort.key, sort.direction, filter]);

  useEffect(() => {
    if (filter !== prevFilter) {
      setParams((prev) => ({
        page: '1',
        filter: filter || prev.get('filter') || 'all',
      }));
      setPrevFilter(filter || 'all'); // attempts to prevent resetting page # when reloading page
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
      setFilterMenuIsOpen(false);
    }
  }, [filter]);

  useEffect(() => {
    setRandomProd(randomProduct(allProducts));
  }, [allProducts]);

  const pageIncrementor = () => {
    const nextPage = curPage + 1;
    if (nextPage > maxPages) return;
    setParams({ filter: filter!, page: String(nextPage) });
    topElement.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pageDecrementor = () => {
    const prevPage = curPage - 1;

    if (prevPage < 1) return;
    setParams({ filter: filter!, page: String(prevPage) });
    topElement.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        className="all-product-container mx-auto flex w-11/12 max-w-screen-2xl flex-col items-center pb-8 pt-5 portrait:w-[100dvw] portrait:px-0"
      >
        <section
          className={`${
            mobileMenu ? 'flex-col' : 'flex'
          } header-section relative  w-full justify-center `}
        >
          {bestsellers ? (
            <BestsellersHeader mobileMenu={mobileMenu} />
          ) : (
            <AllProductsHeader
              // allProdsBg={allProdsBg}
              mobileMenu={mobileMenu}
              filter={filter || 'all'}
              randomProd={randomProd}
            />
          )}
        </section>
        {!bestsellers && (
          <div
            ref={topElement}
            className="sub-header scroll-mt-16 pt-28 font-grotesque text-[2rem] font-light uppercase tracking-wide portrait:px-2 portrait:pt-5"
          >
            {filter && filter === 'all' ? (
              <p>{filter} products</p>
            ) : (
              <p>all {filter}</p>
            )}
          </div>
        )}

        {!bestsellers && (
          <section className="filter-section flex flex-col self-end pb-10 pt-20 portrait:w-fit portrait:pr-3 portrait:pt-7">
            <div
              className="flex cursor-pointer gap-6 self-end"
              onClick={() => setFilterMenuIsOpen((prev) => !prev)}
            >
              <p className="flex  font-grotesque text-sm 2xl:text-base">
                sort/categories
              </p>
              {/* TODO: intrinsic height/width */}
              <img
                src={filterIcon}
                alt={`${filterMenuIsOpen ? 'hide' : 'show'} filter options`}
                className="flex w-6 flex-row"
              />
            </div>
            <SortFilterAllProds
              setSort={setSort}
              filter={filter || 'all'}
              allProducts={allProducts}
              sortKey={sortKey}
              sortDir={sortDir}
              filterMenuIsOpen={filterMenuIsOpen}
              setFilterMenuIsOpen={setFilterMenuIsOpen}
            />
          </section>
        )}

        {/* // ! product cards */}
        <div
          id="product-card-container"
          //  landscape:border-t
          className={`grid grid-cols-4 border-primary-gray portrait:grid-cols-2 ${
            allProducts.products.length % 2 !== 0 &&
            allProducts.products.length > 2
              ? 'border-b'
              : ''
          }`}
        >
          {allProducts?.products?.map((product) => (
            <ProductCard
              product={product}
              key={product._id as Key}
            />
          ))}
        </div>

        {/* // ! pagination */}
        {maxPages > 1 && (
          <div className="flex w-full justify-center border-primary-gray pb-14 pt-20 tracking-widest">
            <div className="flex items-center font-grotesque text-xl ">
              <img
                src={arrowLeft}
                alt="go back one page"
                className="h-4 cursor-pointer pr-8"
                onClick={pageDecrementor}
              />
              {pageFlipper().firstPage}
              {curPage! !== 1 && curPage! !== maxPages && (
                <img
                  src={dots}
                  alt=""
                  className="flex h-6 w-8 translate-y-[30%] cursor-pointer"
                />
              )}
              {curPage! !== 1 && curPage! !== maxPages && (
                <p>{pageFlipper().currentPage}</p>
              )}
              <img
                src={dots}
                alt=""
                className="flex h-6 w-8 translate-y-[30%] cursor-pointer"
              />
              {pageFlipper().lastPage}
              <img
                src={arrowRight}
                alt="go forward one page"
                className="h-4 rotate-180 cursor-pointer pr-8"
                onClick={pageIncrementor}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
