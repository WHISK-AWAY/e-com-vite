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
import { TOrder, createOrder } from '../../redux/slices/orderSlice';
import {
  fetchSinglePromo,
  selectPromo,
  selectPromoErrors,
} from '../../redux/slices/promoCodeSlice';
import { TShippingAddress } from '../../redux/slices/userSlice';
import ManageShippingAddress from '../UserAccount/shippingAddress/ManageShippingAddress';
import oceanBg from '../../../src/assets/bg-img/ocean.jpg';
import sandLady from '../../../src/assets/bg-img/lady-rubbing-sand-on-lips.jpg';

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
    // examine user addresses
    // if none, open the manage addresses view & have it render the new address form
    // otherwise, rearrange address array such that any default is at pos'n 0
    if (user) {
      if (user.shippingAddresses?.length === 0) {
        setManageShippingAddress(true); // TODO: make the manage form render the create new address form
      } else {
        orderAddressArray(); // this SHOULD get fired when we select a new default...
      }
    }
  }, [user]);

  useEffect(() => {
    if (promoErrors.status) setPromo('');
  }, [promoErrors.status]);

  // function getCurrentAddress() {
  //   // ? once we're happy with how all this works, let's shift this to utilities
  //   if (user._id) {
  //     if (user.shippingAddresses.length > 0) {
  //       return (
  //         user.shippingAddresses.find((address) => address.isDefault) ||
  //         user.shippingAddresses[0]
  //       );
  //     } else {
  //       return user.shippingAddresses[0] || null;
  //     }
  //   } else return null;
  // }

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

  useEffect(() => {
    // populate addresses list if it's not already done
    orderAddressArray();
  }, [user]);

  // const currentShippingAddress = getCurrentAddress(); // ? should probably call this from a useEffect
  // ? should store this info in a state variable & pass setter to manager component

  /**
   * *ORDER CREATION WITH PENDING STATUS
   */

  const handlePromoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (promo) dispatch(fetchSinglePromo(promo));
    setPromo('');
  };

  const orderDetails = () => {
    // ? can this be shifted off to utilities?
    /**
     * Construct object for use in order creation
     * Called by submit handler
     */
    console.log('hello from orderDetails function @ Recap.tsx');
    const userOrder = {} as Partial<TOrder>;
    userOrder.orderDetails = [];
    for (let product of user.cart.products) {
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

  //address shit

  // ? consider pulling Stripe shit into a separate component
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

  if (!user?.cart?.products) return <h1>Loading cart...</h1>;
  if (!addresses || addresses.length === 0)
    return <h1>Loading address book...</h1>;

  return (
    <div className='recap-container m-10'>
      <section className='order-recap flex flex-col items-center'>
        {/* PRODUCTS RECAP */}

        <div className='header-section w-5/6 border-l border-r border-t border-charcoal py-2 text-center font-italiana text-xl'>
          <h1>ORDER CONFIRMATION</h1>
        </div>

        <div className='product-recap flex  w-full border border-charcoal p-10'>
          <div className='flex w-3/5 flex-col'>
            {user.cart.products.map((item) => {
              return (
                <div key={item._id} className='flex h-56 pb-2'>
                  <img
                    className='w-44 border border-black'
                    src={
                      item.product.images.find(
                        (image) => image.imageDesc === 'product-front'
                      )?.imageURL || item.product.images[0].imageURL
                    }
                  />
                  <div className='flex flex-col items-center justify-center pl-10'>
                    <p className='pb-5 font-hubbali text-xl uppercase'>
                      {item.product.productName}
                    </p>
                    <p className='font-grotesque text-lg'>
                      ${item.product.price}
                    </p>
                    <p className='font-grotesque text-lg'>{item.qty}</p>
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
              className='absolute w-4/5 top-0 translate-x-[-20%] translate-y-[12%]'
            />
          </div>
        </div>

        <div className='flex h-44 w-5/6 flex-col justify-center border border-charcoal bg-[#31333A]'>
          <h2 className='pl-5 font-marcellus text-xl uppercase tracking-wide text-white'>
            order subtotal: ${user.cart.subtotal}
          </h2>
          {/* PROMO CODE SECTION */}
          {verifyPromo && (
            <section className='promo-section pl-20 pt-6 text-white'>
              <form className='' onSubmit={(e) => handlePromoSubmit(e)}>
                <label
                  htmlFor='promo-code'
                  className='border border-white px-16 py-1 font-italiana'
                >
                  enter your promo-code:
                </label>

                <input
                  id='promo-code'
                  type='text'
                  value={promo}
                  placeholder={promoErrors.status ? 'invalid promo-code' : ''}
                  onChange={(e) => setPromo(e.target.value)}
                  className='mx-2 border-2 border-white text-charcoal'
                ></input>
                <button className='border border-white px-10 font-italiana text-lg uppercase'>
                  verify
                </button>
              </form>
            </section>
          )}
          {verifyPromo.promoRate && ( // ? maybe add a button to bring back the promo form?
            <>
              <p>
                discount (promo code {verifyPromo.promoCodeName}): -
                {(user.cart.subtotal * verifyPromo.promoRate).toFixed(2)}
              </p>
              <p>
                total:{' '}
                {(user.cart.subtotal * (1 - verifyPromo.promoRate)).toFixed(2)}
              </p>
            </>
          )}
        </div>
      </section>

      {/* PLAIN TEXT USER ADDRESS */}
      <section className='border border-charcoal'>
        <div className='flex place-content-center place-items-center relative border-b border-charcoal font-italiana'>
          <h1 className='items-center py-3 text-center text-xl'>
            SHIPPING INFO
          </h1>
          <div className='flex absolute right-3'>
            <button
              className=' rounded-sm bg-charcoal px-10 py-1  text-white'
              onClick={handleManageShippingAddress}
            >
              MANAGE ADDRESSES
            </button>
          </div>
        </div>

        <div className='shipping-detail m-20 flex flex-col h-full justify-center items-center'>
          <div className='flex h-full w-4/6 flex-col items-center'>
            <h2 className='h-full w-3/6 border-l border-r border-t border-charcoal  py-2 text-center font-italiana text-lg uppercase'>
              your order will be delivered to:{' '}
            </h2>
            <div className='flex h-full w-4/6 border border-charcoal font-marcellus '>
              <div className='form-key flex h-full w-2/5 flex-col items-start border-r border-charcoal  py-9  leading-loose '>
                <div className='flex flex-col self-center'>
                  <p className=''>full name</p>

                  <p>email</p>
                  <p>address 1</p>
                  <p>address 2</p>
                  <p>city</p>
                  <p>state</p>
                  <p>zip</p>
                  {manageShippingAddress && (
                    <ManageShippingAddress // ? need to pass along current address setter
                      user={user}
                      setManageShippingAddress={setManageShippingAddress}
                      addresses={addresses}
                      addressIndex={addressIndex}
                      setAddressIndex={setAddressIndex}
                    />
                  )}
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
            </div>
          </div>

      {/* STRIPE PAYMENT SECTION */}
      {!manageShippingAddress && (
        <div className='flex flex-col justify-end w-2/6 self-center pt-3'>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <Checkout />
            </Elements>
          ) : (
            <button className='bg-charcoal px-16 py-2 rounded-sm uppercase text-white font-italiana text-lg' onClick={(e) => handleCheckout(e)}>
              confirm&proceed
            </button>
          )}
        </div>
      )}
      {clientSecret && (
        <button className='bg-red-400' onClick={handleCancel}>
          CANCEL
        </button>
      )}
      {isCheckoutCancel && <p>checkout cancelled</p>}
        </div>

      </section>

    </div>
  );
}
