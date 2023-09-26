import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProduct, removeFromFavorites } from '../redux/slices/userSlice';
import plus from '../../src/assets/icons/circlePlus.svg';
import minus from '../../src/assets/icons/circleMinus.svg';
import x from '../../src/assets/icons/x.svg';
import { useAppDispatch } from '../redux/hooks';
import { getMaxQty } from '../utilities/helpers';
import 'lazysizes';

export type TFavoriteItemProp = {
  product: UserProduct;
  userId: string;
  handleAddToCart: ({
    userId,
    productId,
    qty,
  }: {
    userId: string;
    productId: string;
    qty: number;
  }) => void;
  closeSlider: () => void;
};

export default function FavoriteItem({
  product,
  userId,
  handleAddToCart,
  closeSlider,
}: TFavoriteItemProp) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(0);
  const maxQty = useMemo(() => getMaxQty(product, userId), [product, userId]);

  useEffect(() => {
    // initialize counter
    if (maxQty > 0) {
      setCount(1);
    } else setCount(0);
  }, [product]);

  const qtyDecrementor = () => {
    if (count <= 1) return;
    setCount((prev) => Math.min(prev - 1, maxQty));
  };

  const qtyIncrementor = () => {
    if (count >= maxQty) {
      setCount(maxQty);
    } else setCount((prev) => prev + 1);
  };

  const handleRemove = ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    dispatch(removeFromFavorites({ userId, productId }));
  };

  function goToProduct() {
    if (!product) return;
    closeSlider();
    navigate(`/product/${product._id}`);

    // setIsHidden(true);
  }

  return (
    <section className="fav-item-container w-9/10 relative flex h-full flex-col items-center gap-4">
      <article className="product-card flex h-fit w-full items-center justify-center gap-4 pt-3">
        <div className="image-wrapper flex h-full shrink-0 grow-0 basis-1/3 flex-col justify-center">
          <img
            className="lazyload aspect-[3/4] cursor-pointer object-cover"
            onClick={goToProduct}
            alt={`product image: ${product.productName}`}
            data-src={
              product.images.find(
                (image) => image.imageDesc === 'product-front'
              )?.imageURL || product.images[0].imageURL
            }
            data-sizes="auto"
          />
        </div>
        <div className="prod-detail flex h-full basis-2/3 flex-col items-center justify-center gap-1">
          <div className="upper-wrapper flex w-full flex-col items-center">
            <h2
              onClick={goToProduct}
              className="cursor-pointer items-center self-center text-center font-grotesque text-xs uppercase  xl:text-base  portrait:text-[1rem] landscape:short:text-sm"
            >
              {product.productName}
            </h2>

            <p className="portrait:text-[1rem]portrait:pt-1 text-center font-grotesque text-sm lg:text-base 2xl:text-lg landscape:short:text-sm">
              ${product.price}
            </p>
          </div>
          <div className="qty-controller align-center flex h-fit w-14 items-center justify-around self-center rounded-full border border-charcoal lg:w-16 xl:w-24   portrait:mt-3 portrait:w-20 portrait:md:py-1 landscape:short:w-16">
            <img
              src={minus}
              alt={`reduce quantity (currently ${count})`}
              onClick={qtyDecrementor}
              className="h-3 cursor-pointer duration-100 ease-in-out active:scale-125 lg:h-3 xl:h-5 portrait:h-5 landscape:short:h-4"
            />
            <span className=" py-1 font-grotesque  text-sm leading-none  lg:px-2 lg:py-0 lg:text-sm xl:pb-1 xl:text-lg portrait:pb-1 portrait:text-[1.1rem] landscape:short:py-0 landscape:short:text-sm">
              {count}
            </span>
            <img
              src={plus}
              alt={`increase quantity (currently ${count})`}
              onClick={qtyIncrementor}
              className="h-3 cursor-pointer duration-100 ease-in-out active:scale-125 lg:h-3 xl:h-5 portrait:h-5 landscape:short:h-4"
            />
          </div>
        </div>
      </article>

      {/*button*/}
      <button
        className="mb-1 flex  w-[60%] justify-center self-end rounded-sm bg-charcoal py-1 text-center font-poiret text-xs uppercase text-white  disabled:bg-charcoal/40 lg:py-2 2xl:text-lg portrait:py-2 portrait:text-[1rem] landscape:short:text-sm"
        disabled={maxQty === 0}
        onClick={() =>
          handleAddToCart({
            userId,
            productId: product._id.toString(),
            qty: count,
          })
        }
      >
        add to cart
      </button>
      <img
        src={x}
        alt="remove item from favorites"
        className="absolute right-0 top-0 h-2  w-3 cursor-pointer lg:h-3 lg:w-3 portrait:h-4"
        onClick={() => handleRemove({ userId, productId: product._id })}
      />
    </section>
  );
}
