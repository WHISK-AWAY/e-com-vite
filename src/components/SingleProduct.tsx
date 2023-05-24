import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchSingleProduct,
  selectSingleProduct,
} from '../redux/slices/allProductSlice';
import { getUserId, selectAuth } from '../redux/slices/authSlice';
import { addToCart, selectCart } from '../redux/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../redux/slices/userSlice';

export default function SingleProduct() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const singleProduct = useAppSelector(selectSingleProduct);
  const { userId } = useAppSelector(selectAuth);
  const userCart = useAppSelector(selectCart);
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    if (productId) dispatch(fetchSingleProduct(productId));

    dispatch(getUserId());
  }, [productId]);

  const qtyIncrementor = () => {
    let userQty: number = count;
    const totalQty: number = singleProduct!.qty!;
    if (userQty! >= totalQty) setCount(totalQty);
    else setCount(count + 1);
  };

  const qtyDecrementor = () => {
    let userQty: number = count;
    if (userQty! <= 1) setCount(count);
    else setCount(count - 1);
  };

  const handleClick = () => {
    if (userId && productId)
      dispatch(addToCart({ userId, productId, qty: count }));
  };

  if (!singleProduct) return <p>...Loading</p>;

  const handleFavoriteAdd = () => {
    dispatch(
      addToFavorites({
        userId: userId!,
        productId: singleProduct._id.toString(),
      })
    );
  };

  const handleFavoriteRemove = () => {
    dispatch(removeFromFavorites({userId: userId!, productId: String(singleProduct._id)}))
  }

  return (
    <section className="single-product-container">
      <div className="single-product-info">
        <p> {singleProduct.productName.toUpperCase()}</p>
        <img src={singleProduct.imageURL} alt="single product view" />
        <p>{singleProduct.productLongDesc}</p>
        <p>{singleProduct.price}</p>
      </div>
      <div onClick={qtyIncrementor}>+</div>
      <div>{count}</div>
      <div onClick={qtyDecrementor}>-</div>
      <button onClick={handleClick}>add to cart</button>
      <br/>
      <button onClick={handleFavoriteAdd}>&lt;3</button>
      <br/>
      <button onClick={handleFavoriteRemove}>remove from favorite</button>
    </section>
  );
}
