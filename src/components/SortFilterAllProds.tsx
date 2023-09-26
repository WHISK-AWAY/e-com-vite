import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortDir, SortKey, TSort } from './AllProducts/AllProducts';
import { useAppSelector } from '../redux/hooks';
import { TProduct } from '../redux/slices/allProductSlice';

import { gsap } from 'gsap';

type SortFilterAllProdsProps = {
  setSort: React.Dispatch<React.SetStateAction<TSort>>;
  filter: string;
  // setFilter: React.Dispatch<React.SetStateAction<string>>;
  sortKey: SortKey;
  sortDir: SortDir;
  allProducts: {
    products: TProduct[];
    count: number | null;
  };
  filterMenuIsOpen: boolean;
  setFilterMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SortFilterAllProds({
  // sort,
  setSort,
  filter,
  // setFilter,
  allProducts,
  sortKey,
  sortDir,
  filterMenuIsOpen,
  setFilterMenuIsOpen,
}: SortFilterAllProdsProps) {
  const [_, setParams] = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const tagList = useAppSelector((state) => state.tag.tags);

  useEffect(() => {
    let tl: gsap.core.Timeline | undefined;

    const ctx = gsap.context(() => {
      if (filterMenuIsOpen) {
        tl = gsap.timeline();

        tl.set(containerRef.current, {
          display: 'flex',
          height: 0,
        }).to(containerRef.current, {
          height: 'auto',
          opacity: 1,
          ease: 'power2.inOut',
          duration: 0.5,
        });
      }
    });

    return () => {
      if (tl) {
        tl.reverse().then(() => ctx.revert());
      } else ctx.revert();
    };
  }, [filterMenuIsOpen]);

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(JSON.parse(e.target.value));
    setFilterMenuIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="controls h-0 gap-4 overflow-clip font-grotesque"
    >
      <div className="sort-selector">
        <h2>Sort by:</h2>
        <select
          className="appearance-none rounded-sm portrait:w-40"
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
            className="capitalize"
            value={JSON.stringify({
              key: 'saleCount',
              direction: 'desc',
            })}
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

      <div className="filter-selector ">
        <h2>Choose category:</h2>
        <select
          className="rounded-sm portrait:w-40"
          onChange={(e) => setParams({ page: '1', filter: e.target.value })}
          value={filter}
        >
          <option
            className="capitalize"
            value="all"
          >
            all
          </option>

          {tagList.map((tag) => (
            <option
              className="capitalize"
              value={tag.tagName}
              key={tag._id}
            >
              {tag.tagName}
            </option>
          ))}
        </select>
        <span className="portrait:hidden">({allProducts.count})</span>
      </div>
    </div>
  );
}
