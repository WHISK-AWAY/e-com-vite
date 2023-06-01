import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';

// import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { appendErrors, useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { checkAddress } from '../../utilities/googleAddressValidation';
// import { selectSingleUser } from '../../redux/slices/userSlice';

// type ShippingInfoFields = {
//   address_1: string;
//   address_2: string;
//   city: string;
//   state: string;
//   zip: string;
// };

export default function Checkout({
  options,
}: {
  options: StripeElementsOptions;
}) {
  /**
   * * SHIPPING INFO
   */

  // const user = useAppSelector(selectSingleUser);
  // console.log('user', user);

  // const ZShippingData = z.object({
  //   address_1: z.string().min(5),
  //   address_2: z.string().optional(),
  //   city: z.string().min(1),
  //   state: z.string().min(2),
  //   zip: z.string().min(5),
  // });

  // const [addressValidationFailed, setAddressValidationFailed] = useState(false);
  // const [saveIsDisabled, setSaveIsDisabled] = useState(true);
  // // const { address } = user;
  // const dispatch = useAppDispatch();
  // // const { address_1, address_2, city, state, zip } = address!;

  // const defaultValues: ShippingInfoFields = {
  //   address_1: user.user.address?.address_1 || '',
  //   address_2: user.user.address?.address_2 || '',
  //   city: user.user.address?.city || '',
  //   state: user.user.address?.state || '',
  //   zip: user.user.address?.zip || '',
  // };

  // const {
  //   register,
  //   reset,
  //   handleSubmit,
  //   setError,
  //   getValues,
  //   setValue,
  //   formState: { errors, dirtyFields },
  // } = useForm<ShippingInfoFields>({
  //   resolver: zodResolver(ZShippingData),
  //   defaultValues,
  //   mode: 'onBlur',
  // });

  /**
   * * PAYMENT FORM
   */

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      console.log('thing');
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) {
      console.log('any');
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent!.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:5173/checkout/success',
      },
    });
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message!);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div>
      
      <form id='payment-form' onSubmit={(e) => handlePaymentSubmit(e)}>
        {/* PAYMENT FORM */}
        <PaymentElement id='payment-element' options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id='submit'>
          <span id='button-text'>
            {isLoading ? (
              <div className='spinner' id='spinner'></div>
            ) : (
              'Pay now'
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id='payment-message'>{message}</div>}
      </form>
    </div>
  );
}
