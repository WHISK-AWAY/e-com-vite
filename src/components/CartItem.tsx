import { useAppDispatch } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { useState } from 'react';
import type { TProduct } from '../redux/slices/cartSlice';
import x from '../../src/assets/icons/x.svg';
import plus from '../../src/assets/icons/circlePlus.svg';
import minus from '../../src/assets/icons/circleMinus.svg';

export type CartProps = {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  product: TProduct;
  userId: string;
  qty: number;
};

export default function CartItem(props: CartProps) {
  const navigate = useNavigate();
  const { product, userId, qty, setIsHidden } = props;
  const { price, images, _id } = product;
  const dispatch = useAppDispatch();
  const [count, setCount] = useState<number>(qty);

  const handleRemove = (productId: string, qty: number) => {
    dispatch(removeFromCart({ userId: userId!, productId, qty }));
  };

  const totalQty = product.qty;

  const handleDecrement = () => {
    if (count <= 1) setCount(1);
    else setCount(count - 1);
    dispatch(
      removeFromCart({ userId: userId!, productId: product._id, qty: 1 })
    );
  };

  const handleIncrement = () => {
    if (count >= totalQty) return;
    else setCount(count + 1);
    dispatch(addToCart({ userId: userId!, productId: product._id, qty: 1 }));
  };

  function goToProduct() {
    if (!product) return;
    navigate(`/product/${product._id}`);
    setIsHidden(true);
  }

  return (
    <div className='cart-item-container w-9/10 relative flex h-fit items-center justify-center gap-2 pt-3 lg:gap-4'>
      <div className='image-wrapper flex h-full shrink-0 grow-0 basis-1/3 flex-col justify-center'>
        <img
          className='aspect-[3/4] cursor-pointer object-cover'
          onClick={goToProduct}
          src={
            images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || images[0].imageURL
          }
        />
      </div>
      <div className='flex h-full basis-2/3 flex-col items-center justify-center gap-1'>
        <img
          src={x}
          alt='x-icon'
          onClick={() => handleRemove(_id, qty)}
          className='absolute right-0 top-0 h-2 w-3 cursor-pointer lg:h-3 lg:w-3'
        />
        <div className='upper-wrapper flex w-full flex-col items-center'>
          <h2
            onClick={goToProduct}
            className='cursor-pointer text-center font-hubbali text-xs uppercase lg:text-sm xl:text-base 2xl:text-lg'
          >
            {product.productName}
          </h2>
          <div className='lg:text-md text-center font-grotesque text-sm xl:text-base'>
            ${price}
          </div>
        </div>
        <div className='flex w-14 items-center justify-around self-center rounded-full border border-charcoal/70 lg:w-16  xl:w-24'>
          <img
            src={minus}
            alt='minus-icon'
            onClick={handleDecrement}
            className='h-3 cursor-pointer lg:h-3 xl:h-5'
          />
          <span className='lg:text-md font-grotesque  text-sm lg:px-2 xl:px-4 xl:text-lg'>
            {count}
          </span>
          <img
            src={plus}
            alt='plus-icon'
            onClick={handleIncrement}
            className='h-3 cursor-pointer lg:h-3 xl:h-5'
          />
        </div>
      </div>
    </div>
  );
}
