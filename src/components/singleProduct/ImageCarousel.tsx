import { TProduct } from '../../redux/slices/allProductSlice';
import { useEffect, useState } from 'react';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { ImageData } from '../../../server/database';
import 'lazysizes';

export type ImageCarouselProps = {
  product: TProduct;
  num: number;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
};

export default function ImageCarousel({
  product,
  num,
  setSelectedImage,
}: ImageCarouselProps) {
  const [prodImagesCopy, setProdImagesCopy] = useState<ImageData[]>();
  const [renderImage, setRenderImage] = useState<ImageData[]>();

  // * This works now, but commenting it out until we can discuss how _
  // * exactly it should behave.
  // useEffect(() => {
  //   let clearId = setInterval(() => autoIncrementImage(), 1000 * 10);

  //   return () => clearInterval(clearId);

  // }, []);

  // function autoIncrementImage() {
  //   console.log('autoincrement running');
  //   incrementor();
  //   setSelectedImage(prodImagesCopy![0].imageURL);
  // }

  useEffect(() => {
    setProdImagesCopy([...product.images]);
  }, [product]);

  useEffect(() => {
    if (num > product.images.length) num = product.images.length;
  }, [num, product]);

  useEffect(() => {
    setRenderImage(prodImagesCopy?.slice(0, num));
  }, [prodImagesCopy, num]);

  useEffect(() => {
    if (!renderImage) return;
    setSelectedImage(renderImage[0].imageURL);
  }, [renderImage]);

  const decrementor = () => {
    setProdImagesCopy((prev) => [
      ...prev!.slice(prev!.length - 1),
      ...prev!.slice(0, -1),
    ]);
  };
  const incrementor = () => {
    console.log('prodImagesCopy:', prodImagesCopy);
    setProdImagesCopy((prev) => [...prev!.slice(1), prev![0]]);
  };

  if (!prodImagesCopy || !renderImage) return <h1>Loading images...</h1>;

  return (
    <div className='relative flex w-4/5 items-start justify-center gap-3'>
      <button
        onClick={decrementor}
        className='absolute -left-7 shrink-0 grow-0 self-center xl:-left-14 2xl:-left-20'
      >
        <img
          src={arrowLeft}
          alt='previous image'
          className='h-3 transform transition-all duration-150  hover:scale-150 hover:ease-in active:scale-50 xl:h-5'
        />
      </button>
      {renderImage.map((image) => {
        let extension = image.imageURL.split('.').at(-1);
        return (
          <div
            key={image.imageURL}
            onClick={() => {
              setSelectedImage(image.imageURL);
            }}
            className='image-card flex w-[50px] shrink-0 grow-0 cursor-pointer flex-col items-center justify-center gap-4 lg:w-[75px] xl:w-[100px] xl:gap-6 2xl:w-[120px]'
          >
            {['gif', 'mp4'].includes(extension!) ? (
              <video
                muted={true}
                autoPlay={true}
                loop={true}
                data-src={image.imageURL}
                data-sizes='auto'
                className='lazyload aspect-[3/4] border border-charcoal object-cover'
              />
            ) : (
              <img
                className='lazyload aspect-[3/4] border border-charcoal object-cover'
                data-src={image.imageURL}
                data-sizes='auto'
                alt={image.imageDesc}
              />
            )}
          </div>
        );
      })}
      <button
        onClick={incrementor}
        className='absolute -right-7 shrink-0 grow-0 self-center xl:-right-14 2xl:-right-20'
      >
        <img
          src={arrowRight}
          alt='next image'
          className='h-3 rotate-180 transform transition-all duration-150 hover:scale-150  hover:ease-in active:scale-50 xl:h-5'
        />
      </button>
    </div>
  );
}
