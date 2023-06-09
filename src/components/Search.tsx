import { TSearch } from '../redux/slices/allProductSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Search({
  searchResults,
  setSearch,
  setSearchResults,
  searchNotFound,
}: {
  searchResults: TSearch;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSearchResults: React.Dispatch<React.SetStateAction<TSearch>>;
  searchNotFound: boolean;
}) {
  const navigate = useNavigate();

  const handleProductNameSearch = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    productId: string
  ) => {
    e.preventDefault();
    setSearch('');
    setSearchResults({
      products: [],
      tags: [],
    });

    navigate(`/product/${productId}`);
  };

  const handleTagNameSearch = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tagId: string,
    tagName: string
  ) => {
    e.preventDefault();
    setSearch('');
    setSearchResults({
      products: [],
      tags: [],
    });
    navigate(`/shop-all?page=1`, { state: { filterKey: tagName } });
  };

  return (
    <section className='product-search-section'>
      {/* PRODUCT NAME SEARCH */}

      {searchNotFound && <p>no results matched your search...</p>}
      {searchResults.products.length > 0 && (
        <article className='product-name-search'>
          {searchResults.products.map((result) => {
            return (
              <div
                onClick={(e) => handleProductNameSearch(e, result.productId)}
                key={result.productId}
              >
                <img src={result.imageURL[0]} />
                <p>{result.productName}</p>
              </div>
            );
          })}
        </article>
      )}

      {/* TAG NAME SEARCH */}
      {searchResults.tags.length > 0 && (
        <article className='tag-name-search'>
          {searchResults.tags.map((tag) => {
            return (
              // <Link to={`/shop-all?page=1`} state={{ filterKey: tag.tagName }}>

              <div
                onClick={(e) => handleTagNameSearch(e, tag.tagId, tag.tagName)}
                key={tag.tagId}
              >
                <p>{tag.tagName}</p>
              </div>
              // </Link>
            );
          })}
        </article>
      )}
    </section>
  );
}
