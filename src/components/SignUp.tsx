import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectAuth,
  requestSignUp,
  requestLogin,
} from '../redux/slices/authSlice';
import { emailExists } from '../utilities/helpers';
import { TMode } from './SignWrapper';

export default function SignUp({
  // setIsSignupHidden,
  mode,
  setMode,
}: {
  // setIsSignupHidden: React.Dispatch<React.SetStateAction<boolean>>;
  mode: TMode;
  setMode: React.Dispatch<React.SetStateAction<TMode>>;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectAuthUser = useAppSelector(selectAuth);

  const zodUser: ZodType<FormData> = z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8).max(20),
      address: z
        .object({
          address_1: z.string(),
          address_2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        })
        .optional(),
      confirmPassword: z.string().min(8).max(20),
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password fields do not match',
          path: ['confirmPassword'],
        });
      }
    });

  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(zodUser),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const emailFetcher = async (email: string) => {
    try {
      if (await emailExists(email)) {
        reset({
          email: '',
        });
        setError('email', { type: 'custom', message: 'Email already exists' });
      } else {
        clearErrors('email');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log('err.email', errors.email);
    // if (selectAuthUser.error.status === 409) {
    //   reset({
    //     email: '',
    //   });
    //   setError('email', { type: 'custom', message: 'Email already exists' });
    // }

    if (errors.confirmPassword) {
      reset(
        {
          password: '',
          confirmPassword: '',
        },
        {
          keepErrors: true,
        }
      );
    }
    emailFetcher(getValues('email'));
  }, [errors.confirmPassword]);

  const submitData = (data: FormData) => {
    dispatch(requestSignUp(data))
      .then(() =>
        dispatch(requestLogin({ email: data.email, password: data.password }))
      )
      .then(() => navigate('/shop-all'));
  };

  return (
    <section className='sign-up-form-container'>
      <div>
        <h1>SIGN UP</h1>
        <form className='sign-up-form' onSubmit={handleSubmit(submitData)}>
          <div className='first-name-field'>
            <label htmlFor='first-name'>first name</label>
            <input type='text' {...register('firstName')}></input>
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>
          <div className='last-name-field'>
            <label htmlFor='last-name'>last name</label>
            <input type='text' {...register('lastName')}></input>
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>
          <div className='email-field'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              {...register('email', {
                onBlur: (e) => emailFetcher(e.target.value),
              })}
            ></input>
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className='password-field'>
            <label htmlFor='password'>password</label>
            <input type='password' {...register('password')}></input>
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <div className='confirm-password-field'>
            <label htmlFor='confirm-password'>confirm password</label>
            <input type='password' {...register('confirmPassword')}></input>
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
          <button type='submit'>submit</button>
        </form>
        <p>
          <Link to='/sign-in' className='text-green-400'>
            Sign In
          </Link>
        </p>
        <p>
          <Link to='/' className='text-green-400'>
            Home
          </Link>
        </p>
      </div>
    </section>
  );
}
