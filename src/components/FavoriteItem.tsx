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
    <section className='flex flex-col'>
      <div className='flex flex-col'>
        <section className='flex flex-row-reverse p-5'>
          <div className='prod-detail-section flex flex-col'>
            <h2 className='lg:text-md top-10 mb-2 mt-5 text-center font-hubbali text-sm  uppercase lg:mx-1 lg:mt-10 xl:text-xl'>
              <Link to={`/product/${product._id}`}>{product.productName}</Link>
            </h2>
            <div className='flex flex-col'>
              <p className='text-center font-grotesque'>${product.price}</p>

              <div className='flex w-14 items-center justify-around self-center rounded-full border border-charcoal lg:w-16  xl:w-24 '>
                <img
                  src={minus}
                  alt='minus-icon'
                  onClick={qtyDecrementer}
                  className='h-3 lg:h-3 xl:h-5'
                />
                <span className='lg:text-md font-grotesque  text-sm lg:px-2 xl:px-4 xl:text-lg'>
                  {count}
                </span>
                <img
                  src={plus}
                  alt='plus-icon'
                  onClick={qtyIncrementor}
                  className='h-3 lg:h-3 xl:h-5'
                />
              </div>
            </div>
          </div>

<div className='flex justify-center items-center'>

          <img
            className='aspect-[3/4] h-32  object-cover lg:h-48'
            src={
              product.images.find(
                (image) => image.imageDesc === 'product-front'
                )?.imageURL || product.images[0].imageURL
              }
              />
              </div>
        </section>
        <div className='ml-5 flex w-40 justify-center rounded-sm bg-charcoal text-white '>
          <button
            className='flex flex-col justify-end font-italiana uppercase '
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
      </div>
    </section>
  );
}
