import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { requestLogin, selectAuth } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailExists } from '../utilities/helpers';

export type FormData = {
  email: string;
  password: string;
};

const zodLogin: ZodType<FormData> = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
  })
  .strict();

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectAuthUser = useAppSelector(selectAuth);

  useEffect(() => {
    if (selectAuthUser.userId) {
      // ? redirect signed-in user to account page (likely to change later)
      navigate(`/user/${selectAuthUser.userId}`);
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
    <section className="form-container">
      <div>
        <h1>SIGN IN</h1>
        <form className="sign-in-form" onSubmit={handleSubmit(submitData)}>
          <div className="email-field">
            <label htmlFor="email">email</label>
            <input
              type="email"
              {...register('email', {
                onBlur: (e) => emailFetcher(e.target.value),
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="password-field">
            <label htmlFor="password">password</label>
            <input type="password" {...register('password')} />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <input type="submit" />
        </form>
        <p>
          don't have an account? sign up{' '}
          <Link to="/sign-up" className="text-green-400">
            here
          </Link>
        </p>
        <p>
          <Link to="/" className="text-green-400">
            Home
          </Link>
        </p>
      </div>
    </section>
  );
}
