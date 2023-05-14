import { useState } from 'react';
// import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { requestLogin, selectAuth } from '../redux/slices/authSlice';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const loginSelector = useAppSelector(selectAuth);

  console.log('LS', loginSelector);
  const handleClick = async (e: any) => {
    e.preventDefault();

    dispatch(requestLogin({ email, password }));

    // console.log('T', token);
  };

  // const handleClickTest = async() => {
  //   const data = (window.localStorage.getItem('token'));
  //  if(!data) return;

  //  const {userId, token} = JSON.parse(data);
  //   const user = await axios.get(`http://localhost:3001/api/user/${userId}`, {headers: {authorization: token}})
  //   // console.log('token', userId);

  //   console.log('user', user)
  // }
  return (
    <section className='form-container'>
      <div>
        <h1>SIGN IN</h1>
        <form className='sign-in-form'>
          <div className='email-field'>
            <label htmlFor='email'></label>
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='password-field'>
            <label htmlFor='password'></label>
            <input
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' onClick={async (e) => await handleClick(e)}>
            SIGN IN
          </button>
        </form>
      </div>
    </section>
  );
}
