import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { requestLogin, selectAuth } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  // const loginSelector = useAppSelector(selectAuth);

  // console.log('LS', loginSelector);
  const handleClick = async (e: any) => {
    e.preventDefault();

    dispatch(requestLogin({ email, password }));
  };

  return (
    <section className='form-container'>
      <div>
        <h1>SIGN IN</h1>
        <form className='sign-in-form'>
          <div className='email-field'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='password-field'>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' onClick={async (e) => await handleClick(e)}>
            LOG IN
          </button>
        </form>
        <p>
          don't have an account? sign up <Link to={'/sign_up'}>here</Link>
        </p>
      </div>
    </section>
  );
}
