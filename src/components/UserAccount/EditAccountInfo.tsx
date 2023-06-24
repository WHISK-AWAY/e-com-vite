import { TUser } from '../../redux/slices/userSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  checkPassword,
  saveButtonShouldDisable,
} from '../../utilities/helpers';
import { editUserAccountInfo, TEditUser } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hooks';

const VITE_API_URL = import.meta.env.VITE_API_URL;

type AccountFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const ZAccountData = z.object({
  firstName: z
    .string()
    .min(2, { message: 'should contain at least 2 characters' })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: 'should contain at least 2 characters' })
    .optional(),
  email: z.string().email().optional(),
});

type AccountProps = {
  user: TUser;
};

export default function EditAccountInfo({ user }: AccountProps) {
  const dispatch = useAppDispatch();
  const { firstName, lastName, email } = user;
  const [saveDisabled, setSaveDisabled] = useState(true);

  /**
   * * FORM SETUP
   */

  const defaultValues: AccountFormData = {
    firstName,
    lastName,
    email,
    // oldPassword: '',
    // newPassword: '',
    // confirmPassword: '',
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
    for (let key in errors) {
      if (key === 'firstName') {
        setValue('firstName', '');
      } else if (key === 'lastName') {
        setValue('lastName', '');
      } else if (key === 'email') {
        setValue('email', '');
      }
    }
  }, [errors.firstName, errors.lastName, errors.email]);

  // * Disable save button until fields are edited
  useEffect(() => {
    setSaveDisabled(saveButtonShouldDisable(dirtyFields));
  }, [Object.keys(dirtyFields)]);

  // const passwordChecker = async (password: string) => {
  //   try {
  //     if (dirtyFields.oldPassword && !(await checkPassword(password))) {
  //       reset({
  //         oldPassword: '',
  //       });
  //       setError('oldPassword', {
  //         type: 'custom',
  //         message: 'Password is incorrect',
  //       });
  //     } else {
  //       clearErrors('oldPassword');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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

  function cancelEdits() {
    reset(defaultValues);
  }

  if (!user) return <h1>Loading user info...</h1>;

  return (
    <section className='edit-account-container h-full w-full pt-3'>
      <div className='form-wrapper h-full'>
        <form
          className='flex h-full flex-col justify-between'
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className='input-wrapper grid grid-flow-row grid-cols-3 items-center gap-x-4 gap-y-3'>
            <label className='text-right' htmlFor='first-name'>
              first name
            </label>
            <input
              className='col-span-2 border border-charcoal px-2 py-1'
              type='text'
              id='first-name'
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
            />
            <label className='text-right' htmlFor='last-name'>
              last name
            </label>
            <input
              className='col-span-2 border border-charcoal px-2 py-1'
              type='text'
              id='last-name'
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
            />
            <label className='text-right' htmlFor='email'>
              email address
            </label>
            <input
              className='col-span-2 border border-charcoal px-2 py-1'
              type='text'
              id='email'
              placeholder={errors.email?.message || ''}
              {...register('email')}
            />
          </div>
          {/* 
          <div className='input-pair'>
            <label htmlFor='old-password'>current password</label>
            <input
              type='password'
              id='old-password'
              {...register('oldPassword', {
                onBlur: (e) => passwordChecker(e.target.value),
              })}
            />
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
          </div> */}
          {!saveDisabled && (
            <div className='button-wrapper flex gap-2 self-end'>
              <button
                className='self-end rounded-sm border border-charcoal bg-white px-4 py-2 font-italiana uppercase text-charcoal'
                onClick={cancelEdits}
                type='button'
              >
                cancel
              </button>
              <button
                className='rounded-sm bg-charcoal px-4 py-2 font-italiana uppercase text-white'
                type='submit'
                disabled={saveDisabled}
              >
                save changes
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
