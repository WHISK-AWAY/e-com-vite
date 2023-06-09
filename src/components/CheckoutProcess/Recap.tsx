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
        imageURL: product.product.imageURL,
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

    console.log('UO', userOrder);
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
    <div>
      <section className='order-recap'>
        {/* PRODUCTS RECAP */}

        <h1>ORDER RECAP</h1>
        {user.cart.products.map((item) => {
          return (
            <div key={item._id}>
              <p>{item.product.productName}</p>
              <p>{item.qty}</p>
              <img src={item.product.imageURL[0]} />
            </div>
          );
        })}

        <h2>Subtotal: {user.cart.subtotal}</h2>
        {/* PROMO CODE SECTION */}
        {!verifyPromo && (
          <section className='promo-section'>
            <form
              className='border border-red-600'
              onSubmit={(e) => handlePromoSubmit(e)}
            >
              <label htmlFor='promo-code'>enter your promo-code:</label>

              <input
                id='promo-code'
                type='text'
                value={promo}
                placeholder={promoErrors.status ? 'invalid promo-code' : ''}
                onChange={(e) => setPromo(e.target.value)}
              ></input>
              <button>verify</button>
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
      </section>

      {/* PLAIN TEXT USER ADDRESS */}
      <section>
        <br />
        <h1>SHIPPING DETAILS</h1>
        <p>first name: {addresses[addressIndex].shipToAddress.firstName}</p>
        <p>last name: {addresses[addressIndex].shipToAddress.lastName}</p>
        <p>email: {addresses[addressIndex].shipToAddress.email}</p>
        <p>address 1: {addresses[addressIndex].shipToAddress.address_1}</p>
        <p>address 2: {addresses[addressIndex].shipToAddress.address_2}</p>
        <p>city: {addresses[addressIndex].shipToAddress.city}</p>
        <p>state: {addresses[addressIndex].shipToAddress.state}</p>
        <p>zip: {addresses[addressIndex].shipToAddress.zip}</p>
        <button className='bg-green-300' onClick={handleManageShippingAddress}>
          MANAGE ADDRESSES
        </button>
        {manageShippingAddress && (
          <ManageShippingAddress // ? need to pass along current address setter
            user={user}
            setManageShippingAddress={setManageShippingAddress}
            addresses={addresses}
            addressIndex={addressIndex}
            setAddressIndex={setAddressIndex}
          />
        )}
      </section>

      {/* STRIPE PAYMENT SECTION */}
      {!manageShippingAddress && (
        <div>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <Checkout />
            </Elements>
          ) : (
            <button className='bg-amber-400' onClick={(e) => handleCheckout(e)}>
              PROCEED TO PAYMENT
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
  );
}
