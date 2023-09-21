import type { TSearch } from '../../redux/slices/allProductSlice';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import x from '../../assets/icons/x.svg';

export default function Search({
  searchResults,
  setSearch,
  setSearchResults,
  searchNotFound,
  closeSlider,
}: {
  searchResults: TSearch;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSearchResults: React.Dispatch<React.SetStateAction<TSearch>>;
  searchNotFound: boolean;
  closeSlider: () => void;
}) {
  const navigate = useNavigate();

  //prevent scroll on overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // const fuse = useMemo(() => {
  //   const options = {
  //     includeScore: true,
  //     keys: ['products', 'tags']
  //   }

  //   return new Fuse(searchResults, options)
  // }, [searchResults])

  //product search section

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

  //animated slider

  // useEffect(() => {
  //   if(!blurBgRef) return

  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({duration: .4});

  //     tl.from(blurBgRef.current, {
  //       y: '+=100%',
  //       ease: 'power4.out',

  //     })
  //   })
  // }, [])

  return (
    <>
      {/* PRODUCT NAME SEARCH */}

      {searchNotFound && <p className='text-[1rem]'>no results matched your search...</p>}
      {searchResults.products.length > 0 && (
        <article className='product-name-search relative left-0   top-0 z-40 flex w-[90svw]  translate-x-[6%] font-grotesque  translate-y-[65%] overflow-x-scroll px-7 py-2 3xl:translate-y-[81%] portrait:translate-y-[55%] portrait:sm:translate-y-[70%]'>
          <div className='flex gap-10 portrait:gap-10 portrait:h-72'>
            {searchResults.products.map((result) => {
              return (
                <Link
                  to={`/product/${result.productId}`}
                  onClick={closeSlider}
                  key={result.productId}
                >
                  <div
                    className='flex w-[14vw] max-w-[230px] flex-col justify-between 3xl:justify-start portrait:h-64 portrait:w-96'
                    onClick={(e) =>
                      handleProductNameSearch(e, result.productId)
                    }
                    key={result.productId}
                  >
                    <img
                      className=' aspect-square shrink-0 basis-3/4 object-cover 3xl:basis-1/4 portrait:basis-3/4'
                      src={
                        result.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || result.images[0].imageURL
                      }
                    />
                    <p
                      className={` ${
                        result.productName.length > 20
                          ? 'w-full overflow-hidden text-ellipsis whitespace-nowrap '
                          : ''
                      }   basis-1/4 self-center text-center text-[.7rem] uppercase 3xl:text-[.7vw] portrait:text-[1rem] h-full`}
                    >
                      {result.productName}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </article>
      )}

      {/* TAG NAME SEARCH */}
      {searchResults.tags.length > 0 && (
        <article className='tag-name-search z-[90]  flex h-20 w-20 '>
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
    </>
  );
}
