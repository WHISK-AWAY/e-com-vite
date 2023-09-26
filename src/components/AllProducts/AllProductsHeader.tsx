import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TProduct } from '../../redux/slices/allProductSlice';
import { CategoryHeaderInfo, getCategoryHeaderInfo } from './CategoryHeaders';
import convertMediaUrl from '../../utilities/convertMediaUrl';

export type AllProductsHeaderProps = {
  filter: string;
  // allProdsBg: string;
  randomProd: TProduct;
  mobileMenu: boolean;
};

export default function AllProductsHeader({
  filter,
  // allProdsBg,
  randomProd,
  mobileMenu,
}: AllProductsHeaderProps) {
  const [randomProdImage, setRandomProdImage] = useState<string | undefined>(
    undefined
  );
  const [randomProdGif, setRandomProdGif] = useState<string | undefined>(
    undefined
  );
  const [backupImage, setBackupImage] = useState<string | undefined>(undefined);
  const [categoryInfo, setCategoryInfo] = useState<CategoryHeaderInfo | null>(
    null
  );

  useEffect(() => {
    // pull category-specific header information
    setCategoryInfo(getCategoryHeaderInfo(filter));
  }, [filter]);

  useEffect(() => {
    // set up image URLs for random product finder
    if (randomProd) {
      setRandomProdImage(
        randomProd.images.find((image) => image.imageDesc === 'product-front')
          ?.imageURL || randomProd.images[0].imageURL
      );
      setRandomProdGif(
        randomProd.images.find((image) =>
          ['gif-product', 'video-product'].includes(image.imageDesc)
        )?.imageURL || undefined
      );
      setBackupImage(
        randomProd.images
          .slice(1)
          .find((image) => image.imageDesc === 'product-texture')?.imageURL ||
          randomProd.images
            .slice(1)
            .find((image) => image.imageDesc === 'product-alt')?.imageURL ||
          randomProd.images
            .slice(1)
            .find((image) => !image.imageDesc.includes('video'))?.imageURL
      );
    }

    return () => {
      setRandomProdImage(undefined);
      setRandomProdGif(undefined);
    };
  }, [randomProd]);

  return (
    <>
      <section className=" relative flex w-1/2 portrait:w-[100vw] portrait:md:w-1/2">
        <h1
          className={`${
            mobileMenu ? 'hidden' : ''
          } absolute right-0 top-6 font-poiret text-6xl uppercase tracking-wide lg:text-8xl 2xl:top-20 2xl:text-9xl `}
          dangerouslySetInnerHTML={{
            __html: categoryInfo?.splitTitle || <span>problem</span>,
          }}
        ></h1>

        {/**mobile header */}
        <h1 className="w-1/6 -rotate-90 self-end whitespace-nowrap pl-7 font-grotesque text-[2rem] font-bold uppercase leading-none text-primary-gray portrait:md:hidden landscape:hidden">
          {categoryInfo?.category === 'all'
            ? `${categoryInfo?.category} products`
            : categoryInfo?.category}
        </h1>
        {/* TODO: webp images for category headers */}
        <picture>
          <source
            srcSet={convertMediaUrl(categoryInfo?.image)}
            type="image/webp"
          />
          <img
            src={categoryInfo?.image}
            className="-z-10   max-h-[calc(100svh_-_90px)] object-cover portrait:h-[60svh]"
            height="4493"
            width="2996"
            alt=""
          />
        </picture>
      </section>

      <section className="random-product flex basis-1/2 flex-col items-center portrait:basis-0 portrait:md:basis-1/2">
        <div className="mt-32 flex pb-10 pl-9 font-grotesque text-xs md:mt-24  md:pb-5 lg:mt-40 lg:pl-12 lg:text-base xl:mt-44 2xl:mt-56 2xl:pl-16 2xl:text-lg portrait:mt-4 portrait:pl-20 portrait:pr-2 portrait:text-[1.1rem] portrait:md:mt-32 portrait:md:px-5 portrait:md:text-[1.1rem] landscape:short:text-sm">
          Discover our most popular formulations for face, body, hands, and
          hair. All our products are vegan, cruelty-free, and made in France
          with only the ingredients essential to their function.
        </div>
        <div
          className={`relative flex w-3/5 flex-col justify-center lg:w-4/5 portrait:hidden portrait:md:flex portrait:md:w-4/5  ${
            randomProdGif || backupImage ? 'group' : ''
          }`}
        >
          <div className="flex w-full flex-col overflow-hidden">
            <Link
              to={`/product/${randomProd._id}`}
              className="transform transition duration-300 group-hover:scale-110 group-hover:ease-in-out"
              aria-label={`product: ${randomProd.productName}`}
            >
              <picture>
                {randomProd && randomProdImage && (
                  <source
                    srcSet={convertMediaUrl(randomProdImage!)}
                    type="image/webp"
                  />
                )}
                <img
                  src={randomProdImage}
                  alt={`product image: ${randomProd.productName}`}
                  className="aspect-square w-full object-cover group-hover:invisible "
                  height="1600"
                  width="1600"
                />
              </picture>
              {randomProdGif ? (
                <video
                  // src={randomProdGif}
                  loop
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  className="invisible absolute right-0 top-0 aspect-square w-full object-cover group-hover:visible"
                >
                  <source
                    src={randomProdGif}
                    type={
                      randomProdGif.split('.').at(-1) === 'mp4'
                        ? 'video/mp4'
                        : 'image/gif'
                    }
                  />
                  <source
                    src={convertMediaUrl(randomProdGif)}
                    type="video/webm"
                  />
                </video>
              ) : (
                <picture>
                  <source
                    srcSet={convertMediaUrl(backupImage)}
                    type="image/webp"
                  />
                  <img
                    src={backupImage}
                    alt={`alternate product image: ${randomProd.productName}`}
                    className="invisible absolute right-0 top-0 aspect-square w-full object-cover group-hover:visible"
                    height="1600"
                    width="1600"
                  />
                </picture>
              )}
            </Link>
          </div>
          <Link
            to={'/product/' + randomProd._id}
            className="text-md pb-1  pt-7 text-center font-grotesque text-sm uppercase md:pt-5 md:text-xs lg:text-base 3xl:text-lg portrait:md:text-[1.1rem]"
          >
            {randomProd!.productName}
          </Link>
          <p className="text-center font-grotesque text-sm lg:text-base  3xl:text-lg portrait:md:text-[1.1rem]">
            ${randomProd!.price}
          </p>
        </div>
      </section>
    </>
  );
}
