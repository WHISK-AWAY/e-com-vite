import { TUser } from '../../redux/slices/userSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { checkPassword } from '../../utilities/helpers';
import { editUserAccountInfo, TEditUser } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hooks';

const VITE_API_URL = import.meta.env.VITE_API_URL;

type AccountProps = {
  user: TUser;
};

type AccountFormData = {
  firstName: string;
  lastName: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// type UnknownArrOrObj = unknown[] | Record<string, unknown>;

const ZAccountData = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'should contain at least 2 characters' })
      .optional(),
    lastName: z
      .string()
      .min(2, { message: 'should contain at least 2 characters' })
      .optional(),
    email: z.string().email().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    ({ oldPassword, newPassword }) => {
      if (oldPassword === '') return true;
      return newPassword !== oldPassword;
    },
    {
      message:
        'Must provide a new password different from the old one (dumbass)',
      path: ['oldPassword'],
    }
  )
  .refine(
    ({ oldPassword, newPassword }) => {
      if (oldPassword === '' && newPassword === '') return true;
      if (newPassword) return !!oldPassword;
      return true;
    },
    {
      message: 'Must provide current password in order to set new password',
      path: ['newPassword'],
    }
  )
  .refine(
    ({ newPassword, confirmPassword }) => {
      if (newPassword === '' && confirmPassword === '') return true;
      return newPassword === confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export default function EditAccountInfo({ user }: AccountProps) {
  const dispatch = useAppDispatch();
  const { firstName, lastName, email } = user;

  /**
   * * FORM SETUP
   */

  const defaultValues: AccountFormData = {
    firstName,
    lastName,
    email,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const {
    register,
    reset,
    resetField,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    getValues,
    setValue,

    formState: { errors, touchedFields, dirtyFields },
  } = useForm<AccountFormData>({
    resolver: zodResolver(ZAccountData),
    defaultValues,
    values: defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    if (dirtyFields.oldPassword) {
      checkPassword(getValues('oldPassword')!);
    }
  }, [dirtyFields.oldPassword]);

  useEffect(() => {
    // console.log('errors', errors);
    for (let key in errors) {
      if (key === 'firstName') {
        setValue('firstName', '');
      } else if (key === 'lastName') {
        setValue('lastName', '');
      } else if (key === 'email') {
        setValue('email', '');
      } else if (key === 'confirmPassword') {
        setValue('confirmPassword', '');
        setValue('newPassword', '');
      } 
    }
  }, [
    errors.firstName,
    errors.lastName,
    errors.email,
    errors.confirmPassword,
    errors.newPassword,
  ]);

  const passwordChecker = async (password: string) => {
    try {
      if (!(await checkPassword(password))) {
        reset({
          oldPassword: undefined,
        });
        setError('oldPassword', {
          type: 'custom',
          message: 'Password is incorrect',
        });
      } else {
        clearErrors('oldPassword');
      }
    } catch (err) {
      console.error(err);
    }
  };

  function formSubmit(data: AccountFormData) {
    const dirtyValues = Object.keys(dirtyFields).reduce(
      (accum: any, key: any) => {
        if (key === 'newPassword')
          return { ...accum, password: getValues(key) };
        return { ...accum, [key]: getValues(key) };
      },
      {} as Partial<AccountFormData>
    );

    dispatch(
      editUserAccountInfo({ user: dirtyValues, userId: user._id.toString() })
    );
  }

  // TODO: set up form validation / clearing; trigger checkPassword on current password blur
  // TODO: handleSubmit via hook form
  if (!user) return <h1>Loading...</h1>;
  return (
    <div className='account-container'>
      <h1>ACCOUNT INFO</h1>
      <div className='form-wrapper'>
        <form className='' onSubmit={handleSubmit(formSubmit)}>
          <div className='input-pair'>
            <label htmlFor='first-name'>First name:</label>
            {/*TODO: test placeholder err handling  once submit is wired*/}
            <input
              type='text'
              id='first-name'
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
            />
            {/* {errors.firstName && <p>{errors.firstName.message}</p>} */}
          </div>

          <div className='input-pair'>
            <label htmlFor='last-name'>Last name:</label>
            <input
              type='text'
              id='last-name'
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
            />
          </div>

          <div className='input-pair'>
            <label htmlFor='email'>Email:</label>
            <input
              type='text'
              id='email'
              placeholder={errors.email?.message || ''}
              {...register('email')}
            />
          </div>
          {/* <button type='submit'>SAVE </button> */}
          {/*          

          <form onSubmit={handleSubmit(submitPassword)}> */}
          <div className='input-pair'>
            <label htmlFor='old-password'>Current Password:</label>
            <input
              type='password'
              id='old-password'
              {...register('oldPassword', {
                onBlur: (e) => passwordChecker(e.target.value),
              })}
            />
            {/* {errors.oldPassword && <p>{errors.oldPassword.message}</p>} */}
          </div>

          <div className='input-pair'>
            <label htmlFor='new-password'>New Password:</label>
            <input
              type='password'
              id='new-password'
              placeholder={errors.newPassword?.message || ''}
              {...register('newPassword')}
            />
          </div>

          <div className='input-pair'>
            <label htmlFor='confirm-password'>Confirm New Password:</label>
            <input
              type='password'
              id='confirm-password'
              placeholder={errors.confirmPassword?.message || ''}
              {...register('confirmPassword')}
            />
          </div>
          <button type='submit'>SAVE</button>
        </form>
      </div>
    </div>
  );
}
