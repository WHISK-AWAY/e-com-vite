import { useEffect, useLayoutEffect, useState } from 'react';
import 'lazysizes';
import { gsap } from 'gsap';

import { TProduct } from '../../redux/slices/allProductSlice';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { ImageData } from '../../../server/database';

export type ImageCarouselProps = {
  product: TProduct;
  num: number;
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  changeImage: ((oldImage: string, newImage: string) => void) | null;
};

export default function ImageCarousel({
  product,
  num,
  selectedImage,
  setSelectedImage,
  changeImage,
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
    setRenderImage(prodImagesCopy?.slice(0, num + 1));
  }, [prodImagesCopy, num]);

  useEffect(() => {
    if (!renderImage?.length || !changeImage) return;
  }, [renderImage]);

  const decrementor = () => {
    setProdImagesCopy((prev) => [
      ...prev!.slice(prev!.length - 1),
      ...prev!.slice(0, -1),
    ]);

    changeImage!(
      prodImagesCopy![0]!.imageURL,
      prodImagesCopy!.at(-1)!.imageURL
    );
  };

  // useLayoutEffect(() => {
  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline();
  //     const leadImage = document.querySelector('div.image-card:first-of-type');
  //     const trailingImage = document.querySelector(
  //       'div.image-card:last-of-type'
  //     );
  //     tl.to(leadImage, {
  //       opacity: 0,
  //     })
  //       .to('.image-card', {
  //         x: '-=100%',
  //       })
  //       .set(leadImage, {
  //         display: 'none',
  //       })
  //       .set(trailingImage, {
  //         display: 'inherit',
  //         opacity: 0,
  //       })
  //       .to(
  //         trailingImage,
  //         {
  //           opacity: 1,
  //         },
  //         '<'
  //       );
  //   });

  //   return () => {
  //     ctx.revert();
  //   };
  // });

  const incrementor = () => {
    changeImage!(prodImagesCopy![0]!.imageURL, prodImagesCopy![1]!.imageURL);
    setProdImagesCopy((prev) => [...prev!.slice(1), prev![0]]);
  };

  if (!prodImagesCopy || !renderImage) return <h1>Loading images...</h1>;

  return (
    <div className='relative flex w-11/12 items-start justify-center gap-3'>
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
      {renderImage.map((image, idx) => {
        let extension = image.imageURL.split('.').at(-1);
        return (
          <div
            key={image.imageURL}
            onClick={() => {
              changeImage!(selectedImage, image.imageURL);
              // setSelectedImage(image.imageURL);
            }}
            className={
              'image-card flex w-[50px] shrink-0 grow-0 cursor-pointer flex-col items-center justify-center gap-4 lg:w-[75px] xl:w-[100px] xl:gap-6 2xl:w-[120px]' +
              (idx === num ? ' hidden' : '')
            }
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
      {/* render "+1" image for use in animation */}
      {/* {renderImage?.length > 0 && trailingImage()} */}
      {/* {['gif', 'mp4'].includes(
        prodImagesCopy[Math.min(num, prodImagesCopy.length)]?.imageURL
          ?.split('.')
          ?.at(-1)
      ) ? (
        <video
          className='trailing-image hidden'
          src={prodImagesCopy[Math.min(num, prodImagesCopy.length)].imageURL}
        />
      ) : (
        <img
          className='trailing-image hidden'
          src={prodImagesCopy[Math.min(num, prodImagesCopy.length)].imageURL}
        />
      )} */}
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
