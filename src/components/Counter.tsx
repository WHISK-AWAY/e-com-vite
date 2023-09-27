import { useEffect, useState } from 'react';
import plus from '../../src/assets/icons/circlePlus.svg';
import minus from '../../src/assets/icons/circleMinus.svg';
import { useAppDispatch } from '../redux/hooks';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { fetchSingleUser } from '../redux/slices/userSlice';

export default function Counter({
  qty,
  productId,
  userId,
  totalQty,
  mobileMenu
}: {
  qty: number;
  productId: string;
  userId: string;
  totalQty: number;
  mobileMenu: boolean
}) {
  const [counter, setCounter] = useState(qty);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCounter(qty);
  }, [qty]);

  const incrementor = () => {
    if (totalQty < 1) return;
    else setCounter(counter + 1);
    dispatch(addToCart({ productId, qty: 1, userId })).then(() =>
      dispatch(fetchSingleUser(userId))
    );
  };

  const decrementor = () => {
    let userQty = counter;
    if (userQty <= 1) setCounter(1);
    else setCounter(counter - 1);

    dispatch(removeFromCart({ userId, productId, qty: 1 })).then(() =>
      dispatch(fetchSingleUser(userId))
    );
  };

  return (
    <div className="flex w-fit items-center gap-3 rounded-full border border-charcoal px-1">
      <img
        src={minus}
        alt={`reduce quantity (currently ${counter})`}
        className={`${
          mobileMenu ? 'h-5' : 'h-3'
        } lg:h-4 xl:h-5 portrait:md:h-6`}
        onClick={decrementor}
      />
      <p className={` ${mobileMenu ? 'text-[1rem] py-1' : '' } font-grotesque text-sm lg:text-base portrait:md:py-2 portrait:md:text-[1.3rem]`}>
        {counter}
      </p>
      <img
        src={plus}
        alt={`increase quantity (currently ${counter})`}
        className={`${
          mobileMenu ? 'h-5' : 'h-3'
        } lg:h-4 xl:h-5 portrait:md:h-6`}
        onClick={incrementor}
      />
    </div>
  );
}
