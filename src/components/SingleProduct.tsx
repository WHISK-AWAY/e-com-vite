import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchSingleProduct,
  selectSingleProduct,
} from '../redux/slices/allProductSlice';
import { getUserId, selectAuth } from '../redux/slices/authSlice';
import { addToCart, selectCart } from '../redux/slices/cartSlice';

export default function SingleProduct() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const singleProduct = useAppSelector(selectSingleProduct);
  const userId = useAppSelector(selectAuth);
  const userCart = useAppSelector(selectCart);

  // console.log('userID from singleprod', userId);
  useEffect(() => {
    if (productId) dispatch(fetchSingleProduct(productId));

    dispatch(getUserId());
  }, [productId]);

//TODO do it tmr
  // console.log('suerID', userId)
  useEffect(() => {
    if (userId.userId) dispatch(addToCart(userId.userId));
  }, []);

  const handleClick = () => {};

  if (!singleProduct) return <p>...Loading</p>;
  return (
    <section className='single-product-container'>
      <div className='single-product-info'>
        <p> {singleProduct.productName.toUpperCase()}</p>
        <img src={singleProduct.imageURL} alt='single product view' />
        <p>{singleProduct.productLongDesc}</p>
        <p>{singleProduct.price}</p>
      </div>
      <button onClick={handleClick}>add to cart</button>
    </section>
  );
}
