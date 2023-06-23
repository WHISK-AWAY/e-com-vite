import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { requestLogin, selectAuth } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailExists } from '../utilities/helpers';
import signin from '../assets/bg-vids/sign-in.mp4';

export type FormData = {
  email: string;
  password: string;
};

const zodLogin: ZodType<FormData> = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be 20 characters at most' }),
  })
  .strict();

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectAuthUser = useAppSelector(selectAuth);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (selectAuthUser.userId) {
      navigate(`/shop-all`);
    }

    if (selectAuthUser.error.status === 403) {
      reset({
        password: '',
      });
      setError('password', {
        type: 'custom',
        message: 'Incorrect password',
      });
    } else {
      clearErrors('password');
    }
  }, [selectAuthUser]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(zodLogin),
    defaultValues: { email: '', password: '' },
  });

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
          message: 'Email does not exist',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitData = (data: FormData) => {
    dispatch(requestLogin(data));
  };

  return (
    <section className='form-container flex h-screen w-[100vw] flex-col overflow-hidden  bg-[#35403F]/50'>
      <div className='relative flex h-full w-[40vw] flex-col self-end bg-white'>
        <video
          src={signin}
          className='object-fit w-full'
          loop={true}
          autoPlay={true}
        />
        <h1 className='absolute z-50 flex w-full flex-col items-center font-italiana text-2xl'>
          SIGN IN
        </h1>
        <form
          className='sign-in-form absolute z-50 flex flex-col items-center pt-20'
          onSubmit={handleSubmit(submitData)}
        >
          <div className='email-field'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              {...register('email', {
                onBlur: (e) => emailFetcher(e.target.value),
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className='password-field'>
            <label htmlFor='password'>password</label>
            <input type='password' {...register('password')} />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <input type='submit' />
        </form>
        <p>
          don't have an account? sign up{' '}
          <Link to='/sign-up' className='text-green-400'>
            here
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
