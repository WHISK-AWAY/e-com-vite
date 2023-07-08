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
    <section className='fav-item-container w-9/10 relative flex h-full flex-col items-center gap-4'>
      <article className='product-card flex h-fit w-full items-center justify-center gap-4 pt-3'>
        <div className='image-wrapper flex h-full shrink-0 grow-0 basis-1/3 flex-col justify-center'>
          <img
            className='lazyload aspect-[3/4] cursor-pointer object-cover'
            onClick={goToProduct}
            data-src={
              product.images.find(
                (image) => image.imageDesc === 'product-front'
              )?.imageURL || product.images[0].imageURL
            }
            data-sizes='auto'
          />
        </div>
        <div className='prod-detail flex h-full basis-2/3 flex-col items-center justify-center gap-1'>
          <div className='upper-wrapper flex w-full flex-col items-center'>
            <h2
              onClick={goToProduct}
              className='cursor-pointer items-center self-center text-center font-hubbali text-xs uppercase lg:text-sm xl:text-base 2xl:text-lg'
            >
              {product.productName}
            </h2>

            <p className='text-center font-grotesque text-sm 2xl:text-lg'>
              ${product.price}
            </p>
          </div>
          <div className='qty-controller flex w-12 items-center justify-around self-center rounded-full border border-charcoal lg:w-16 xl:w-24 xl:py-[3px] 2xl:py-1'>
            <img
              src={minus}
              alt='minus-icon'
              onClick={qtyDecrementor}
              className='h-3 cursor-pointer lg:h-3 xl:h-5'
            />
            <span className='lg:text-md font-grotesque text-xs lg:px-2 xl:px-4 xl:text-base 2xl:text-base'>
              {count}
            </span>
            <img
              src={plus}
              alt='plus-icon'
              onClick={qtyIncrementor}
              className='h-3 cursor-pointer lg:h-3 xl:h-5'
            />
          </div>
        </div>
      </article>

      {/*button*/}
      <button
        className='flex w-[65%] items-center justify-center rounded-sm bg-charcoal py-1 text-center font-italiana text-sm uppercase text-white disabled:bg-charcoal/40 lg:w-[60%] lg:py-2 2xl:text-lg'
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
        alt='x-icon'
        className='absolute right-0 top-0 h-2  w-3 cursor-pointer lg:h-3 lg:w-3'
        onClick={() => handleRemove({ userId, productId: product._id })}
      />
    </section>
  );
}
