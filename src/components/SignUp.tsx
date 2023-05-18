import { useState, useEffect } from 'react';
import { selectAuth, requestSignUp } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import axios from 'axios';
import { ZodType, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const VITE_API_URL = import.meta.env.VITE_API_URL;


export default function SignUp() {
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
          message: 'Password fields do  not match',
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


  const dispatch = useAppDispatch();
  const selectAuthUser = useAppSelector(selectAuth);


  
  console.log('selector', selectAuthUser);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors, 
    formState: { errors, dirtyFields },
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
  

    const emailFetcher = async (email: any) => {
      try {
        const { data } = await axios.post(
          VITE_API_URL + '/api/auth/check-email',
          {
            email,
          }
        );
        if (data.message) {
          reset({
            email: '',
          });
          setError('email', { type: 'custom', message: 'Email already exists' });
        } else {
          clearErrors('email')
        }
        // console.log('userEmail', data)
      } catch (err) {
        console.log(err);
      }
    };


    console.log('errors', errors);
    
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
      emailFetcher(dirtyFields.email)

  }, [ errors.confirmPassword]);

  const submitData = (data: FormData) => {
    // e.preventDefault();
    console.log('works', data);
    dispatch(requestSignUp(data));
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
            <input type='email' {...register('email', { onBlur:(e) => emailFetcher(e.target.value) })}></input>
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

          <input type='submit' />
          {/* <button>submit</button> */}
          {/* <button type='submit'>submit</button> */}
        </form>
      </div>
    </section>
  );
}
