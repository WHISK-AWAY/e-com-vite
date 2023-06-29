import { Link } from 'react-router-dom';
import { TProduct } from '../../redux/slices/allProductSlice';

export type BestsellersHeaderProps = {
  filter: string;
  allProdsBg: string;
  randomProd: TProduct;
};

export default function BestsellersHeader({
  filter,
  allProdsBg,
  randomProd,
}: BestsellersHeaderProps) {
  return (
    <>
      <section className='w-11/12'>
        <h1 className='absolute right-0 top-10 font-italiana text-6xl uppercase tracking-wide md:top-6 lg:text-8xl 2xl:top-20 2xl:text-9xl'>
          bestsellers
        </h1>

        <img src={allProdsBg} className='object-cover' />
      </section>
    </>
  );
}
