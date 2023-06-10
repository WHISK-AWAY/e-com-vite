import { TProduct } from '../../redux/slices/allProductSlice';
import { useEffect, useState } from 'react';

export default function ProductCarousel({
  products,
  num,
}: {
  products: Omit<TProduct, 'relatedProducts'>[];
  num: number;
}) {
  const [prodIdx, setProdIdx] = useState(0);
  const [prodCopy, setProdCopy] = useState<Omit<TProduct, 'relatedProducts'>[]>(
    []
  );
  const [renderProduct, setRenderProduct] = useState<
    Omit<TProduct, 'relatedProducts'>[]
  >([]);


  const incrementor = () => {
    setProdCopy((prev) => [...prev.slice(1), prev[0]]);
  };

  useEffect(() => {
    setProdCopy([...products]);
  }, []);

  useEffect(() => {
    setRenderProduct(prodCopy.slice(num))
  }, [prodCopy])

  console.log(Array(num));

  const decrementor = () => {
    setProdCopy((prev) => [
      ...prev.slice(products.length - 1),
      ...prev.slice(0, -1),
    ]);
  };

  // decrementor()
  return (
    <div>
      <div onClick={incrementor}>+</div>
      <div>{prodCopy.length && prodCopy[0].productName}</div>
      {renderProduct.map((prod, idx) => {
        return <p>$$${prod.price}</p>;
      })}
      <div onClick={decrementor}>-</div>
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
