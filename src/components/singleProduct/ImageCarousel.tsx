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
    setupRenderImagesArray();
    // setRenderImage(prodImagesCopy?.slice(0, num + 2)); // select first n+2 images to render
    // idx 0 & idx n will be hidden until animated by incrementing/decrementing
  }, [prodImagesCopy, num]);

  function setupRenderImagesArray() {
    if (!prodImagesCopy?.length) return;

    // index zero should be the last image in the array (to prep for decrementor)
    const tempImagesArray = [prodImagesCopy.at(-1)!];

    let i = 0;
    while (tempImagesArray.length < num + 2) {
      // reset index if we reach the end of the images array
      if (i === prodImagesCopy.length) i = 0;

      tempImagesArray.push(prodImagesCopy[i]);
      i++;
    }

    setRenderImage(tempImagesArray);
    return;
  }

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

  useEffect(() => {
    // ! debug
    console.log('renderImage:', renderImage);
  }, [renderImage]);
  useEffect(() => {
    // ! debug
    console.log('prodImagesCopy:', prodImagesCopy);
  }, [prodImagesCopy]);

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
      <div className='images-wrapper flex gap-3'>
        {renderImage.map((image, idx) => {
          let extension = image.imageURL.split('.').at(-1);
          return (
            <div
              key={image.imageURL + '_' + idx}
              onClick={() => {
                changeImage!(selectedImage, image.imageURL);
                // setSelectedImage(image.imageURL);
              }}
              className={
                'image-card flex w-[50px] shrink-0 grow-0 cursor-pointer flex-col items-center justify-center gap-4 first:hidden last:hidden lg:w-[75px] xl:w-[100px] xl:gap-6 2xl:w-[120px]'
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
      </div>
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
