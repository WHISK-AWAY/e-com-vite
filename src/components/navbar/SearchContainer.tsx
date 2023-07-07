import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import Fuse from 'fuse.js';

import Search from './Search';
import x from '../../assets/icons/x.svg';

import {
  selectSearchProducts,
  type TSearch,
} from '../../redux/slices/allProductSlice';
import { useAppSelector } from '../../redux/hooks';
import { Link } from 'react-router-dom';

export type SearchContainerProps = {
  setIsSearchHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SearchContainer({
  setIsSearchHidden,
}: SearchContainerProps) {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [searchResults, setSearchResults] = useState<TSearch>({
    products: [],
    tags: [],
  });
  const [anim, setAnim] = useState<gsap.core.Timeline | null>(null);

  const blurBgRef = useRef(null);
  const formRef = useRef(null);
  const logoRef = useRef(null);

  const catalogue = useAppSelector(selectSearchProducts);

  useLayoutEffect(() => {
    // Set up & run opening animation.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(blurBgRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power4.inOut',
      });
      tl.from(
        formRef.current,
        {
          y: '-=100%',
          duration: 0.8,
          ease: 'power4.inOut',
        },
        '<'
      );
      tl.from(logoRef.current, {
        duration: 0.4,
        ease: 'power4.inOut',
        opacity: 0,
      });

      // Store animation for reversal upon close.
      setAnim(tl);
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (search === '') {
      setSearchNotFound(false);
      if (searchResults.products.length || searchResults.tags.length) {
        setSearchResults({
          products: [],
          tags: [],
        });
      }
    } else {
      if (!searchResults.products.length && !searchResults.tags.length) {
        setSearchNotFound(true);
      } else {
        setSearchNotFound(false);
      }
    }
  }, [search, searchResults]);

  //handle clickoff
  function clickOff(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') {
      closeSlider();
    }
  }

  function closeSlider() {
    if (anim) {
      anim
        .duration(0.8) // double-speed the reversal
        .reverse()
        .then(() => {
          setIsSearchHidden(true);
        });
    } else {
      setIsSearchHidden(true);
    }
  }

  function handleSelectSearchItem(args: {
    type: 'tag' | 'product';
    name?: string;
    id?: string;
  }) {
    if (args.type === 'tag') {
      navigate('/shop-all?page=1', { state: { filterKey: args.name } });
    } else {
      navigate('/product/' + args.id);
    }
  }

  //fuse fuzzy product search

  /**
   * ! look into category/ search, have a discussion
   */
  const SCORE_THRESHOLD = 0.6;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const searchTerm = e.target.value;
    // console.log('searchTerm', searchTerm);

    const productResults = catalogue.products.filter((prod) => {
      return prod.productName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const tagResults = catalogue.tags.filter((tag) => {
      return tag.tagName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const options = {
      includeScore: true,
      // ignoreLocation: true,

      keys: ['productName', 'tagName'],
    };

    const fuse = new Fuse(catalogue.products, options);

    const searchResults = fuse
      .search(searchTerm)
      .filter((result) => result.score! < SCORE_THRESHOLD)
      .map((result) => result.item);
    console.log('search results', searchResults);

    setSearchResults({ products: searchResults, tags: [] });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchResults.products.length + searchResults.tags.length > 1) return;
    setSearch('');

    if (searchResults.tags.length === 1) {
      navigate(`/shop-all?page=1`, {
        state: { filterKey: searchResults.tags[0].tagName },
      });
    }

    if (searchResults.products.length === 1) {
      navigate(`/product/${searchResults.products[0].productId}`, {});
    }

    setSearchResults({
      products: [],
      tags: [],
    });
  };

  return (
    <section
      ref={blurBgRef}
      onClick={clickOff}
      id='wrapper'
      className='product-search-section absolute right-0 top-0 z-0 h-screen w-screen bg-[#35403F]/50 backdrop-blur'
    >
      <form
        ref={formRef}
        onSubmit={(e) => handleFormSubmit(e)}
        className='absolute right-0 top-0 z-20 h-[60vh] w-full bg-white'
      >
        <div className='logo-wrapper fixed top-0 mx-auto flex h-16 w-full items-center justify-center'>
          <img
            src={x}
            alt='x-icon'
            className='absolute left-[5%] top-8 h-[2vw]'
            onClick={closeSlider}
          />
          <Link
            to='/'
            className='font-chonburi  text-[2.5vw] text-[#262626] 3xl:text-[1.6vw]'
            onClick={closeSlider}
            ref={logoRef}
          >
            ASTORIA
          </Link>
        </div>
        <div className='absolute right-1/2 top-0 flex h-[4vw] w-[45vw] translate-x-[50%] translate-y-[150%] gap-5 '>
          <input
            className='w-full rounded-sm border border-charcoal font-federo text-[1.5vw] placeholder:font-aurora  placeholder:text-charcoal autofill:border-charcoal focus:border-charcoal focus:outline-none focus:outline-1 focus:outline-offset-0  focus:outline-charcoal '
            type='text'
            id='search'
            value={search}
            placeholder='search...'
            onChange={(e) => handleSearch(e)}
          ></input>
          <button className='bg-charcoal px-[10%] font-italiana text-[1.5vw] uppercase text-white '>
            search
          </button>
        </div>
      </form>

      <Search
        closeSlider={closeSlider}
        searchResults={searchResults}
        setSearch={setSearch}
        setSearchResults={setSearchResults}
        searchNotFound={searchNotFound}
      />
    </section>
  );
}
