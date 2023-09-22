import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { type StripePaymentElementOptions } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { selectOrderState } from '../../redux/slices/orderSlice';
import { useAppSelector } from '../../redux/hooks';

export default function Checkout() {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const order = useAppSelector(selectOrderState);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) {
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
        receipt_email: 'stacylukavsky@gmail.com',
        // Make sure to change this to your payment completion page
        return_url: `http://localhost:5173/checkout/success?order=${order.singleOrder?._id}`,
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
    <div className="flex flex-col ">
      <form
        id="payment-form"
        onSubmit={(e) => handlePaymentSubmit(e)}
      >
        {/* PAYMENT FORM */}
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
        />
        <div className=" flex   justify-center ">
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className=" flex "
          >
            <span
              id="button-text"
              className="my-5 rounded-sm bg-charcoal px-10 py-1 font-poiret text-lg uppercase text-white"
            >
              {isLoading ? (
                <div
                  className="spinner"
                  id="spinner"
                ></div>
              ) : (
                'Pay now'
              )}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </div>
      </form>
    </div>
  );
}
