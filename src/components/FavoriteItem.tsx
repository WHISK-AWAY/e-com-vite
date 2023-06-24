import { useState } from 'react';
import { TProduct } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import plus from '../../src/assets/icons/circlePlus.svg';
import minus from '../../src/assets/icons/circleMinus.svg';
import { useAppDispatch } from '../redux/hooks';
import { removeFromCart } from '../redux/slices/cartSlice';

export type TFavoriteItemProp = {
  product: TProduct;
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
};

export default function FavoriteItem({
  product,
  userId,
  handleAddToCart,
}: TFavoriteItemProp) {
  const [count, setCount] = useState<number>(1);
  const dispatch = useAppDispatch();

  const totalQty = product.qty;
  const userQty = count;

  const qtyDecrementer = () => {
    if (userQty <= 1) setCount(1);
    else setCount(userQty - 1);
  };

  const qtyIncrementor = () => {
    if (userQty >= totalQty) return;
    else setCount(userQty + 1);
  };

  return (
    <section className='w-9/10 flex flex-col items-center'>
      <div className='flex w-full flex-row-reverse items-center justify-center'>
        <section className='flex w-8/12 flex-row-reverse items-center self-center p-2'>
          <div className='prod-detail-section flex w-full flex-col  '>
            <h2 className='lg:text-base mb-3 md:mb-1 md:text-xs items-center px-5 md:px-1 text-center self-center font-hubbali text-sm uppercase lg:mx-1 xl:text-base 2xl:text-xl'>
              <Link to={`/product/${product._id}`}>{product.productName}</Link>
            </h2>

            <div className='flex flex-col items-center'>
              <p className='lg:mb-1 text-center font-grotesque 2xl:text-lg md:text-sm'>
                ${product.price}
              </p>

              <div className='flex h-full w-14 md:w-12 items-center justify-around self-center rounded-full border border-charcoal 2xl:py-1 lg:w-16  xl:w-24 xl:py-[3px]'>
                <img
                  src={minus}
                  alt='minus-icon'
                  onClick={qtyDecrementer}
                  className='h-3 lg:h-3 xl:h-5'
                />
                <span className='lg:text-md font-grotesque  lg:px-2 xl:px-4 xl:text-base 2xl:text-base md:text-xs'>
                  {count}
                </span>
                <img
                  src={plus}
                  alt='plus-icon'
                  onClick={qtyIncrementor}
                  className='h-3 lg:h-3 xl:h-5 '
                />
              </div>
            </div>
          </div>
        </section>

        <img
          className='aspect-[3/4] h-32  object-cover lg:h-44'
          src={
            product.images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || product.images[0].imageURL
          }
        />
      </div>
      <div className='flex w-[40%] lg:w-[60%] md:w-[100%] md:mt-2 mt-4 mb-9 2xl:mt-4 justify-center items-center rounded-sm bg-charcoal text-center text-white'>
        <button
          className=' flex items-center justify-center rounded-sm py-1 md:text-sm font-italiana uppercase 2xl:text-lg'
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
      </div>
    </section>
  );
}
