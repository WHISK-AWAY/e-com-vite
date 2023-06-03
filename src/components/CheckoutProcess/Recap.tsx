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
  const [manageShippingAddress, setManageShippingAddress] =
    useState<boolean>(false);
  const [isCheckoutCancel, setIsCheckoutCancel] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY; // ? shift up to imports section so we're not reading it on every render
  const stripePromise = loadStripe(VITE_STRIPE_PUBLIC_KEY); // ? hopefully can move all the Stripe stuff to its own home (utilities or similar)

  useEffect(() => {
    if (promoErrors.status) setPromo('');
  }, [promoErrors.status]);

  useEffect(() => {
    if (user && !user.address?.address_1) {
      setIsFormEdit(true);
    }
  }, [user]);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  function getCurrentAddress() {
    // ? once we're happy with how all this works, let's shift this to utilities
    if (user._id) {
      if (user.shippingAddresses.length > 0) {
        return (
          user.shippingAddresses.find((address) => address.isDefault) ||
          user.shippingAddresses[0]
        );
      } else {
        return user.shippingAddresses[0] || null;
      }
    } else return null;
  }

  const currentShippingAddress = getCurrentAddress(); // ? should probably call this from a useEffect
  // ? should store this info in a state variable & pass setter to manager component

  /**
   * *ORDER CREATION WITH PENDING STATUS
   */

  const handlePromoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (promo) dispatch(fetchSinglePromo(promo));
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address_1: user.address!.address_1,
          address_2: user.address?.address_2,
          city: user.address?.city!,
          state: user.address?.state!,
          zip: user.address?.zip!,
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

  if (!user?.cart?.products) return <h1>Loading cart...</h1>;

  return (
    <div>
      <section className="order-recap">
        {/* PRODUCTS RECAP */}

        <h1>ORDER RECAP</h1>
        {user.cart.products.map((item) => {
          return (
            <div key={item._id}>
              <p>{item.product.productName}</p>
              <p>{item.qty}</p>
              <img src={item.product.imageURL} />
            </div>
          );
        })}

        <h2>Subtotal: {user.cart.subtotal}</h2>
        {verifyPromo.promoRate && (
          <>
            <p>discount: -{user.cart.subtotal * verifyPromo.promoRate}</p>
            <p>total: {user.cart.subtotal * (1 - verifyPromo.promoRate)}</p>
          </>
        )}

        {/* PROMO CODE SECTION */}
        <section className="promo-section">
          <form onSubmit={(e) => handlePromoSubmit(e)}>
            <label htmlFor="promo-code">enter your promo-code:</label>

            <input
              id="promo-code"
              type="text"
              value={promo}
              placeholder={promoErrors.status ? 'invalid promo-code' : ''}
              onChange={(e) => setPromo(e.target.value)}
            ></input>
            <button>verify</button>
          </form>
        </section>
      </section>

      {/* PLAIN TEXT USER ADDRESS */}
      <section>
        <br />
        <h1>SHIPPING DETAILS</h1>
        <p>first name: {currentShippingAddress?.shipToAddress.firstName}</p>
        <p>last name: {currentShippingAddress?.shipToAddress.lastName}</p>
        <p>email: {currentShippingAddress?.shipToAddress.email}</p>
        <p>address 1: {currentShippingAddress?.shipToAddress.address_1}</p>
        <p>address 2: {currentShippingAddress?.shipToAddress.address_2}</p>
        <p>city: {currentShippingAddress?.shipToAddress.city}</p>
        <p>state: {currentShippingAddress?.shipToAddress.state}</p>
        <p>zip: {currentShippingAddress?.shipToAddress.zip}</p>
        <button className="bg-green-300" onClick={handleManageShippingAddress}>
          MANAGE ADDRESSES
        </button>
        {manageShippingAddress && (
          <ManageShippingAddress // ? need to pass along current address setter
            user={user}
            setManageShippingAddress={setManageShippingAddress}
            currentShippingAddress={currentShippingAddress}
          />
        )}
      </section>

      {/* STRIPE PAYMENT SECTION */}
      {!isFormEdit && (
        <div>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <Checkout />
            </Elements>
          ) : (
            <button className="bg-amber-400" onClick={(e) => handleCheckout(e)}>
              PROCEED TO PAYMENT
            </button>
          )}
        </div>
      )}
      {clientSecret && (
        <button className="bg-red-400" onClick={handleCancel}>
          CANCEL
        </button>
      )}
      {isCheckoutCancel && <p>checkout cancelled</p>}
    </div>
  );
}
