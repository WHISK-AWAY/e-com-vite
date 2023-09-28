import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { type TProduct } from '../../redux/slices/allProductSlice';
import convertMediaUrl from '../../utilities/convertMediaUrl';
import FavoritesButton from '../UI/FavoritesButton';

type ProductCardProps = {
  product: TProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { allProducts } = useAppSelector((state) => state.product);

  let imageURL =
    product.images.find((image) => image.imageDesc === 'product-front')
      ?.imageURL || product.images[0].imageURL;

  let webpURL = convertMediaUrl(imageURL);

  let hoverURL =
    product.images.find((image) =>
      ['gif-product', 'video-product'].includes(image.imageDesc)
    )?.imageURL || undefined;

  // If we don't have a gif, fail over to rendering a second image.
  // Choose a texture image if available; an alt if that doesn't work; and any non-video as a last resort.

  let hoverFallback =
    product.images
      .slice(1)
      .find((image) => image.imageDesc === 'product-texture')?.imageURL ||
    product.images.slice(1).find((image) => image.imageDesc === 'product-alt')
      ?.imageURL ||
    product.images.slice(1).find((image) => !image.imageDesc.includes('video'))
      ?.imageURL;

  return (
    <li
      // see index.css for definition of .first-row-top-border
      className={` ${
        allProducts.products.length % 2 === 0
          ? 'portrait:first-of-type:col-span-full portrait:last-of-type:col-span-full portrait:last-of-type:border-b'
          : 'portrait:last-of-type:border-r portrait:only-of-type:border-b portrait:[&:nth-of-type(3)]:col-span-full landscape:[&:nth-of-type(5)]:col-span-2 landscape:[&:nth-of-type(5)]:row-span-2'
      } first-row-top-border relative flex list-none flex-col justify-between border-primary-gray landscape:border-b landscape:border-l landscape:last-of-type:border-r landscape:[&:nth-of-type(4)]:border-r [&:nth-of-type(7)]:border-r`}
      key={product._id.toString()}
    >
      <div
        // hover:scale-105 group-hover:scale-105
        className="group aspect-[3/4] h-full w-full transform overflow-hidden border-primary-gray transition duration-300 even:border-l-0 group-hover:ease-in-out portrait:aspect-[4/5] portrait:border portrait:odd:border-r-0"
      >
        <Link
          to={'/product/' + product._id}
          className="h-full w-full"
          aria-label={`product: ${product.productName}`}
        >
          <picture>
            <source
              srcSet={webpURL}
              type="image/webp"
            />
            <img
              src={imageURL}
              alt={`product image: ${product.productName}`}
              // group-hover:h-[105%] group-hover:w-[105%] group-hover:invisible
              className="h-[calc(100%_-_1px)] w-[calc(100%_-_1px)] object-cover object-center opacity-100 transition-all duration-300 group-hover:opacity-0"
              height="1600"
              width="1600"
            />
          </picture>
          {hoverURL ? (
            <video
              // src={hoverURL}
              loop
              autoPlay
              muted
              playsInline
              controls={false}
              // group-hover:visible
              className="absolute right-0 top-0 h-[calc(100%_-_1px)] w-[calc(100%_-_1px)] object-cover object-center opacity-0 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100"
            >
              <source
                src={hoverURL}
                type={
                  hoverURL.split('.').at(-1) === 'mp4'
                    ? 'video/mp4'
                    : 'image/gif'
                }
              />
              <source
                src={convertMediaUrl(hoverURL)}
                type="video/webm"
              />
            </video>
          ) : (
            <picture>
              <source
                srcSet={convertMediaUrl(hoverFallback!)}
                type="image/webp"
              />
              <img
                src={hoverFallback}
                alt={`alternate image: ${product.productName}`}
                className="absolute right-0 top-0 h-[calc(100%_-_1px)] w-[calc(100%_-_1px)] object-cover object-center opacity-0 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100"
                height="1600"
                width="1600"
              />
            </picture>
          )}
        </Link>

        <FavoritesButton product={product} />
      </div>

      <div className="place-items-stretch border-primary-gray px-2  text-start portrait:border-l portrait:pb-4 landscape:border-t">
        <p
          className={`${
            product.productName.length > 10
              ? 'overflow-hidden text-ellipsis whitespace-nowrap text-xs lg:text-sm 2xl:text-base'
              : ''
          } pt-2   font-grotesque text-xs lg:text-sm 2xl:text-base portrait:pt-1`}
        >
          <Link to={'/product/' + product._id}>
            {product.productName.toUpperCase()}
          </Link>
        </p>
        <p className=" pb-2 font-grotesque text-xs lg:text-sm 2xl:text-base portrait:pt-0">
          ${product.price}
        </p>
      </div>
    </li>
  );
}
