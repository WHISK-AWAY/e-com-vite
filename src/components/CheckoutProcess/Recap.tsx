import {
  CartState,
  fetchUserCart,
  selectCart,
} from '../../redux/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { getUserId, selectAuthUserId } from '../../redux/slices/authSlice';
import {
  editUserAccountInfo,
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { appendErrors, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import Checkout from './Checkout';
import { Elements } from '@stripe/react-stripe-js';
// import { checkAddress } from '../../utilities/googleAddressValidation';

type ShippingInfoFields = {
  firstName: string;
  lastName: string;
  email: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;
};

export default function Recap() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const { user } = useAppSelector(selectSingleUser);
  const [addressValidationFailed, setAddressValidationFailed] = useState(false);
  const [saveIsDisabled, setSaveIsDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(VITE_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  const ZShippingData = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    address_1: z.string().min(5),
    address_2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2),
    zip: z.string().min(5),
  });

  const defaultValues: ShippingInfoFields = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    address_1: user.address?.address_1 || '',
    address_2: user.address?.address_2 || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zip: user.address?.zip || '',
  };

  const {
    register,
    reset,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<ShippingInfoFields>({
    resolver: zodResolver(ZShippingData),
    defaultValues,
    mode: 'onBlur',
  });

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    // console.log('hi');
    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/checkout/create-payment-intent',
        {},
        { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
      // console.log('data', data);
      return data;
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
        // See all possible variables below
      },
    },
  };

  const handleEditForm = (data: ShippingInfoFields) => {
    // e.preventDefault();
    const userFields = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: {
        address_1: data.address_1,
        address_2: data.address_2,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    };
    if (userId) dispatch(editUserAccountInfo({ userId, user: userFields }));
    setIsFormEdit(false);
  };

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
              <img src={item.product.imageURL} />
            </div>
          );
        })}
        <h2>Subtotal: {user.cart.subtotal}</h2>

        {/* SHIPPING FORM (PLAIN TEXT) */}
        {user && user.address && !isFormEdit && (
          <section className='shipping-info-container'>
            <br />
            <h1>SHIPPING INFO</h1>
            <div>
              <p>First name: {user.firstName}</p>
              <p>Last name: {user.lastName}</p>
              <p>Email: {user.email}</p>
              <p>Address 1: {user.address.address_1}</p>
              {user.address.address_2 && (
                <p> Address 2: {user.address.address_2}</p>
              )}
              <p> City: {user.address.city}</p>
              <p> State: {user.address.state}</p>
              <p>Zip: {user.address.zip}</p>
            </div>
          </section>
        )}
        {!isFormEdit && (
          <button className='bg-blue-800' onClick={() => setIsFormEdit(true)}>
            EDIT{' '}
          </button>
        )}

        {/* EDIT SHIPPINH INFO FORM */}
        {isFormEdit && (
          <form onSubmit={handleSubmit(handleEditForm)}>
            <h1>EDIT SHIPPING INFO</h1>
            <div className='first-name-field'>
              <label htmlFor='first-name'>First name</label>
              <input id='first-name' type='text' {...register('firstName')} />
            </div>
            <div className='address-1-field'>
              <label htmlFor='last-name'>Last name</label>
              <input id='last-name' type='text' {...register('lastName')} />
            </div>
            <div className='address-1-field'>
              <label htmlFor='email'>Email</label>
              <input id='email' type='text' {...register('email')} />
            </div>
            <div className='address-1-field'>
              <label htmlFor='address_1'>Address_1</label>
              <input id='address_1' type='text' {...register('address_1')} />
            </div>

            <div className='address-2-field'>
              <label htmlFor='address_2'>Address_2</label>
              <input id='address_2' type='text' {...register('address_2')} />
              {errors.address_2 && <p>{errors.address_2.message}</p>}
            </div>

            <div className='city-field'>
              <label htmlFor='city'>City</label>
              <input id='city' type='text' {...register('city')} />
            </div>

            <div className='state-field'>
              <label htmlFor='state'>State</label>
              <input id='state' type='text' {...register('state')} />
            </div>

            <div className='zip-field'>
              <label htmlFor='zip'>Zip</label>
              <input id='zip' type='text' {...register('zip')} />
            </div>

            <button className='bg-green-800'>SAVE CHANGES</button>

            {addressValidationFailed && <h2>INVALID ADDRESS - RE-ENTER</h2>}
          </form>
        )}
      </section>
      <div>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <Checkout options={options} />
          </Elements>
        ) : (
          <button className='bg-amber-400' onClick={(e) => handleCheckout(e)}>
            PROCEED TO PAYMENT
          </button>
        )}
      </div>
    </div>
  );
}

{
  /* <form>
            <div className='address-1-field'>
              <label htmlFor='address_1'>Address_1</label>
              <input id='address_1' type='text' {...register('address_1')} />
            </div>

            <div className='address-2-field'>
              <label htmlFor='address_2'>Address_2</label>
              <input id='address_2' type='text' {...register('address_2')} />
              {errors.address_2 && <p>{errors.address_2.message}</p>}
            </div>

            <div className='city-field'>
              <label htmlFor='city'>City</label>
              <input id='city' type='text' {...register('city')} />
            </div>

            <div className='state-field'>
              <label htmlFor='state'>State</label>
              <input id='state' type='text' {...register('state')} />
            </div>

            <div className='zip-field'>
              <label htmlFor='zip'>Zip</label>
              <input id='zip' type='text' {...register('zip')} />
            </div>

            {clientSecret && (
              <Elements stripe={stripePromise} options={options}>
                <Checkout options={options} />
              </Elements>
            )}
            <button className='bg-green-800'>EDIT</button>

            <button className='bg-amber-400' onClick={(e) => handleCheckout(e)}>PROCEED TO PAYMENT</button>

            {/*           
          <button
            className={saveIsDisabled ? 'bg-red-500' : 'bg-green-600'}
            type='submit'
            disabled={saveIsDisabled}
          >
            SAVE
          </button> */
}

// {addressValidationFailed && <h2>INVALID ADDRESS - RE-ENTER</h2>}
{
  /*</form> */
}
