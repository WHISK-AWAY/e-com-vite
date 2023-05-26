import { useState } from 'react';
import { TProduct } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';

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

  const totalQty = product.qty;
  const userQty = count;

  const qtyDecrementer = () => {
    if (userQty <= 1) return count;
    else setCount(userQty - 1);
  };

  const qtyIncrementor = () => {
    if (userQty >= totalQty) return totalQty;
    else setCount(userQty + 1);
  };

  return (
    <section>
      <div>
        <h2>
          <Link to={`/product/${product._id}`}>{product.productName}</Link>
        </h2>
        <img src={product.imageURL} />
        <p>{product.brand}</p>

        <p>{product.productShortDesc}</p>
        <p>{product.price}</p>
        <button onClick={qtyDecrementer}>-</button>
        <p>{count}</p>
        <button onClick={qtyIncrementor}>+</button>
        <button
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
      <br />
    </section>
  );
}
