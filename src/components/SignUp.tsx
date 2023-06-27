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
import signup from '../assets/bg-vids/sign-up.mp4';
import SignIn from './SignIn';

export default function SignUp({
  setIsSignFormHidden,
  mode,
  setMode,
}: {
  // setIsSignupHidden: React.Dispatch<React.SetStateAction<boolean>>;
  mode: TMode;
  setMode: React.Dispatch<React.SetStateAction<TMode>>;
  setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectAuthUser = useAppSelector(selectAuth);

  const zodUser: ZodType<FormData> = z
    .object({
      firstName: z
        .string()
        .min(1, { message: 'should have at least 1 character' }),
      lastName: z
        .string()
        .min(2, { message: 'should have at least 2 characters' }),
      email: z.string().email({ message: 'should be a valid email ' }),
      password: z
        .string()
        .min(8, { message: 'should contain at least 8 characters' })
        .max(20, { message: 'should contain at most 20 characters' }),
      address: z
        .object({
          address_1: z.string(),
          address_2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        })
        .optional(),
      confirmPassword: z
        .string()
        .min(8, { message: 'should contain at least 8 characters' })
        .max(20, { message: 'should contain at most 8 characters' }),
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'password fields do not match',
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
        setError('email', { type: 'custom', message: 'email already exists' }),
          {
            keepErrors: true,
          };
      } else {
        // clearErrors('email');
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
    <>
      <video
        src={signup}
        className='h-full object-cover'
        loop={true}
        autoPlay={true}
      />

      <div className='absolute z-40 flex w-full flex-col items-center px-[13%] font-italiana text-white'>
        <h1 className='pb-[11%] pt-[29%] text-lg lg:text-xl xl:text-2xl 2xl:text-2xl'>
          SIGN UP
        </h1>
        <form
          className='sign-up-form flex w-full flex-col'
          onSubmit={handleSubmit(submitData)}
        >
          <div className='first-name-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label htmlFor='first-name' className='pl-4 lg:pb-1'>
              first name
            </label>
            <input
              type='text'
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
              className='input-ring-white input focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-11 lg:text-base xl:h-11 2xl:h-12'
            ></input>
            {/* {errors.firstName && <p>{errors.firstName.message}</p>} */}
          </div>
          <div className='last-name-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg  2xl:text-lg'>
            <label htmlFor='last-name' className='pl-4 lg:pb-1'>
              last name
            </label>
            <input
              type='text'
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
              className='input-ring-white input focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12'
            ></input>
            {/* {errors.lastName && <p>{errors.lastName.message}</p>} */}
          </div>
          <div className='email-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label htmlFor='email' className='pl-4 lg:pb-1'>
              email
            </label>
            <input
              type='email'
              autoComplete='email'
              placeholder={errors.email?.message || ''}
              {...register('email', {
                onBlur: (e) => emailFetcher(e.target.value),
              })}
              className='input-ring-white input focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12'
            ></input>
            {/* {errors.email && <p>{errors.email.message}</p>} */}
          </div>
          <div className='password-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label htmlFor='password' className='pl-4 lg:pb-1'>
              password
            </label>
            <input
              type='password'
              placeholder={errors.password?.message || ''}
              {...register('password')}
              className='input-ring-white  focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12'
            ></input>
            {/* {errors.password && <p>{errors.password.message}</p>} */}
          </div>
          <div className='confirm-password-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label htmlFor='confirm-password' className='pl-4 lg:pb-1'>
              confirm password
            </label>
            <input
              type='password'
              placeholder={errors.confirmPassword?.message || ''}
              {...register('confirmPassword')}
              className='input-ring-white focus-ring-white  rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12'
            ></input>
            {/* {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>} */}
          </div>
          <button
            className='mb-[2%] mt-[6%] flex w-[110%] flex-col items-center self-center rounded-sm bg-charcoal font-italiana text-2xl uppercase tracking-wide text-white md:py-2 md:text-base xl:text-xl lg:py-3 2xl:py-3 2xl:text-2xl'
            type='submit'
          >
            sign up
          </button>
        </form>
        <p className='text-center text-base md:text-xs'>
          already have an account? sign in{' '}
          <span
            onClick={() => setMode('sign-in')}
            className='cursor-pointer text-base text-[#958585] underline md:text-xs'
          >
            here
          </span>
        </p>
      </div>
    </>
  );
}
