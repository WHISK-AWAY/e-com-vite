import { useState } from 'react';
import axios from 'axios';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleClick = async (e: any) => {
    e.preventDefault();

    const token = await axios.post('http://localhost:3001/api/auth/login', {
      email,
      password,
    });
    window.localStorage.setItem('token', JSON.stringify(token.data));

    console.log('T', token);
    // console.log('EP', email, password);
  };


  const handleClickTest = async() => {
    const token = (window.localStorage.getItem('token'));
   if(!token) return;
   
   const {userId} = JSON.parse(token);
    const user = await axios.get(`http://localhost:3001/api/user/${userId}`)
    console.log('token', userId);
  }
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

        <button onClick={handleClickTest}>TOKEN TEST</button>
      </div>
    </section>
  );
}
