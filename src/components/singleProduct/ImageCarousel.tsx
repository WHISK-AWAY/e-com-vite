import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import 'lazysizes';
import { gsap } from 'gsap';

import { TProduct } from '../../redux/slices/allProductSlice';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { ImageData } from '../../../server/database';

export type ImageCarouselProps = {
  product: TProduct;
  num: number;
  changeImage: ((newImage: string) => void) | null;
};

export default function ImageCarousel({
  product,
  num,
  changeImage,
}: ImageCarouselProps) {
  const [prodImagesCopy, setProdImagesCopy] = useState<ImageData[]>();
  const [renderImage, setRenderImage] = useState<ImageData[]>();
  const incrementAnimation = useRef<gsap.core.Timeline | null>(null);
  const decrementAnimation = useRef<gsap.core.Timeline | null>(null);

  // * This works now, but commenting it out until we can discuss how _
  // * exactly it should behave. Note: it does not currently reset _
  // * upon user interation.
  // useEffect(() => {
  //   let clearId = setInterval(() => autoIncrementImage(), 1000 * 10);

  //   return () => clearInterval(clearId);

  // }, []);

  // function autoIncrementImage() {
  //   console.log('autoincrement running');
  //   incrementor();
  // }

  useEffect(() => {
    setProdImagesCopy([...product.images]);
  }, [product]);

  useEffect(() => {
    if (num > product.images.length) num = product.images.length;
  }, [num, product]);

  useEffect(() => {
    setupRenderImagesArray();
  }, [prodImagesCopy, num]);

  function setupRenderImagesArray() {
    // build array of n+2 images to place in carousel
    // idx 0 & idx n+1 will be hidden until animated by incrementing/decrementing
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

  const incrementor = () => {
    incrementAnimation.current
      ?.duration(0.5)
      .resume('begin')
      .then(() => {
        setProdImagesCopy((prev) => [...prev!.slice(1), prev![0]]);
        changeImage!(prodImagesCopy![1]!.imageURL);
      });
  };

  const decrementor = () => {
    decrementAnimation.current
      ?.duration(0.5)
      .resume('begin')
      .then(() => {
        setProdImagesCopy((prev) => [
          ...prev!.slice(prev!.length - 1),
          ...prev!.slice(0, -1),
        ]);

        changeImage!(prodImagesCopy!.at(-1)!.imageURL);
      });
  };

  useLayoutEffect(() => {
    if (!renderImage?.length) return;

    const ctx = gsap.context(() => {
      const incTimeline = gsap.timeline().pause();
      const decTimeline = gsap.timeline().pause();
      const images = Array.from(document.querySelectorAll('.image-card'));

      if (!images?.length) return console.error('Error: no images selected.');

      incTimeline
        .addLabel('begin')
        .to(images[1], {
          // fade out first shown image
          opacity: 0,
        })
        .to(images, {
          // shift all images leftward
          x: (_, target) => {
            return -target.getBoundingClientRect().width - 12; // 12 being the 'gap' setting
          },
        })
        .set(images[1], {
          // remove first shown image
          display: 'none',
        })
        .set(images.at(-1)!, {
          // un-hide (while making invisible) new last image
          display: 'inherit',
          opacity: 0,
        })
        .set(images, {
          // position all products for arrival of "new" rendered product
          x: 0,
        })
        .to(images.at(-1)!, {
          // fade in last image
          opacity: 1,
        });

      decTimeline
        .addLabel('begin')
        .to(images[num], {
          // fade out last shown image
          opacity: 0,
        })
        .to(images, {
          // shift all images rightward
          x: (_, target) => {
            return target.getBoundingClientRect().width + 12; // 12 being the 'gap' setting
          },
        })
        .set(images[num], {
          // remove last shown image
          display: 'none',
        })
        .set(images[0], {
          // un-hide (while making invisible) new first image
          display: 'inherit',
          opacity: 0,
        })
        .set(images, {
          // position all products for arrival of "new" rendered product
          x: 0,
        })
        .to(images[0], {
          // fade in new first image
          opacity: 1,
        });

      incrementAnimation.current = incTimeline;
      decrementAnimation.current = decTimeline;
    });

    return () => {
      ctx.revert();
    };
  });

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
      <div className='images-wrapper flex items-start justify-center gap-3'>
        {renderImage.map((image, idx) => {
          let extension = image.imageURL.split('.').at(-1);
          return (
            <div
              key={image.imageURL + '_' + idx}
              onClick={() => {
                changeImage!(image.imageURL);
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
                  // data-src={image.imageURL}
                  src={image.imageURL}
                  // data-sizes='auto'
                  className='lazyload aspect-[3/4] w-full border border-charcoal object-cover'
                />
              ) : (
                <img
                  className='lazyload aspect-[3/4] w-full border border-charcoal object-cover'
                  src={image.imageURL}
                  // data-src={image.imageURL}
                  // data-sizes='auto'
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
