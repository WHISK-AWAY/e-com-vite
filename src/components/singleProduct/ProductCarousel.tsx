import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { type TProduct } from '../../redux/slices/allProductSlice';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { gsap } from 'gsap';
import ProdCarouselCard from './ProdCarouselCard';

export type RenderProduct = Omit<TProduct, 'relatedProducts'>;

type ProductCarouselProps = {
  products: Omit<TProduct, 'relatedProducts'>[];
  num?: number;
  mobileMenu: boolean
}

export default function ProductCarousel({
  products,
  num = 4,
  mobileMenu
}: ProductCarouselProps) {
  const [prodCopy, setProdCopy] = useState<RenderProduct[]>([]);
  const [renderProduct, setRenderProduct] = useState<RenderProduct[]>([]);
  const incrementAnimation = useRef<gsap.core.Timeline | null>(null);
  const decrementAnimation = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setProdCopy([...products]);
  }, [products]);

  useEffect(() => {
    setupRenderProductsArray();
  }, [prodCopy[0]?._id, num]);

  useLayoutEffect(() => {
    if (!renderProduct?.length) return;

    const ctx = gsap.context(() => {
      const incTimeline = gsap.timeline({ paused: true });
      const decTimeline = gsap.timeline().pause();

      const products = Array.from(document.querySelectorAll('.ymal-card'));

      if (!products?.length)
        return console.error('Error: no products selected.');

      incTimeline
        .addLabel('begin')
        .to(products[1], {
          // fade out first shown product
          opacity: 0,
        })
        .to(products, {
          // shift all products leftward
          x: (_, target) => {
            return -target.getBoundingClientRect().width - 40; // 40 being the 'gap' setting
          },
        })
        .set(products[1], {
          // remove first shown product
          display: 'none',
        })
        .set(products.at(-1)!, {
          // un-hide new last product
          display: 'inherit',
        })
        .set(products, {
          // position all products for arrival of "new" rendered product
          x: 0,
        })
        .from(products.at(-1)!, {
          opacity: 0,
        })

      decTimeline
        .addLabel('begin')
        .to(products[num], {
          // fade out last shown product
          opacity: 0,
        })
        .to(products, {
          // shift all products rightward
          x: (_, target) => {
            return target.getBoundingClientRect().width + 40; // 40 being the 'gap' setting
          },
        })
        .set(products[num], {
          // remove last shown product
          display: 'none',
        })
        .set(products, {
          // position all products for arrival of "new" rendered product
          x: 0,
        })
        .set(products[0], {
          // un-hide new first product
          display: 'inherit',
        })
        .from(products[0], {
          // fade in new first product
          opacity: 0,
        });

      incrementAnimation.current = incTimeline;
      decrementAnimation.current = decTimeline;
    });

    return () => {
      ctx.revert();
    };
  }, [renderProduct[0]?._id]);

  const decrementCarousel = () => {
    decrementAnimation.current
      ?.duration(0.5)
      .resume('begin')
      .then(() => {
        setProdCopy((prev) => [
          ...prev.slice(products.length - 1),
          ...prev.slice(0, -1),
        ]);
      });
  };
  const incrementCarousel = () => {
    incrementAnimation.current
      ?.duration(0.5)
      .resume('begin')
      .then(() => {
        setProdCopy((prev) => [...prev.slice(1), prev[0]]);
      });
  };

  function setupRenderProductsArray() {
    // build array of n+2 products to place in carousel
    // idx 0 & idx n+1 will be hidden until animated by incrementing/decrementing
    if (!prodCopy?.length) return;

    // index zero should be the last image in the array (to prep for decrementor)
    const tempProductsArray = [prodCopy.at(-1)!];

    let i = 0;

    while (tempProductsArray.length < num + 2) {
      // reset index if we reach the end of the products array
      if (i === prodCopy.length) i = 0;

      tempProductsArray.push(prodCopy[i]);
      i++;
    }

    setRenderProduct(tempProductsArray);
    return;
  }

  return (
      <div className="relative flex w-3/4 items-start justify-center gap-10 2xl:w-4/5 ">
          <button
              onClick={decrementCarousel}
              className={` ${
                  mobileMenu ? '-left-16' : '-left-24'
              } absolute  top-[75px] shrink-0 grow-0 self-center xl:-left-32 xl:top-[125px] 2xl:-left-40`}
          >
              <img
                  src={arrowLeft}
                  alt="left-arrow-icon"
                  className="active: group h-3 transform transition-all duration-150 hover:scale-150 hover:ease-in-out active:scale-50 active:bg-red-800 active:duration-700 active:ease-in xl:h-5 portrait:h-5"
              />
          </button>
          {/* // ! caution: keep this gap setting aligned with carousel card animation */}
          <div className="card-wrapper flex items-start justify-center gap-10">
              {renderProduct.length > 0 &&
                  renderProduct.map((prod) => (
                      <ProdCarouselCard
                          prod={prod}
                          key={prod._id!.toString()}
                      />
                  ))}
          </div>
          <button
              onClick={incrementCarousel}
              className={` ${
                  mobileMenu ? '-right-16' : '-right-24'
              } absolute  top-[75px] shrink-0 grow-0 self-center xl:-right-32 xl:top-[125px] 2xl:-right-40 `}
          >
              <img
                  src={arrowRight}
                  alt="right-arrow-icon"
                  className="h-3 rotate-180 transform transition-all duration-150 hover:scale-150  hover:ease-in-out active:scale-50 xl:h-5 portrait:h-5"
              />
          </button>
      </div>
  );
}
