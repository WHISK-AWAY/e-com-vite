import { useState } from 'react';
import { selectAuth, requestSignUp } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export default function SignUp() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const dispatch = useAppDispatch();


  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(requestSignUp({
      firstName, 
      lastName, 
      email, 
      password,
      confirmPassword
    }));

    
  };
  return (
    <section className='sign-up-form-container'>
      <div>
        <h1>SIGN UP</h1>
        <form className='sign-up-form'>
          <div className='first-name-field'>
            <label htmlFor='first-name'>first name</label>
            <input
              type='text'
              name='first-name'
              id='first-name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>
          <div className='last-name-field'>
            <label htmlFor='last-name'>last name</label>
            <input
              type='text'
              name='last-name'
              id='last-name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
          </div>
          <div className='email-field'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className='password-field'>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className='confirm-password-field'>
            <label htmlFor='confirm-password'>confirm password</label>
            <input type='password' name='confirm-password' id='confirm-password' value={confirmPassword} onChange={e=> setConfirmPassword(e.target.value)}></input>
          </div>
          
          <button onClick={handleClick}>SIGN UP</button>
        </form>
      </div>
    </section>
  );
}
