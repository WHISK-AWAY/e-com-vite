import { selectTagState } from '../redux/slices/tagSlice';
import { SortDir, SortKey, TSort } from './AllProducts/AllProducts';
import { useAppSelector } from '../redux/hooks';
import { TProduct } from '../redux/slices/allProductSlice';

export default function SortFilterAllProds({
  // sort,
  setSort,
  filter,
  setFilter,
  allProducts,
  sortKey,
  sortDir,
}: {
  // sort: TSort;
  setSort: React.Dispatch<React.SetStateAction<TSort>>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  sortKey: SortKey;
  sortDir: SortDir;
  allProducts: {
    products: TProduct[];
    count: number | null;
  };
}) {
  const tagState = useAppSelector(selectTagState);
  const tagList = tagState.tags;

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(JSON.parse(e.target.value));
  }

  return (
    <div className='controls flex font-marcellus '>
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
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option className='capitalize' value='all'>
            all
          </option>

          {tagList.map((tag) => (
            <option className='capitalize' value={tag.tagName} key={tag._id}>
              {tag.tagName}
            </option>
          ))}
        </select>
        ({allProducts.count})
      </div>
    </div>
  );
}
