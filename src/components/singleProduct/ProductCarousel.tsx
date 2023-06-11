import { TProduct } from '../../redux/slices/allProductSlice';
import { useEffect, useState } from 'react';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import { useNavigate } from 'react-router';

type RenderProduct = Omit<TProduct, 'relatedProducts'>;

export default function ProductCarousel({
  products,
  num,
}: {
  products: Omit<TProduct, 'relatedProducts'>[];
  num: number;
}) {
  const navigate = useNavigate();
  const [prodIdx, setProdIdx] = useState(0);
  const [prodCopy, setProdCopy] = useState<RenderProduct[]>([]);
  const [renderProduct, setRenderProduct] = useState<RenderProduct[]>([]);

  useEffect(() => {
    setProdCopy([...products]);
  }, []);

  useEffect(() => {
    setRenderProduct(prodCopy.slice(0, num));
  }, [prodCopy, num]);

  const decrementor = () => {
    setProdCopy((prev) => [
      ...prev.slice(products.length - 1),
      ...prev.slice(0, -1),
    ]);
  };
  const incrementor = () => {
    setProdCopy((prev) => [...prev.slice(1), prev[0]]);
  };
  // decrementor()
  return (
    <div className='relative flex items-start justify-center gap-10'>
      <button
        onClick={decrementor}
        className='absolute -left-[50px] top-[175px] shrink-0 self-center'
      >
        <img src={arrowLeft} alt='' className='h-6' />
      </button>
      {renderProduct.map((prod) => {
        return (
          <div
            onClick={() => {
              navigate('/product/' + prod._id);
            }}
            className='ymal-card flex w-[300px] max-w-[300px] cursor-pointer flex-col items-center justify-center gap-5'
          >
            <img
              className='aspect-[7/10] w-[250px] object-cover'
              src={
                prod.images.find((image) => image.imageDesc === 'product-front')
                  ?.imageURL || prod.images[0].imageURL
              }
              alt=''
            />
            <h4 className='text-center font-hubbali text-xl uppercase'>
              {prod.productName}
            </h4>
          </div>
        );
      })}
      <button
        onClick={incrementor}
        className='absolute -right-[50px] top-[175px] shrink-0 self-center'
      >
        <img src={arrowRight} alt='' className='h-6 rotate-180' />
      </button>
    </div>
  );
}

// const decrementor = () => {
//   if (prodIdx === 0) {
//     setProdIdx(products.length - 1);
//   } else setProdIdx(prodIdx - 1);
// };
// const incrementor = () => {
//   if (prodIdx === products.length - 1) {
//     setProdIdx(0);
//   } else setProdIdx(prodIdx + 1);
// };
