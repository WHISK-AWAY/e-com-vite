import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TProduct } from '../../redux/slices/allProductSlice';

export type AllProductsHeaderProps = {
  filter: string;
  allProdsBg: string;
  randomProd: TProduct;
};

export default function AllProductsHeader({
  filter,
  allProdsBg,
  randomProd,
}: AllProductsHeaderProps) {
  const [randomProdImage, setRandomProdImage] = useState<string | undefined>(
    undefined
  );
  const [randomProdGif, setRandomProdGif] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // set up image URLs for random product finder
    if (randomProd) {
      setRandomProdImage(
        randomProd.images.find((image) => image.imageDesc === 'product-front')
          ?.imageURL || randomProd.images[0].imageURL
      );
      setRandomProdGif(
        randomProd.images.find((image) => image.imageDesc === 'gif-product')
          ?.imageURL
      );
    }

    return () => {
      setRandomProdImage(undefined);
      setRandomProdGif(undefined);
    };
  }, [randomProd]);

  return (
    <>
      <section className=' relative flex w-1/2'>
        <h1 className='absolute right-0 top-10 font-italiana text-6xl uppercase tracking-wide md:top-6 lg:text-8xl 2xl:top-20 2xl:text-9xl'>
          {filter && filter === 'all' ? (
            <>
              <span className='absolute -translate-x-full  text-white'>
                all
              </span>
              <span className='right-90 absolute'> products</span>
            </>
          ) : (
            filter
          )}
        </h1>

        <img src={allProdsBg} />
      </section>

      <section className='random-product flex basis-1/2 flex-col items-center'>
        <div className='mt-32 flex pb-10 pl-9 font-hubbali text-xs md:mt-24  md:pb-5 lg:mt-40 lg:pl-12 lg:text-base xl:mt-44 2xl:mt-56 2xl:pl-16 2xl:text-lg'>
          Discover our most popular formulations for face, body, hands, and
          hair. All our products are vegan, cruelty-free, and made in France
          with only the ingredients essential to their function.
        </div>
        <div
          className={`relative flex w-3/5 flex-col justify-center lg:w-4/5 ${
            randomProdGif ? 'group' : ''
          }`}
        >
          <Link to={'/product/' + randomProd._id}>
            <img
              src={randomProdImage}
              className='aspect-square w-full object-cover group-hover:invisible'
            />
            {randomProdGif && (
              <video
                src={randomProdGif}
                muted={true}
                autoPlay={true}
                loop={true}
                className='invisible absolute right-0 top-0 aspect-square w-full object-cover group-hover:visible'
              />
            )}
          </Link>
          <Link to={'/product/' + randomProd._id}>
            <p className='text-md pb-3  pt-7 text-center font-hubbali text-sm uppercase md:pt-5 md:text-xs lg:text-lg xl:text-2xl'>
              {randomProd!.productName}
            </p>
          </Link>
          <p className='text-center font-grotesque text-sm lg:text-lg  xl:text-2xl'>
            ${randomProd!.price}
          </p>
        </div>
      </section>
    </>
  );
}
