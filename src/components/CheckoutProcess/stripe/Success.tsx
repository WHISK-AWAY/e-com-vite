import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAuthUserId } from '../../../redux/slices/authSlice';
import {
  createOrder,
  resetOrderState,
  selectOrderState,
} from '../../../redux/slices/orderSlice';
// import { fetchUserCart, selectCart } from '../../../redux/slices/cartSlice';
import { useEffect } from 'react';
import { selectSingleUser } from '../../../redux/slices/userSlice';
import { TOrder } from '../../../redux/slices/orderSlice';

// * 4242 4242 4242 4242
export default function Success() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const { singleOrder } = useAppSelector(selectOrderState);
  // const cart = useAppSelector(selectCart);
  const user = useAppSelector(selectSingleUser);

  console.log('user', user);

  const orderDetails = () => {
    console.log('hello from orderDetails function @ Success.tsx');
    const userOrder = {} as Partial<TOrder>;
    userOrder.orderDetails = [];
    for (let product of user.user.cart.products) {
      userOrder.orderDetails.push({
        productId: product._id,
        productName: product.product.productName,
        productLongDesc: product.product.productLongDesc,
        productShortDesc: product.product.productShortDesc,
        brand: product.product.brand,
        imageURL: product.product.imageURL,
        price: product.price,
        qty: product.qty,
      });
    }

    const usr = {
      user: {
        userId: userId,
        shippingInfo: {
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          email: user.user.email,
          address_1: user.user.address!.address_1,
          address_2: user.user.address?.address_2,
          city: user.user.address?.city!,
          state: user.user.address?.state!,
          zip: user.user.address?.zip!,
        },
      },
    } as Pick<TOrder, 'user'>;
    // (usr.user.userId = user.user._id),

    userOrder.orderStatus = 'confirmed';
    userOrder.date = new Date();
    userOrder.user = usr.user;

    console.log('UO', userOrder);
    return userOrder;
  };

  useEffect(() => {
    if (user.user?._id && userId) {
      dispatch(createOrder({ userId, order: orderDetails() as TOrder }));
    }
  }, [user, userId]);

  function resetOrder() {
    dispatch(resetOrderState());
  }

  useEffect(() => {
    return resetOrder;
  }, []);

  // useEffect(() => {
  //   if (userId && user.user?.address && cart.cart.products)
  //     dispatch(createOrder({ userId, order: orderDetails() as TOrder }));
  //   if (userId) dispatch(fetchUserCart(userId));
  // }, [userId, user]);

  // useEffect(() => {
  //   if (user.user?.address && cart.cart.products) orderDetails();
  // }, [cart, user]);

  if (!singleOrder)
    return (
      <div>
        <h1>hooray</h1>
      </div>
    );

  return (
    <div className="order-confirmation">
      <h1>ORDER CONFIRMATION</h1>
      <h2>Items:</h2>
      {singleOrder.orderDetails.map((item) => (
        <div className="order-detail-item" key={item.productId}>
          <p>Item: {item.productName}</p>
          <img src={item.imageURL} />
          <p>Qty: {item.qty}</p>
          <p>Price: {item.price}</p>
        </div>
      ))}
      <h2>Subtotal: {singleOrder.subtotal}</h2>
      <h2>Order Total: {singleOrder.total}</h2>
    </div>
  );
}
