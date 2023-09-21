import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

type SignUpProps = {
  mode: TMode;
  setMode: React.Dispatch<React.SetStateAction<TMode>>;
  setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignUp({
  setIsSignFormHidden,
  mode,
  setMode,
}: SignUpProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectAuthUser = useAppSelector(selectAuth);

  const zodUser: ZodType<FormData> = z
    .object({
      firstName: z
        .string()
        .min(1, { message: 'First name must be at least 1 character.' }),
      lastName: z
        .string()
        .min(2, { message: 'Last name must be at least 2 characters.' }),
      email: z.string().email({ message: 'Please enter a valid e-mail address.' }),
      password: z
        .string()
        .min(8, { message: 'Password must contain 8-20 characters.' })
        .max(20, { message: 'Password must contain 8-20 characters.' }),
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
        .min(8, { message: 'Password must contain 8-20 characters.' })
        .max(20, { message: 'Password must contain 8-20 characters.' }),
    })
    .strict()
    .refine(({ password, confirmPassword }) => {
      return password === confirmPassword
    }, {
      message: 'Password fields do not match.',
      path: ['confirmPassword'],
    })

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
        className='h-full object-cover'
        loop
        autoPlay
        muted
        playsInline
        controls={false}
      >
        <source src="/assets/bg-vids/sign-up.webm" type="video/webm" />
        <source src="/assets/bg-vids/sign-up.mp4" type="video/mp4" />
      </video>

      <div className='absolute z-40 flex w-full flex-col items-center px-[13%] font-poiret text-white portrait:translate-y-[5%] '>
        <h1 className='pb-[11%] pt-[29%] text-lg lg:text-xl xl:text-2xl 2xl:text-2xl portrait:text-[2rem]'>
          SIGN UP
        </h1>
        <form
          className='sign-up-form flex w-full flex-col'
          onSubmit={handleSubmit(submitData)}
        >
          <div className='first-name-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label
              htmlFor='first-name'
              className='pl-4 font-grotesque lg:pb-1 portrait:text-[1.2rem]'
            >
              first name
            </label>
            <input
              type='text'
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
              className='input-ring-white input focus-ring-white appearance-none!important rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal focus:outline-none  focus:outline-2 focus:outline-offset-0 focus:outline-white md:h-9 lg:h-10 lg:text-base xl:h-11  2xl:h-12 portrait:mb-2 portrait:text-[1rem] portrait:placeholder:text-sm portrait:md:py-5 portrait:md:text-lg portrait:md:placeholder:text-lg'
            ></input>
            {/* {errors.firstName && <p>{errors.firstName.message}</p>} */}
          </div>
          <div className='last-name-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg  2xl:text-lg'>
            <label
              htmlFor='last-name'
              className='pl-4 font-grotesque lg:pb-1 portrait:text-[1.2rem] portrait:md:pt-2'
            >
              last name
            </label>
            <input
              type='text'
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
              className='input-ring-white input focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12 portrait:mb-2 portrait:text-[1rem] portrait:placeholder:text-sm portrait:md:py-5 portrait:md:text-lg portrait:md:placeholder:text-lg'
            ></input>
            {/* {errors.lastName && <p>{errors.lastName.message}</p>} */}
          </div>
          <div className='email-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label
              htmlFor='email'
              className='pl-4 font-grotesque lg:pb-1 portrait:text-[1.2rem] portrait:md:pt-2'
            >
              email
            </label>
            <input
              type='email'
              autoComplete='email'
              placeholder={errors.email?.message || ''}
              {...register('email', {
                onBlur: (e) => emailFetcher(e.target.value),
              })}
              className='input-ring-white input focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12 portrait:mb-2 portrait:text-[1rem] portrait:placeholder:text-sm portrait:md:py-5 portrait:md:text-lg portrait:md:placeholder:text-lg'
            ></input>
            {/* {errors.email && <p>{errors.email.message}</p>} */}
          </div>
          <div className='password-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label
              htmlFor='password'
              className='pl-4 font-grotesque lg:pb-1 portrait:text-[1.2rem] portrait:md:pt-2'
            >
              password
            </label>
            <input
              type='password'
              autoComplete='new-password'
              placeholder={errors.password?.message || ''}
              {...register('password')}
              className='input-ring-white  focus-ring-white rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12 portrait:mb-2 portrait:text-[1rem] portrait:placeholder:text-sm portrait:md:py-5 portrait:md:text-lg portrait:md:placeholder:text-lg'
            ></input>
            {/* {errors.password && <p>{errors.password.message}</p>} */}
          </div>
          <div className='confirm-password-field flex flex-col py-[1%] text-base uppercase tracking-wide xl:text-lg 2xl:text-lg'>
            <label
              htmlFor='confirm-password'
              className='pl-4 font-grotesque lg:pb-1 portrait:text-[1.2rem] portrait:md:pt-2'
            >
              confirm password
            </label>
            <input
              type='password'
              autoComplete='new-password'
              placeholder={errors.confirmPassword?.message || ''}
              {...register('confirmPassword')}
              className='input-ring-white focus-ring-white  rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal md:h-9 lg:h-10 lg:text-base xl:h-11 2xl:h-12 portrait:mb-2 portrait:text-[1rem] portrait:placeholder:text-sm portrait:md:py-5 portrait:md:text-lg portrait:md:placeholder:text-lg'
            ></input>
            {/* {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>} */}
          </div>
          <button
            className='mb-[2%] mt-[6%] flex w-full flex-col  items-center  self-center rounded-sm bg-charcoal font-poiret text-2xl uppercase tracking-wide text-white md:py-2 md:text-base lg:py-3 xl:text-xl 2xl:py-3 2xl:text-2xl portrait:w-full  portrait:py-1  portrait:md:py-3 portrait:md:text-[1.7rem]'
            type='submit'
          >
            sign up
          </button>
        </form>
        <p className='text-center font-grotesque text-base md:text-xs portrait:md:text-[1.2rem]'>
          already have an account? sign in{' '}
          <span
            onClick={() => setMode('sign-in')}
            className='cursor-pointer text-base text-[#958585] underline md:text-xs  portrait:md:text-[1.2rem]'
          >
            here
          </span>
        </p>
      </div>
    </>
  );
}
