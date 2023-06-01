import { FormEventHandler, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
  loadStripe,
} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  fetchUserCart,
  selectCart,
  removeFromCart,
} from '../redux/slices/cartSlice';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Checkout from './CheckoutProcess/Checkout';
import axios from 'axios';
import CartItem from './CartItem';
import Recap from './CheckoutProcess/Recap';
// const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// const stripePromise = loadStripe(VITE_STRIPE_PUBLIC_KEY);

export default function Cart() {
  const dispatch = useAppDispatch();
  const userCart = useAppSelector(selectCart);
  const { userId } = useParams();
  const navigate = useNavigate();
  // const [clientSecret, setClientSecret] = useState<string>('');
  // const stripe = useStripe();
  // const elements = useElements();
  // const [email, setEmail] = useState('');
  // const [message, setMessage] = useState<string>('');
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) dispatch(fetchUserCart(userId));
  }, [userId]);

  //   useEffect(() => {
  //         if (!stripe) {
  //           return;
  //         }

  //         const clientSecret = new URLSearchParams(window.location.search).get(
  //           'payment_intent_client_secret'
  //         );
  //             if (!clientSecret) {
  //               return;
  //             }
  // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
  //   switch (paymentIntent!.status) {
  //     case 'succeeded':
  //       setMessage('Payment succeeded!');
  //       break;
  //     case 'processing':
  //       setMessage('Your payment is processing.');
  //       break;
  //     case 'requires_payment_method':
  //       setMessage('Your payment was not successful, please try again.');
  //       break;
  //     default:
  //       setMessage('Something went wrong.');
  //       break;
  //   }
  // });

  //   }, [stripe])

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     if (!stripe || !elements) {
  //       // Stripe.js hasn't yet loaded.
  //       // Make sure to disable form submission until Stripe.js has loaded.
  //       return;
  //     }

  //     setIsLoading(true);

  //     const { error } = await stripe.confirmPayment({
  //       elements,
  //       confirmParams: {
  //         // Make sure to change this to your payment completion page
  //         return_url: 'http://localhost:3000',
  //       },
  //     });
  //     if (error.type === 'card_error' || error.type === 'validation_error') {
  //       setMessage(error.message!);
  //     } else {
  //       setMessage('An unexpected error occurred.');
  //     }

  //     setIsLoading(false);
  //   };

  // const handleCheckout = async (e: any) => {
  //   e.preventDefault();
  //   // console.log('hi');
  //   try {
  //     const { data } = await axios.post(
  //       'http://localhost:3001/api/checkout/create-payment-intent',
  //       {},
  //       { withCredentials: true }
  //     );
  //     setClientSecret(data.clientSecret);
  //     // console.log('data', data);
  //     return data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const appearance = {
  //   theme: 'stripe',
  // };




  // const options: StripeElementsOptions = {
  //   clientSecret: clientSecret!,
  //   appearance: {
  //     theme: 'stripe',
  //     variables: {
  //       colorPrimary: '#0570de',
  //       colorBackground: '#ffffff',
  //       colorText: '#30313d',
  //       colorDanger: '#df1b41',
  //       fontFamily: 'Ideal Sans, system-ui, sans-serif',
  //       spacingUnit: '2px',
  //       borderRadius: '4px',
  //       // See all possible variables below
  //     },
  //   },
  // };

  //   const paymentElementOptions: StripePaymentElementOptions = {
  //     layout: 'tabs',
  //   };

  if (!userCart.cart.products?.length) return <p>Your cart is empty</p>;
  return (
    <section className='cart-container'>
      <h1>
        YOUR CART (
        {userCart.cart.products.reduce((total, product) => {
          return total + product.qty;
        }, 0)}
        )
      </h1>

      <br />
      <div>
        {userCart.cart.products.map(({ product, qty }) => {
          return (
            <CartItem
              product={product}
              qty={qty}
              userId={userId!}
              key={product._id}
            />
          );
        })}
      </div>

      <div>Subtotal:{userCart.cart.subtotal}</div>
      {/* <button onClick={handleCheckout}>CHECKOUT</button> */}
      {/* {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <Checkout options={options} />
        </Elements>
      )}
      <button onClick={(e) => handleCheckout(e)}>Checkout</button> */}

      
      <Link to={'/checkout'}> 
      <button className='bg-teal-700'>RECAP</button>
      {/* <Recap userCart={userCart}/> */}
      </Link>
      <br />
      <Link to={'/shop-all'}>back to shopping</Link>
    </section>
  );
}
