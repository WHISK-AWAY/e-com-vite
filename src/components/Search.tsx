import { TSearch } from '../redux/slices/allProductSlice';
import { useEffect, useMemo } from 'react';
// import Fuse from 'fuse.js';
import { Link, useNavigate } from 'react-router-dom';

import x from '../assets/icons/x.svg';

export default function Search({
  searchResults,
  setSearch,
  setSearchResults,
  searchNotFound,
  isSearchHidden,
  setIsSearchHidden,
}: {
  searchResults: TSearch;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSearchResults: React.Dispatch<React.SetStateAction<TSearch>>;
  searchNotFound: boolean;
  isSearchHidden: boolean;
  setIsSearchHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, []);


  // const fuse = useMemo(() => {
  //   const options = {
  //     includeScore: true,
  //     keys: ['products', 'tags']
  //   }

  //   return new Fuse(searchResults, options)
  // }, [searchResults])



  // const result = fuse.search(searchResults)

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
    <section
      className={`product-search-section absolute right-0 top-0 h-screen w-screen  bg-[#35403F]/50 ${
        isSearchHidden ? 'hidden' : ''
      }`}
    >
      {/* PRODUCT NAME SEARCH */}
      <img
        src={x}
        alt='x-icon'
        className='absolute left-[5%] top-[7%] z-40 h-[2vw]'
        onClick={() => setIsSearchHidden(true)}
      />
      {searchNotFound && <p>no results matched your search...</p>}
      {searchResults.products.length > 0 && (
        <article className='product-name-search flex w-[90vw]   px-7 py-2 translate-y-[50%] translate-x-[6%] border 3xl:translate-y-[81%] border-blue-700  z-40 relative top-0 left-0 overflow-x-scroll'>

          <div className='flex gap-10'>

          {searchResults.products.map((result) => {
            return (
              <div
              className='flex w-[14vw] max-w-[230px] flex-col justify-between 3xl:justify-start border  border-green-500'
              onClick={(e) => handleProductNameSearch(e, result.productId)}
              key={result.productId}
              >
                <img
                className=' aspect-square basis-3/4 3xl:basis-1/4 shrink-0 object-cover'
                src={
                  result.images.find(
                    (image) => image.imageDesc === 'product-front'
                    )?.imageURL || result.images[0].imageURL
                  }
                  />
                <p className='text-[1vw] basis-1/4 3xl:text-[.7vw] flex self-center w-fit text-center uppercase border border-red-400'>{result.productName}</p>
              </div>
            );
          })}
            </div>
        </article>
      )}

      {/* TAG NAME SEARCH */}
      {searchResults.tags.length > 0 && (
        <article className='tag-name-search h-20  w-20 z-[90] flex '>
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
