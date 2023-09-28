import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Stripe, StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import 'lazysizes';

import { selectAuthUserId } from '../../redux/slices/authSlice';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import Checkout from './Checkout';
import {
  TOrder,
  createGuestOrder,
  createOrder,
} from '../../redux/slices/orderSlice';
import {
  fetchSinglePromo,
  selectPromo,
  selectPromoErrors,
} from '../../redux/slices/promoCodeSlice';
import { TShippingAddress } from '../../redux/slices/userSlice';
import ManageShippingAddress from '../UserAccount/shippingAddress/ManageShippingAddress';
import {
  selectCart,
  removeFromCart,
  fetchUserCart,
} from '../../redux/slices/cartSlice';
import { orderAddressArray } from '../../utilities/helpers';
import Counter from '../Counter';

import oceanBg from '../../../src/assets/bg-img/ocean.jpg';
import sandLady from '../../../src/assets/bg-img/lady-rubbing-sand-on-lips.jpg';
import x from '../../../src/assets/icons/x.svg';
const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export default function Recap({mobileMenu} : {mobileMenu: boolean}) {
  const dispatch = useAppDispatch();

  const userId = useAppSelector(selectAuthUserId);
  const { user } = useAppSelector(selectSingleUser);
  const verifyPromo = useAppSelector(selectPromo);
  const promoErrors = useAppSelector(selectPromoErrors);
  const { cart } = useAppSelector(selectCart);

  const [promo, setPromo] = useState<string>('');
  const [isCheckoutCancel, setIsCheckoutCancel] = useState<boolean>(false);

  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  // conditional component rendering controllers
  const [clientSecret, setClientSecret] = useState<string>('');
  const [manageShippingAddress, setManageShippingAddress] =
    useState<boolean>(false);

  // address array management
  const [addresses, setAddresses] = useState<TShippingAddress[]>([]);
  const [addressIndex, setAddressIndex] = useState(0);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(fetchUserCart(userId));

    setStripePromise(loadStripe(VITE_STRIPE_PUBLIC_KEY)); // ? hopefully can move all the Stripe stuff to its own home (utilities or similar)
  }, []);

  useEffect(() => {
    // examine user addresses
    // if none, open the manage addresses view & have it render the new address form
    // otherwise, rearrange address array such that any default is at pos'n 0
    if (user) {
      if (user?.shippingAddresses?.length > 0) {
        const addressArray = orderAddressArray(user);
        if (addressArray?.length) setAddresses(addressArray); // this SHOULD get fired when we select a new default...
      } else {
        setAddresses([]);
        setManageShippingAddress(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isCheckoutCancel) {
      setTimeout(() => {
        setIsCheckoutCancel(false);
      }, 5000);
    }
  }, [isCheckoutCancel]);

  useEffect(() => {
    if (promoErrors.status) setPromo('');
  }, [promoErrors.status]);

  /**
   * *ORDER CREATION WITH PENDING STATUS
   */

  const handlePromoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (promo) dispatch(fetchSinglePromo(promo));
    setPromo('');
  };

  const orderDetails = () => {
    /**
     * Construct object for use in order creation
     * Called by submit handler
     */

    const userOrder = {} as Partial<TOrder>;
    userOrder.orderDetails = [];
    for (let product of cart.products) {
      userOrder.orderDetails.push({
        productId: product._id,
        productName: product.product.productName,
        productShortDesc: product.product.productShortDesc,
        imageURL:
          product.product.images.find(
            (image) => image.imageDesc === 'product-front'
          )?.imageURL || product.product.images[0].imageURL,
        price: product.price,
        qty: product.qty,
      });
    }

    const usr = {
      user: {
        userId: userId,
        shippingInfo: {
          firstName: addresses[addressIndex].shipToAddress.firstName,
          lastName: addresses[addressIndex].shipToAddress.lastName,
          email: addresses[addressIndex].shipToAddress.email,
          address_1: addresses[addressIndex].shipToAddress.address_1,
          address_2: addresses[addressIndex].shipToAddress.address_2,
          city: addresses[addressIndex].shipToAddress.city,
          state: addresses[addressIndex].shipToAddress.state,
          zip: addresses[addressIndex].shipToAddress.zip,
        },
      },
    } as Pick<TOrder, 'user'>;

    if (usr.user.shippingInfo.address_2 === '')
      delete usr.user.shippingInfo.address_2;

    userOrder.orderStatus = 'pending';

    if (verifyPromo.promoCodeName) {
      userOrder.promoCode = {
        promoCodeName: verifyPromo.promoCodeName,
        promoCodeRate: verifyPromo.promoRate,
      };
    }

    userOrder.date = new Date();
    userOrder.user = usr.user;

    return userOrder;
  };

  const handleCheckout = async (e: any) => {
    e.preventDefault();

    try {
      if (userId) {
        await dispatch(
          createOrder({ userId, order: orderDetails() as TOrder })
        );
        const { data } = await axios.post(
          'http://localhost:3001/api/checkout/create-payment-intent',
          {},
          { withCredentials: true }
        );
        setClientSecret(data.clientSecret);

        return data;
      } else {
        const order = orderDetails();
        delete order.user!.userId;

        await dispatch(createGuestOrder(order));
        const { data } = await axios.post(
          'http://localhost:3001/api/checkout/create-guest-payment-intent',
          cart,
          { withCredentials: true }
        );
        setClientSecret(data.clientSecret);

        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret!,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
      },
    },
  };

  const handleCancel = () => {
    setClientSecret('');
    setIsCheckoutCancel(true);
  };

  const handleManageShippingAddress = () => {
    // ? could make this in-line if all it's doing is setting a state var
    setManageShippingAddress(true);
  };

  /**
   * ! EARLY RETURN GUARDS (no hooks below here, please!)
   */

  if (!cart?.products) return <h1>Loading cart...</h1>;
  if (!stripePromise) return <h1>Loading stripe...</h1>;
  // if (!addresses || addresses.length === 0)
  //   return <h1>Loading address book...</h1>;

  return (
    <div className="recap-container m-[5%] mx-auto flex h-full w-[80%] flex-col portrait:w-[95svw]">
      <section className="order-recap flex flex-col items-center">
        {/* PRODUCTS RECAP */}

        <div className="header-section w-[80%] border-l border-r border-t border-charcoal py-2 text-center font-poiret text-xl">
          <h1>ORDER CONFIRMATION</h1>
        </div>

        <div
          className={` ${
            mobileMenu ? 'p-5' : 'p-10 '
          } product-recap flex  w-full justify-between gap-10 border border-charcoal portrait:md:p-10`}
        >
          <div className="flex w-3/5 flex-col portrait:w-full">
            {cart.products.map((item) => {
              return (
                <div
                  key={item._id}
                  className="flex h-56 portrait:gap-5 "
                >
                  <img
                    src={x}
                    className="h-3 w-5 pr-3 portrait:h-6 "
                    alt="remove item from cart"
                    onClick={async () => {
                      await dispatch(
                        removeFromCart({
                          productId: item.product._id.toString(),
                          userId,
                          qty: item.qty,
                        })
                      );
                      dispatch(fetchSingleUser(userId?.toString()!));
                    }}
                  />
                  <div className="w-28 lg:w-40">
                    <img
                      className="lazyload aspect-[3/4] object-cover  portrait:md:aspect-[2/4]"
                      alt={`product image: ${item.product.productName}`}
                      data-src={
                        item.product.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || item.product.images[0].imageURL
                      }
                      data-sizes="auto"
                    />
                  </div>
                  <div className="flex w-3/5 flex-col items-center  justify-center self-start pt-[3%]">
                    <p
                      className={`${
                        mobileMenu ? 'pb-0 text-[1rem]' : 'text-sm'
                      } pb-2 text-center font-hubbali uppercase md:pl-5 lg:pb-5 lg:pr-5 lg:text-base xl:text-xl portrait:md:text-[1.3rem] `}
                    >
                      {item.product.productName}
                    </p>
                    <p
                      className={` ${
                        mobileMenu ? 'text-[1rem]' : 'text-base'
                      } pb-2 font-grotesque lg:text-lg xl:text-lg portrait:md:text-[1.3rem] `}
                    >
                      ${item.product.price}
                    </p>
                    <Counter
                      mobileMenu={mobileMenu}
                      qty={item.qty}
                      productId={item.product._id}
                      userId={user._id}
                      totalQty={item.product.qty}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-img-container relative flex w-2/5 flex-col portrait:hidden">
            <img
              data-src={oceanBg}
              data-sizes="auto"
              alt=""
              className="lazyload"
            />
            <img
              data-src={sandLady}
              alt=""
              className="lazyload absolute top-0 w-4/5 translate-x-[-20%] translate-y-[12%]"
            />
          </div>
        </div>

        <div className="flex h-40 w-[85%] flex-col justify-center  bg-[#31333A] portrait:h-80 portrait:w-[90svw]">
          <h2
            className={`${
              mobileMenu ? 'text-[1.2rem]' : ''
            } pl-5 font-poiret text-base uppercase tracking-wide text-white lg:text-xl portrait:md:text-[1.4rem]`}
          >
            order subtotal: ${cart.subtotal}
          </h2>
          {/* PROMO CODE SECTION */}
          {verifyPromo && !verifyPromo.promoRate ? (
            <section
              className={` ${
                mobileMenu ? 'self-center pt-3' : 'self-start pt-6'
              } promo-section flex text-white md:items-center md:justify-center lg:pl-10 `}
            >
              <form
                className={` ${
                  mobileMenu ? 'flex-col items-center' : ''
                } mx-5 flex h-10 flex-nowrap md:items-center   `}
                onSubmit={(e) => handlePromoSubmit(e)}
              >
                <label
                  htmlFor="promo-code"
                  className="h-full border border-white px-2 py-2 font-grotesque text-sm lg:px-16 lg:text-base portrait:border-none portrait:text-[1.3rem] "
                >
                  enter your promo code:
                </label>

                <input
                  id="promo-code"
                  type="text"
                  value={promo}
                  placeholder={promoErrors.status ? 'invalid promo code' : ''}
                  onChange={(e) => setPromo(e.target.value)}
                  className="address-no-focus text-placeholder mx-2 border-2 border-white text-sm text-charcoal focus:border-charcoal/50"
                ></input>
                <button
                  className={` ${
                    mobileMenu
                      ? 'mt-3 w-[90%] py-2 text-[1rem]'
                      : 'text-sm lg:text-lg'
                  } h-full border border-white px-10  font-poiret uppercase `}
                >
                  verify
                </button>
              </form>
            </section>
          ) : (
            <div className="flex flex-col gap-2 pl-5 pt-2">
              <p className="font-poiret text-base text-white lg:text-xl portrait:md:text-[1.2rem]">
                <span className="uppercase portrait:md:text-[1.4rem]">
                  discount:
                </span>{' '}
                (promo code '{verifyPromo.promoCodeName}
                '): - ${(cart.subtotal * verifyPromo.promoRate).toFixed(2)}
              </p>
              <p className="font-poiret text-base text-white lg:text-3xl portrait:md:text-[1.3rem]">
                <span className="uppercase portrait:md:text-[1.4rem]">
                  order total:
                </span>{' '}
                ${(cart.subtotal * (1 - verifyPromo.promoRate)).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PLAIN TEXT USER ADDRESS */}
      <section className="flex w-[100%] flex-col  border border-charcoal">
        <div
          className={`${
            mobileMenu && addresses.length > 0 ? ' justify-between pl-3' : ''
          } relative flex  place-items-center border-b justify-center border-charcoal font-poiret`}
        >
          <h1 className="items-center py-3 text-center text-xl">
            {!clientSecret ? 'SHIPPING INFO' : 'PAYMENT INFO'}
          </h1>
          {!clientSecret && (
            <div className="absolute right-3 flex">
              {!manageShippingAddress ? (
                <button
                  className=" rounded-sm bg-charcoal px-4 py-1 text-white  lg:px-10"
                  onClick={handleManageShippingAddress}
                >
                  MANAGE ADDRESSES
                </button>
              ) : addresses.length > 0 ? (
                <button
                  onClick={() => setManageShippingAddress(false)}
                  className="rounded-sm bg-charcoal px-6 py-1 text-sm text-white  lg:px-10"
                >
                  CANCEL
                </button>
              ) : (
                ''
              )}
            </div>
          )}
        </div>

        <div className="shipping-detail m-20 flex h-full w-[80%] flex-col items-center justify-center self-center portrait:w-[85%]">
          {!clientSecret && (
            <div className="flex h-full w-[100%] flex-col items-center lg:w-[60%] xl:w-[110%] 2xl:w-[80%]">
              <h2
                className={` ${
                  mobileMenu ? 'text-[1rem]' : 'text-lg'
                } h-full w-[80%] whitespace-nowrap border-l border-r border-t border-charcoal  py-2 text-center  font-poiret uppercase  md:w-4/6 lg:w-5/6 xl:w-3/6 2xl:w-5/12`}
              >
                {manageShippingAddress
                  ? userId
                    ? 'address book'
                    : 'delivery address'
                  : 'your order will be delivered to:'}{' '}
              </h2>
            </div>
          )}
          {!clientSecret ? (
            <div className="relative flex h-full  w-full max-w-[800px] border border-charcoal font-grotesque text-sm md:w-5/6 lg:w-4/6  lg:text-base xl:w-4/6 2xl:w-3/6 portrait:text-[1.2rem] ">
              {!manageShippingAddress && addresses.length > 0 ? (
                <>
                  <div
                    className={`${
                      mobileMenu ? 'w-2/6' : 'w-2/5'
                    } form-key flex h-full flex-col items-start border-r border-charcoal py-9  leading-loose `}
                  >
                    <div
                      className={` ${
                        mobileMenu ? 'text-[1rem]' : ''
                      } flex flex-col self-center`}
                    >
                      <p className="">full name</p>

                      <p>email</p>
                      <p>address 1</p>
                      <p>address 2</p>
                      <p>city</p>
                      <p>state</p>
                      <p>zip</p>
                    </div>
                  </div>
                  <div className="form-value flex w-4/5 flex-col pt-9 text-start uppercase leading-loose">
                    <div
                      className={`${
                        mobileMenu ? 'text-[1rem] ' : ''
                      } flex flex-col self-center`}
                    >
                      <p>
                        {addresses[addressIndex].shipToAddress.firstName}{' '}
                        {addresses[addressIndex].shipToAddress.lastName}
                      </p>
                      <p>{addresses[addressIndex].shipToAddress.email}</p>
                      <p>{addresses[addressIndex].shipToAddress.address_1}</p>
                      <p>
                        {addresses[addressIndex].shipToAddress.address_2
                          ? addresses[addressIndex].shipToAddress.address_2
                          : '-'}
                      </p>
                      <p>{addresses[addressIndex].shipToAddress.city}</p>
                      <p>{addresses[addressIndex].shipToAddress.state}</p>
                      <p>{addresses[addressIndex].shipToAddress.zip}</p>
                    </div>
                  </div>
                </>
              ) : (
                <ManageShippingAddress
                  mobileMenu={mobileMenu}
                  user={user}
                  setManageShippingAddress={setManageShippingAddress}
                  addresses={addresses}
                  setAddresses={setAddresses}
                  addressIndex={addressIndex}
                  setAddressIndex={setAddressIndex}
                />
              )}{' '}
            </div>
          ) : (
            ''
          )}

          {/* STRIPE PAYMENT SECTION */}
          {!manageShippingAddress && (
            <div className="flex flex-col  justify-end self-center pt-3 lg:w-4/6">
              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={options}
                >
                  <Checkout />
                </Elements>
              ) : (
                <button
                  className="w-full self-center rounded-sm bg-charcoal px-8 py-2 font-poiret text-lg uppercase tracking-widest whitespace-nowrap  text-white lg:w-fit lg:px-16 xl:w-3/6 xl:px-5 2xl:w-3/6"
                  onClick={(e) => handleCheckout(e)}
                >
                  confirm & proceed
                </button>
              )}
            </div>
          )}
          {clientSecret && (
            <button
              className="rounded-sm border border-charcoal px-8 py-1 font-grotesque text-base text-charcoal"
              onClick={handleCancel}
            >
              cancel
            </button>
          )}
          {isCheckoutCancel && (
            <span className="mt-5 font-poiret">checkout cancelled</span>
          )}
        </div>
      </section>
    </div>
  );
}
