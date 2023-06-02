import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { selectAuthUserId } from '../../redux/slices/authSlice';
import {
  addShippingAddress,
  editUserAccountInfo,
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';
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
// import { checkAddress } from '../../utilities/googleAddressValidation';

export type ShippingInfoFields = {
  isDefault: boolean;
  shipToAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
  };
};

type EditFormModes = 'edit' | 'new';

export default function Recap() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const { user } = useAppSelector(selectSingleUser);
  const verifyPromo = useAppSelector(selectPromo);
  const promoErrors = useAppSelector(selectPromoErrors);
  const [addressValidationFailed, setAddressValidationFailed] = useState(false);
  const [saveIsDisabled, setSaveIsDisabled] = useState(true);
  const [promo, setPromo] = useState<string>('');
  const [isCheckoutCancel, setIsCheckoutCancel] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const [addressFormMode, setAddressFormMode] = useState<EditFormModes>('edit');
  const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(VITE_STRIPE_PUBLIC_KEY);

  function getDefaultAddress() {
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

  const defaultShippingAddress = getDefaultAddress();

  useEffect(() => {
    console.log('defaultShippingAddress', defaultShippingAddress);
  }, [defaultShippingAddress]);

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  /**
   * *ORDER CREATION WITH PENDING STATUS
   */

  const handlePromoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (promo) dispatch(fetchSinglePromo(promo));
  };

  // useEffect(() => {
  //   if (promoName) dispatch(fetchSinglePromo(promoName));
  // }, [promoName]);

  const orderDetails = () => {
    console.log('hello from orderDetails function @ Success.tsx');
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

  // useEffect(() => {
  //   if (user?._id && userId) {
  //     dispatch(createOrder({ userId, order: orderDetails() as TOrder }));
  //   }
  // }, [user, userId]);

  //address shit

  useEffect(() => {
    if (user && !user.address?.address_1) {
      setIsFormEdit(true);
    }
  }, [user]);

  const ZShippingData = z.object({
    isDefault: z.boolean(),
    shipToAddress: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      address_1: z.string().min(5),
      address_2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(2),
      zip: z.string().min(5),
    }),
  });

  const defaultValues: ShippingInfoFields = {
    shipToAddress: {
      firstName:
        defaultShippingAddress?.shipToAddress.firstName || user.firstName || '',
      lastName:
        defaultShippingAddress?.shipToAddress.lastName || user.lastName || '',
      email: defaultShippingAddress?.shipToAddress.email || user.email || '',
      address_1:
        defaultShippingAddress?.shipToAddress.address_1 ||
        user.address?.address_1 ||
        '',
      address_2:
        defaultShippingAddress?.shipToAddress.address_2 ||
        user.address?.address_2 ||
        '',
      city:
        defaultShippingAddress?.shipToAddress.city || user.address?.city || '',
      state:
        defaultShippingAddress?.shipToAddress.state ||
        user.address?.state ||
        '',
      zip: defaultShippingAddress?.shipToAddress.zip || user.address?.zip || '',
    },
    isDefault: defaultShippingAddress?.isDefault || false,
  };

  const {
    register,
    reset,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors, dirtyFields, defaultValues: currentDefaults },
  } = useForm<ShippingInfoFields>({
    resolver: zodResolver(ZShippingData),
    defaultValues,
    mode: 'onBlur',
  });

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

  useEffect(() => {
    if (promoErrors.status) setPromo('');
  }, [promoErrors.status]);

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

  const handleEditForm = (data: ShippingInfoFields) => {
    const userFields = {
      // TODO: need to restructure this to match ShippingSchema
      isDefault: data.isDefault,
      userId: userId!,
      shipToAddress: data.shipToAddress,
    };

    if (addressFormMode === 'new') {
      // dispatch new address thunk
      dispatch(addShippingAddress({ shippingData: userFields }));
    } else if (addressFormMode === 'edit') {
      // dispatch edit address thunk (w/ address ID)
    }
    // if (userId) dispatch(editUserAccountInfo({ userId, user: userFields })); // TODO: might point this @ a different thunk

    setIsFormEdit(false);
  };

  // ! Decline card: 4000 0000 0000 9995

  const handleCancel = () => {
    setClientSecret('');
    setIsCheckoutCancel(true);
    setAddressFormMode('edit');
  };

  function newShippingAddress() {
    setIsFormEdit(true);
    setAddressFormMode('new');

    reset({
      shipToAddress: {
        firstName: '',
        lastName: '',
        email: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
      },
    });
  }

  function cancelAddressForm() {
    setIsFormEdit(false);

    reset(defaultValues);
  }

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
        {/* SHIPPING FORM (PLAIN TEXT) */}
        {user && defaultShippingAddress && !isFormEdit && (
          <section className="shipping-info-container">
            <br />
            <h1>SHIPPING INFO</h1>
            <div>
              {defaultShippingAddress.isDefault && <p>(default address)</p>}
              <p>
                First name: {defaultShippingAddress.shipToAddress.firstName}
              </p>
              <p>Last name: {defaultShippingAddress.shipToAddress.lastName}</p>
              <p>Email: {defaultShippingAddress.shipToAddress.email}</p>
              <p>Address 1: {defaultShippingAddress.shipToAddress.address_1}</p>
              {defaultShippingAddress.shipToAddress.address_2 && (
                <p>
                  Address 2: {defaultShippingAddress.shipToAddress.address_2}
                </p>
              )}
              <p>City: {defaultShippingAddress.shipToAddress.city}</p>
              <p>State: {defaultShippingAddress.shipToAddress.state}</p>
              <p>Zip: {defaultShippingAddress.shipToAddress.zip}</p>
            </div>
          </section>
        )}
        {!isFormEdit && !clientSecret && (
          <>
            <button className="bg-blue-800" onClick={() => setIsFormEdit(true)}>
              EDIT{' '}
            </button>
            <br />
            <button className="bg-blue-800" onClick={newShippingAddress}>
              NEW ADDRESS
            </button>
          </>
        )}

        {/* EDIT SHIPPING INFO FORM */}
        {isFormEdit && (
          <>
            <form onSubmit={handleSubmit(handleEditForm)}>
              <h1>EDIT SHIPPING INFO</h1>
              <div className="first-name-field">
                <label htmlFor="first-name">First name</label>
                <input
                  id="first-name"
                  type="text"
                  {...register('shipToAddress.firstName')}
                />
              </div>
              <div className="address-1-field">
                <label htmlFor="last-name">Last name</label>
                <input
                  id="last-name"
                  type="text"
                  {...register('shipToAddress.lastName')}
                />
              </div>
              <div className="address-1-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="text"
                  {...register('shipToAddress.email')}
                />
              </div>
              <div className="address-1-field">
                <label htmlFor="address_1">Address_1</label>
                <input
                  id="address_1"
                  type="text"
                  {...register('shipToAddress.address_1')}
                />
              </div>

              <div className="address-2-field">
                <label htmlFor="address_2">Address_2</label>
                <input
                  id="address_2"
                  type="text"
                  {...register('shipToAddress.address_2')}
                />
                {errors.shipToAddress?.address_2 && (
                  <p>{errors.shipToAddress.address_2.message}</p>
                )}
              </div>

              <div className="city-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  {...register('shipToAddress.city')}
                />
              </div>

              <div className="state-field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  {...register('shipToAddress.state')}
                />
              </div>

              <div className="zip-field">
                <label htmlFor="zip">Zip</label>
                <input
                  id="zip"
                  type="text"
                  {...register('shipToAddress.zip')}
                />
              </div>

              <div className="default-field">
                <label htmlFor="isDefault">
                  Make this address the default:
                </label>
                <input
                  type="checkbox"
                  id="isDefault"
                  defaultChecked={currentDefaults?.isDefault || false}
                  {...register('isDefault')}
                />
              </div>

              <button type="submit" className="bg-green-800">
                SAVE CHANGES
              </button>
              <button
                type="button"
                className="bg-red-800"
                onClick={cancelAddressForm}
              >
                CANCEL
              </button>

              {addressValidationFailed && <h2>INVALID ADDRESS - RE-ENTER</h2>}
            </form>
          </>
        )}
      </section>
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
