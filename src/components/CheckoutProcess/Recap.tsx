import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { selectAuthUserId } from '../../redux/slices/authSlice';
import {
  addShippingAddress,
  editShippingAddress,
  editUserAccountInfo,
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useForm, useFormState } from 'react-hook-form';
import { string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import Checkout from './Checkout';
import { Elements } from '@stripe/react-stripe-js';
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
import oceanBg from '../../../src/assets/bg-img/ocean.jpg';
import sandLady from '../../../src/assets/bg-img/lady-rubbing-sand-on-lips.jpg';
import {
  selectCart,
  removeFromCart,
  fetchUserCart,
} from '../../redux/slices/cartSlice';
import x from '../../../src/assets/icons/x.svg';
import Counter from '../Counter';

// TODO: clear out unused deps

// ! Decline card: 4000 0000 0000 9995
// * Success card: 4242 4242 4242 4242

export default function Recap() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const { user } = useAppSelector(selectSingleUser);
  const verifyPromo = useAppSelector(selectPromo);
  const promoErrors = useAppSelector(selectPromoErrors);
  const [addressValidationFailed, setAddressValidationFailed] = useState(false);
  const [saveIsDisabled, setSaveIsDisabled] = useState(true);
  const [promo, setPromo] = useState<string>('');
  const [currentShippingAddress, setCurrentShippingAddress] =
    useState<TShippingAddress | null>(null);
  const { cart } = useAppSelector(selectCart);
  // const [count, setCount] = useState(qty);

  const [isCheckoutCancel, setIsCheckoutCancel] = useState<boolean>(false);
  const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY; // ? shift up to imports section so we're not reading it on every render
  const stripePromise = loadStripe(VITE_STRIPE_PUBLIC_KEY); // ? hopefully can move all the Stripe stuff to its own home (utilities or similar)

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
  }, []);

  useEffect(() => {
    // examine user addresses
    // if none, open the manage addresses view & have it render the new address form
    // otherwise, rearrange address array such that any default is at pos'n 0
    if (user) {
      if (user?.shippingAddresses?.length > 0) {
        orderAddressArray(); // this SHOULD get fired when we select a new default...
      } else {
        setManageShippingAddress(true); // TODO: make the manage form render the create new address form
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

  function orderAddressArray() {
    let addressList: TShippingAddress[] = user.shippingAddresses;
    if (addressList.length === 0) return;
    let defaultAddress = user.shippingAddresses.find(
      (address) => address.isDefault === true
    );
    if (defaultAddress)
      addressList = [
        defaultAddress,
        ...user.shippingAddresses.filter(
          (address) => address._id !== defaultAddress?._id
        ),
      ];
    setAddresses(addressList);
  }

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
        promoCodeName: promo,
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
  // if (!addresses || addresses.length === 0)
  //   return <h1>Loading address book...</h1>;

  return (
    <div className='recap-container m-10 mx-auto max-w-[1440px]'>
      <section className='order-recap flex flex-col items-center'>
        {/* PRODUCTS RECAP */}

        <div className='header-section w-5/6 border-l border-r border-t border-charcoal py-2 text-center font-italiana text-xl'>
          <h1>ORDER CONFIRMATION</h1>
        </div>

        <div className='product-recap flex  w-full justify-between gap-10 border border-charcoal p-10'>
          <div className='flex w-3/5 flex-col '>
            {cart.products.map((item) => {
              return (
                <div key={item._id} className='flex h-56'>
                  <img
                    src={x}
                    className='h-4 w-5 pr-3 pt-1'
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
                  <div className='w-32 lg:w-40'>
                    <img
                      className=' aspect-[3/4] border border-black object-cover'
                      src={
                        item.product.images.find(
                          (image) => image.imageDesc === 'product-front'
                        )?.imageURL || item.product.images[0].imageURL
                      }
                    />
                  </div>
                  <div className='flex w-3/5 flex-col items-center justify-center'>
                    <p className='pb-2 text-center font-hubbali text-sm uppercase md:pl-5 lg:pb-5 lg:pr-5 lg:text-base xl:text-xl'>
                      {item.product.productName}
                    </p>
                    <p className='pb-2 font-grotesque text-base lg:text-lg xl:text-lg'>
                      ${item.product.price}
                    </p>
                    <Counter
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

          <div className='bg-img-container relative flex w-2/5 flex-col '>
            <img src={oceanBg} alt='ocean waves and rocks' />
            <img
              src={sandLady}
              alt='lady rubbing sand on her lips'
              className='absolute top-0 w-4/5 translate-x-[-20%] translate-y-[12%]'
            />
          </div>
        </div>

        <div className='flex h-44 w-5/6 flex-col justify-center border border-charcoal bg-[#31333A]'>
          <h2 className='pl-5 font-italiana text-base uppercase tracking-wide text-white lg:text-xl'>
            order subtotal: ${cart.subtotal}
          </h2>
          {/* PROMO CODE SECTION */}
          {verifyPromo && !verifyPromo.promoRate ? (
            <section className='promo-section flex items-center  pl-6  pt-6 text-white lg:pl-20 '>
              <form
                className='flex flex-nowrap'
                onSubmit={(e) => handlePromoSubmit(e)}
              >
                <label
                  htmlFor='promo-code'
                  className='border border-white px-5  py-1 font-italiana text-sm lg:px-16 lg:text-base'
                >
                  enter your promo code:
                </label>

                <input
                  id='promo-code'
                  type='text'
                  value={promo}
                  placeholder={promoErrors.status ? 'invalid promo code' : ''}
                  onChange={(e) => setPromo(e.target.value)}
                  className='mx-2 border-2 border-white text-sm text-charcoal'
                ></input>
                <button className='border border-white px-10 font-italiana text-sm uppercase lg:text-lg'>
                  verify
                </button>
              </form>
            </section>
          ) : (
            <div className='flex flex-col gap-2 pl-5 pt-2'>
              <p className='font-italiana text-base text-white lg:text-xl'>
                <span className='uppercase '>discount:</span> (promo code '
                {verifyPromo.promoCodeName}
                '): - ${(cart.subtotal * verifyPromo.promoRate).toFixed(2)}
              </p>
              <p className='font-italiana text-base text-white lg:text-3xl '>
                <span className='uppercase'>order total:</span> $
                {(cart.subtotal * (1 - verifyPromo.promoRate)).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PLAIN TEXT USER ADDRESS */}
      <section className='border border-charcoal'>
        <div className='relative flex place-content-center place-items-center border-b border-charcoal font-italiana'>
          <h1 className='items-center py-3 text-center text-xl'>
            {!clientSecret ? 'SHIPPING INFO' : 'PAYMENT INFO'}
          </h1>
          {!clientSecret && (
            <div className='absolute right-3 flex'>
              {!manageShippingAddress ? (
                <button
                  className=' rounded-sm bg-charcoal px-6 py-1 text-white  lg:px-10 '
                  onClick={handleManageShippingAddress}
                >
                  MANAGE ADDRESSES
                </button>
              ) : addresses.length > 0 ? (
                <button
                  onClick={() => setManageShippingAddress(false)}
                  className='rounded-sm bg-charcoal px-6 py-1 text-sm text-white  lg:px-10'
                >
                  CANCEL
                </button>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>

        <div className='shipping-detail m-20 flex h-full flex-col items-center justify-center '>
          {!clientSecret && (
            <div className='flex h-full w-full flex-col items-center lg:w-4/6'>
              <h2 className='h-full w-5/6 border-l border-r border-t border-charcoal py-2  text-center font-italiana text-lg uppercase  md:w-4/6 lg:w-5/6 xl:w-3/6 2xl:w-6/12'>
                {manageShippingAddress
                  ? userId
                    ? 'address book'
                    : 'delivery address'
                  : 'your order will be delivered to:'}{' '}
              </h2>
            </div>
          )}
          {!clientSecret ? (
            <div className='relative flex h-full w-full max-w-[800px] border border-charcoal bg-slate-300 font-marcellus text-sm md:w-5/6 lg:w-4/6 lg:text-base xl:w-3/6 2xl:w-3/6'>
              {!manageShippingAddress && addresses.length > 0 ? (
                <>
                  <div className='form-key flex h-full w-2/5 flex-col items-start border-r border-charcoal  py-9  leading-loose'>
                    <div className='flex flex-col self-center'>
                      <p className=''>full name</p>

                      <p>email</p>
                      <p>address 1</p>
                      <p>address 2</p>
                      <p>city</p>
                      <p>state</p>
                      <p>zip</p>
                    </div>
                  </div>
                  <div className='form-value flex w-4/5 flex-col pt-9 text-start uppercase leading-loose'>
                    <div className='flex flex-col self-center'>
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
                  user={user}
                  setManageShippingAddress={setManageShippingAddress}
                  addresses={addresses}
                  setAddresses={setAddresses}
                  addressIndex={addressIndex}
                  setAddressIndex={setAddressIndex}
                  clientSecret={clientSecret}
                />
              )}{' '}
            </div>
          ) : (
            ''
          )}

          {/* STRIPE PAYMENT SECTION */}
          {!manageShippingAddress && (
            <div className='flex flex-col  justify-end self-center pt-3 lg:w-4/6'>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <Checkout />
                </Elements>
              ) : (
                <button
                  className='w-full self-center rounded-sm bg-charcoal px-8 py-2 font-italiana text-lg uppercase text-white  lg:w-fit lg:px-16 xl:w-3/6 xl:px-5 2xl:w-2/6'
                  onClick={(e) => handleCheckout(e)}
                >
                  confirm&proceed
                </button>
              )}
            </div>
          )}
          {clientSecret && (
            <button
              className='rounded-sm border border-charcoal px-8 py-1 font-italiana text-base text-charcoal'
              onClick={handleCancel}
            >
              cancel
            </button>
          )}
          {isCheckoutCancel && (
            <span className='mt-5 font-marcellus'>checkout cancelled</span>
          )}
        </div>
      </section>
    </div>
  );
}
