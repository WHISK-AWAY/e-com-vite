import { useEffect } from 'react';
import minus from '../../assets/icons/circleMinus.svg'
import plus from '../../assets/icons/circlePlus.svg'

import { gsap } from 'gsap';

export type mobileAddToCartHelperProps = {
    qtyIncrementor: () => void;
    qtyDecrementor: () => void;
    count: number;
    productName: string;
    price: number;
    handleAddToCart: () => void;
    maxQty:number
};






export default function MobileAddToCartHelper({qtyIncrementor, qtyDecrementor, count, productName, price, handleAddToCart, maxQty}: mobileAddToCartHelperProps) {


        useEffect(() => {
          if (!'.mobile-helper-wrapper') return;
          const ctx = gsap.context(() => {
            gsap.from('.mobile-helper-wrapper', {
              yPercent: 200,
              delay: 1.5,
              duration: .9,
              ease: 'expo.inOut',
            });
          });

          return () => {
            ctx.revert();
          };
        }, []);

  return (
          <section className="mobile-helper-wrapper fixed bottom-0 z-40 flex min-h-[10svh] h-[13svh] w-[100svw] flex-col items-center justify-around  bg-white pb-2 border-t border-primary-gray">
            <div className='self-start'>

              <p className="font-medium font-grotesque  pl-6 text-[1.1rem] leading-none pb-1">{productName}</p>
              <p className='font-light font-grotesque text-[1.1rem]  pl-6 leading-none'>${price}</p>
            </div>

              <div className="items-center justify-around  flex w-full ">
                  <div className="qty-counter flex h-fit w-fit items-center gap-2 rounded-full border border-charcoal/80 px-2">
                      <div
                          onClick={qtyDecrementor}
                          className="cursor-pointer"
                      >
                          <img
                              src={minus}
                              className="w-4 duration-100 ease-in-out active:scale-125 2xl:w-5 portrait:w-5"
                          />
                      </div>
                      <div className=" px-1 py-1  text-center text-[.9rem] font-light">
                          {count}
                      </div>

                      <div
                          onClick={qtyIncrementor}
                          className="incrementor cursor-pointer"
                      >
                          <img
                              src={plus}
                              className="w-4 duration-100 ease-in-out active:scale-125 2xl:w-5 portrait:w-5"
                          />
                      </div>
                  </div>
                  <button
                      onClick={handleAddToCart}
                      disabled={maxQty === 0}
                      className="  w-3/5  overflow-hidden  rounded-sm  bg-charcoal  py-1  font-poiret text-[1rem]   uppercase text-white"
                  >
                      add to cart
                  </button>
              </div>
          </section>
  );
}
