import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAuthUserId } from '../../../redux/slices/authSlice';
import {
  createOrder,
  selectOrderState,
} from '../../../redux/slices/orderSlice';
import { fetchUserCart, selectCart } from '../../../redux/slices/cartSlice';
import { useEffect } from 'react';
import { selectSingleUser } from '../../../redux/slices/userSlice';
import { TOrder } from '../../../redux/slices/orderSlice';

export default function Success() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const order = useAppSelector(selectOrderState);
  const cart = useAppSelector(selectCart);
  const user = useAppSelector(selectSingleUser);

  console.log('user', user);
  const orderDetails = () => {
    const userOrder = {} as Partial<TOrder>;
    userOrder.orderDetails = [];
    for (let product of cart.cart.products) {
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
    if (userId && user.user?.address && cart.cart.products)
      dispatch(createOrder({ userId, order: orderDetails() as TOrder }));
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId, user]);

  // useEffect(() => {
  //   if (user.user?.address && cart.cart.products) orderDetails();
  // }, [cart, user]);

  return (
    <div>
      <h1>hooray</h1>
    </div>
  );
}
