import { TCFMode } from './Navbar';

export type CartQtyIndicatorProps = {
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<TCFMode>>;
  mobileMenu: boolean;
  cartItemsQty: number;
};

export default function CartQtyIndicator({
  setMode,
  setIsCartFavWrapperHidden,
  mobileMenu,
  cartItemsQty,
}: CartQtyIndicatorProps) {
  return (
    <section className="relative">
      {cartItemsQty > 0 && (
        <div
          onClick={() => {
            setMode('cart');
            setIsCartFavWrapperHidden(false);
          }}
          className={` ${
            mobileMenu
              ? '-right-[2.6rem] w-[1.4rem] text-[1rem] pb-1'
              : 'right-0 w-[.8rem] text-[.5rem]'
          } absolute top-3 z-0 flex aspect-square -translate-y-1/2 items-center justify-center rounded-full bg-primary-gray font-grotesque  leading-[0] text-white lg:right-[.5] lg:top-4 lg:w-[1rem] lg:text-[.7rem] 3xl:w-[1.2rem] 3xl:pb-1 3xl:text-[.8rem] portrait:md:text-[.8rem] portrait:md:w-[1.2rem] portrait:md:top-5 portrait:md:right-[.1rem]`}
        >
          {cartItemsQty}
        </div>
      )}
    </section>
  );
}
