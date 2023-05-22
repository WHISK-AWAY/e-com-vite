import { TUser } from '../../redux/slices/userSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect } from 'react';

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

const ZAccountData = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    oldPassword: z.string().min(8).max(20).optional(),
    newPassword: z.string().min(8).max(20).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    ({ oldPassword, newPassword }) => {
      return newPassword !== oldPassword;
    },
    {
      message:
        'Must provide a new password different from the old one (dumbass)',
    }
  )
  .refine(
    ({ oldPassword, newPassword }) => {
      if (newPassword) return !!oldPassword;
      return true;
    },
    {
      message: 'Must provide current password in order to set new password',
    }
  )
  .refine(
    ({ newPassword, confirmPassword }) => {
      return newPassword === confirmPassword;
    },
    { message: 'Passwords do not match' }
  );
// TODO: add route for password checker, and be very shitty about it

export default function EditAccountInfo({ user }: AccountProps) {
  if (!user) return <h1>Loading...</h1>;

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

  function formSubmit() {
    //stuff
  }

  useEffect(() => {
    checkPassword();
  }, []);

  async function checkPassword() {
    const { data } = (await axios.post(
      VITE_API_URL + '/api/auth/check-password',
      { password: 'fluffles' },
      { withCredentials: true }
    )) as { data: { passwordCheck?: boolean; error?: string } };
    if (data.error) throw new Error(data.error);

    const passwordCheck = data.passwordCheck;
    console.log('passwordCheck:', passwordCheck);
    return passwordCheck;
  }

  const { register, reset, resetField, handleSubmit, setError, clearErrors } =
    useForm<AccountFormData>({
      resolver: zodResolver(ZAccountData),
      defaultValues,
    });

  // TODO: set up form validation / clearing; trigger checkPassword on current password blur
  // TODO: handleSubmit via hook form
  return (
    <div>
      <h1>ACCOUNT INFO</h1>
      <p>First name: {firstName}</p>
      <p>Last name: {lastName}</p>
      <p>Email address: {email}</p>
      <div className="password-reset-form">
        <form className="" onSubmit={formSubmit}>
          <div className="input-pair">
            <label htmlFor="first-name">First name:</label>
            <input type="text" id="first-name" {...register('firstName')} />
          </div>

          <div className="input-pair">
            <label htmlFor="last-name">Last name:</label>
            <input type="text" id="last-name" {...register('lastName')} />
          </div>

          <div className="input-pair">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" {...register('email')} />
          </div>

          <div className="input-pair">
            <label htmlFor="old-password">Current Password:</label>
            <input
              type="password"
              id="old-password"
              {...register('oldPassword')}
            />
          </div>

          <div className="input-pair">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              {...register('newPassword')}
            />
          </div>

          <div className="input-pair">
            <label htmlFor="confirm-password">Confirm New Password:</label>
            <input
              type="password"
              id="confirm-password"
              {...register('confirmPassword')}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
