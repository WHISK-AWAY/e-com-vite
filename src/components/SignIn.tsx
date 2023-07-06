import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { AuthState, requestLogin, selectAuth } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailExists } from '../utilities/helpers';
import signin from '../assets/bg-vids/sign-in.mp4';
import x from '../assets/icons/x.svg';
import SignUp from './SignUp';
import { TMode } from './SignWrapper';

export type FormData = {
  email: string;
  password: string;
};

const zodLogin: ZodType<FormData> = z
  .object({
    email: z
      .string()
      .email({ message: 'please enter a valid e-mail address ' }),
    password: z
      .string()
      .min(8, { message: 'should be at least 8 characters' })
      .max(20, { message: 'should be 20 characters at most' }),
  })
  .strict();

export default function SignIn({
  // setIsSigninHidden,
  mode,
  setMode,
}: {
  // setIsSigninHidden: React.Dispatch<React.SetStateAction<boolean>>;
  mode: TMode;
  setMode: React.Dispatch<React.SetStateAction<TMode>>;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectAuthUser = useAppSelector(selectAuth);
  const [isSignupHidden, setIsSignupHidden] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // useEffect(() => {
  //   if (selectAuthUser.userId) {
  //     navigate(`/shop-all`);
  //   }

  //   if (
  //     selectAuthUser.error.status === 403) {

  //     reset({
  //       password: '',
  //     });
  //     setError('password', {
  //       type: 'custom',
  //       message: 'incorrect password',
  //     });
  //   } else {
  //     clearErrors('password');
  //   }
  // }, [selectAuthUser]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(zodLogin),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    for (let key in errors) {
      if (key === 'password') {
        setValue('password', '');
      }
    }
  }, [errors.password]);

  const emailFetcher = async (email: any) => {
    try {
      if (await emailExists(email)) {
        clearErrors('email');
      } else {
        reset({
          email: '',
        });
        setError('email', {
          type: 'custom',
          message: 'email does not exist',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitData = async (data: FormData) => {
    dispatch(requestLogin(data))
      .then((meta) => {
        // console.log('mta', meta)
        const payload = meta?.payload as { status: number; message: string };

        if (payload?.status === 401) {
          console.log('incorrect password');
          reset({
            password: '',
          });
          setError('password', {
            type: 'custom',
            message: 'incorrect password',
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <video
        src={signin}
        className='h-full object-cover'
        loop={true}
        autoPlay={true}
      />

      <div className='absolute z-40 flex w-full flex-col items-center px-[13%] font-italiana'>
        <h1 className='pb-[8%] pt-[30%] text-xl lg:text-xl xl:text-2xl 2xl:text-2xl'>
          {/* pb-20 2xl:pb-20 md:pb-10 text-base md:pt-16 lg:pt-20 lg:text-xl xl:pt-20 xl:text-2xl 2xl:pt-20 2xl:text-3xl */}
          SIGN IN
        </h1>
        <form
          className='sign-in-form flex w-full flex-col'
          onSubmit={handleSubmit(submitData)}
        >
          <div className='email-field flex flex-col py-[4%] uppercase xl:text-xl 2xl:text-xl'>
            <label htmlFor='email' className='pl-4 lg:pb-1'>
              email
            </label>
            <input
              className='input-ring-charcoal rounded-sm p-2 font-federo text-xs text-charcoal placeholder:text-xs placeholder:text-charcoal autofill:border-charcoal focus:border-charcoal focus:outline-none focus:outline-1 focus:outline-offset-0  focus:outline-charcoal md:h-9 lg:h-12 lg:text-base 2xl:h-14'
              type='email'
              id='user-email'
              autoComplete='email'
              placeholder={errors.email?.message || ''}
              {...register('email', {
                onBlur: (e) => emailFetcher(e.target.value),
              })}
            />
            {/* {errors.email && <p>{errors.email.message}</p>} */}
          </div>
          <div className='password-field flex flex-col uppercase xl:text-xl 2xl:text-xl'>
            <label htmlFor='password' className='pl-4 lg:pb-1'>
              password
            </label>
            <input
              className='input-ring-charcoal flex rounded-sm p-2 text-xs placeholder:text-xs placeholder:text-charcoal autofill:border-charcoal focus:border-charcoal focus:outline-1 focus:outline-offset-0 focus:outline-charcoal md:h-9 lg:h-12 lg:text-base 2xl:h-14 '
              type='password'
              id='password'
              autoComplete='current-password'
              placeholder={errors.password?.message || ''}
              {...register('password')}
            />
            {/* {errors.password && (
                <p className='flex items-center pt-1 lg:text-base md:text-xs lowercase '>
                  {errors.password.message}
                </p>
              )} */}
          </div>
          <button
            className='mb-[2%] mt-[6%] flex w-[110%] flex-col items-center self-center rounded-sm bg-charcoal py-2 font-italiana text-2xl uppercase tracking-wide text-white md:text-base lg:py-3 lg:text-xl 2xl:py-4 '
            type='submit'
          >
            sign in
          </button>
        </form>
        <p className='text-center text-xs xl:text-base'>
          new here? create an account{' '}
          <span
            onClick={async () => setMode('sign-up')}
            className=' cursor-pointer text-xs text-white underline xl:text-base'
          >
            instead
          </span>
        </p>
      </div>
    </>
  );
}
