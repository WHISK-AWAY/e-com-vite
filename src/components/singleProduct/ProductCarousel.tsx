import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TProduct } from '../../redux/slices/allProductSlice';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { useNavigate } from 'react-router';
import 'lazysizes';
import { gsap } from 'gsap';
import convertMediaUrl from '../../utilities/convertMediaUrl';

type RenderProduct = Omit<TProduct, 'relatedProducts'>;

export default function ProductCarousel({
  products,
  num,
}: {
  products: Omit<TProduct, 'relatedProducts'>[];
  num: number;
}) {
  const navigate = useNavigate();
  const [prodCopy, setProdCopy] = useState<RenderProduct[]>([]);
  const [renderProduct, setRenderProduct] = useState<RenderProduct[]>([]);
  const incrementAnimation = useRef<gsap.core.Timeline | null>(null);
  const decrementAnimation = useRef<gsap.core.Timeline | null>(null);
  // const rightArrowRef = useRef(null);
  // const leftArrowRef = useRef(null);

  useEffect(() => {
    setProdCopy([...products]);
  }, [products]);

  useEffect(() => {
    // setRenderProduct(prodCopy.slice(0, num));
    setupRenderProductsArray();
  }, [prodCopy, num]);

  useLayoutEffect(() => {
    if (!renderProduct?.length) return;

    const ctx = gsap.context(() => {
      const incTimeline = gsap.timeline().pause();
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
          // un-hide (while making invisible) new last product
          display: 'inherit',
          opacity: 0,
        })
        .set(products, {
          // position all products for arrival of "new" rendered product
          x: 0,
        })
        .to(products.at(-1)!, {
          // fade in last product
          opacity: 1,
        });

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
          // un-hide (while making invisible) new first product
          display: 'inherit',
          opacity: 0,
        })
        .to(products[0], {
          // fade in new first product
          opacity: 1,
        });

      incrementAnimation.current = incTimeline;
      decrementAnimation.current = decTimeline;
    });

    return () => {
      ctx.revert();
    };
  });

  const decrementor = () => {
    decrementAnimation.current
      ?.duration(0.75)
      .resume('begin')
      .then(() => {
        setProdCopy((prev) => [
          ...prev.slice(products.length - 1),
          ...prev.slice(0, -1),
        ]);
      });
  };
  const incrementor = () => {
    incrementAnimation.current
      ?.duration(0.75)
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
    <div className='relative flex w-3/4 items-start justify-center gap-10 2xl:w-4/5'>
      <button
        onClick={decrementor}
        className='absolute -left-24 top-[75px] shrink-0 grow-0 self-center xl:-left-32 xl:top-[125px] 2xl:-left-40'
      >
        <img
          src={arrowLeft}
          alt='left-arrow-icon'
          className='active: group h-3 transform transition-all duration-150 hover:scale-150 hover:ease-in-out active:scale-50 active:bg-red-800 active:duration-700 active:ease-in xl:h-5'
        />
      </button>
      <div className='card-wrapper flex items-start justify-center gap-10'>
        {renderProduct.map((prod, idx) => {
          const imageURL = prod.images.find(
            (image) => image.imageDesc === 'product-front'
          )?.imageURL || prod.images[0].imageURL

          const gifURL = prod.images.find((image) =>
            ['gif-product', 'video-product'].includes(image.imageDesc)
          )?.imageURL;

          let hoverFallback =
            prod.images
              .slice(1)
              .find((image) => image.imageDesc === 'product-texture')
              ?.imageURL ||
            prod.images
              .slice(1)
              .find((image) => image.imageDesc === 'product-alt')?.imageURL ||
            prod.images
              .slice(1)
              .find((image) => !image.imageDesc.includes('video'))?.imageURL;
          return (
            <div
              key={prod._id.toString() + '_' + idx}
              onClick={() => {
                // window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate('/product/' + prod._id);
              }}
              className={`ymal-card group relative flex w-[125px] shrink-0 grow-0 cursor-pointer flex-col items-center justify-center gap-2 first:hidden last:hidden xl:w-[200px]  2xl:w-[225px]`}
            >
              <picture>
                <source srcSet={convertMediaUrl(imageURL)} type='image/webp' />
                <img
                  className='aspect-[3/4] w-[100px] transform object-cover transition duration-300 hover:scale-105 active:translate-y-[600%]  group-hover:invisible group-hover:scale-105 group-active:duration-[10000] group-active:ease-in-out xl:w-[175px] 2xl:w-[200px]'
                  src={
                    prod.images.find(
                      (image) => image.imageDesc === 'product-front'
                    )?.imageURL || prod.images[0].imageURL
                  }
                  height='1600'
                  width='1600'
                  alt={`product image: ${prod.productName}`}
                />
              </picture>
              {gifURL ? (
                <video
                  className='invisible absolute top-0 aspect-[3/4] w-[100px] transform object-cover transition duration-300 hover:scale-105 group-hover:visible  group-hover:scale-105 group-hover:ease-in-out xl:w-[175px] 2xl:w-[200px]'
                  src={gifURL}
                  // data-sizes='auto'
                  muted={true}
                  autoPlay={true}
                  loop={true}
                />
              ) : (
                <picture>
                  <source
                    srcSet={convertMediaUrl(hoverFallback!)}
                    type='image/webp'
                  />
                  <img
                    className='invisible absolute top-0 aspect-[3/4] w-[100px] transform object-cover transition duration-300 hover:scale-105 group-hover:visible  group-hover:scale-105 group-hover:ease-in-out xl:w-[175px] 2xl:w-[200px]'
                    src={hoverFallback}
                    height='1600'
                    width='1600'
                  />
                </picture>
              )}
              <h4 className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-grotesque text-xs uppercase lg:text-sm xl:text-lg '>
                {prod.productName}
              </h4>
            </div>
          );
        })}
      </div>
      <button
        onClick={incrementor}
        className='absolute -right-24 top-[75px] shrink-0 grow-0 self-center xl:-right-32 xl:top-[125px] 2xl:-right-40 '
      >
        <img
          // ref={rightArrowRef}
          src={arrowRight}
          alt='right-arrow-icon'
          className='h-3 rotate-180 transform transition-all duration-150 hover:scale-150  hover:ease-in-out active:scale-50 xl:h-5'
        />
      </button>
    </div>
  );
}
