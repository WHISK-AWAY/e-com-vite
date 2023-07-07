import { TProduct } from '../../redux/slices/allProductSlice';
import { useEffect, useState } from 'react';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { useNavigate } from 'react-router';
import 'lazysizes';

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

  useEffect(() => {
    setProdCopy([...products]);
  }, [products]);

  useEffect(() => {
    setRenderProduct(prodCopy.slice(0, num));
  }, [prodCopy, num]);

  const decrementor = () => {
    setProdCopy((prev) => [
      ...prev.slice(products.length - 1),
      ...prev.slice(0, -1),
    ]);
  };
  const incrementor = () => {
    setProdCopy((prev) => [...prev.slice(1), prev[0]]);
  };
  // decrementor()
  return (
    <div className='relative flex w-3/4 items-start justify-center gap-10 2xl:w-4/5'>
      <button
        onClick={decrementor}
        className='absolute -left-24 top-[75px] shrink-0 grow-0 self-center xl:-left-32 xl:top-[125px] 2xl:-left-40'
      >
        <img src={arrowLeft} alt='' className='h-3 xl:h-5' />
      </button>
      {renderProduct.map((prod) => {
        const gifURL = prod.images.find((image) =>
          ['gif-product', 'video-product'].includes(image.imageDesc)
        )?.imageURL;

        let hoverFallback =
          prod.images
            .slice(1)
            .find((image) => image.imageDesc === 'product-texture')?.imageURL ||
          prod.images
            .slice(1)
            .find((image) => image.imageDesc === 'product-alt')?.imageURL ||
          prod.images
            .slice(1)
            .find((image) => !image.imageDesc.includes('video'))?.imageURL;

        return (
          <div
            key={prod._id.toString()}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/product/' + prod._id);
            }}
            className={`ymal-card group relative flex w-[125px] shrink-0 grow-0 cursor-pointer flex-col items-center justify-center gap-4 xl:w-[200px] xl:gap-6 2xl:w-[225px]`}
          >
            <img
              className='lazyload aspect-[3/4] w-[100px] object-cover group-hover:invisible xl:w-[175px] 2xl:w-[200px]'
              data-src={
                prod.images.find((image) => image.imageDesc === 'product-front')
                  ?.imageURL || prod.images[0].imageURL
              }
              data-sizes='auto'
              alt='product image'
            />
            {gifURL ? (
              <video
                className='lazyload invisible absolute top-0 aspect-[3/4] w-[100px] object-cover group-hover:visible xl:w-[175px] 2xl:w-[200px]'
                data-src={gifURL}
                data-sizes='auto'
                muted={true}
                autoPlay={true}
                loop={true}
              />
            ) : (
              <img
                className='lazyload invisible absolute top-0 aspect-[3/4] w-[100px] object-cover group-hover:visible xl:w-[175px] 2xl:w-[200px]'
                data-src={hoverFallback}
                data-sizes='auto'
              />
            )}
            <h4 className='text-center font-hubbali text-xs uppercase lg:text-sm xl:text-lg'>
              {prod.productName}
            </h4>
          </div>
        );
      })}
      <button
        onClick={incrementor}
        className='absolute -right-24 top-[75px] shrink-0 grow-0 self-center xl:-right-32 xl:top-[125px] 2xl:-right-40'
      >
        <img src={arrowRight} alt='' className='h-3 rotate-180 xl:h-5' />
      </button>
    </div>
  );
}
