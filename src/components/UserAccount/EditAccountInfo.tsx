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

  if (!user) return <h1>Error accessing user info.</h1>;

  return (
    <section className='edit-account-container h-fit w-full min-w-[40vw] text-sm lg:text-base xl:text-lg 2xl:text-xl'>
      <form
        className='flex h-full w-full flex-col justify-between'
        onSubmit={handleSubmit(formSubmit)}
      >
        <div className='input-wrapper flex h-fit items-center'>
          <div className='label-column shrink-1 flex h-48 grow-0 basis-[35%] flex-col items-center justify-around border-r border-charcoal bg-white p-5 lg:basis-[30%]'>
            <label className='w-full' htmlFor='first-name'>
              first name
            </label>
            <label className='w-full' htmlFor='last-name'>
              last name
            </label>
            <label className='w-full' htmlFor='email'>
              email
            </label>
          </div>
          <div className='input-column grow-1 flex h-48 shrink-0 basis-[65%] flex-col items-center justify-around bg-white p-5 lg:basis-[70%]'>
            <input
              className='focus-no-ring w-full border border-charcoal px-3 py-1'
              type='text'
              id='first-name'
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
            />

            <input
              className='focus-no-ring w-full border border-charcoal px-3 py-1'
              type='text'
              id='last-name'
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
            />

            <input
              className='focus-no-ring w-full border border-charcoal px-3 py-1'
              type='text'
              id='email'
              placeholder={errors.email?.message || ''}
              {...register('email')}
            />
          </div>
        </div>

        <div className='button-wrapper absolute -bottom-[30%] right-1/2 flex w-full translate-x-[50%] justify-center gap-[3%]'>
          <button
            className='self-end rounded-sm border border-charcoal bg-white px-[4%] py-[1.5%] font-italiana uppercase text-charcoal disabled:border-charcoal/30 disabled:text-charcoal/30'
            onClick={cancelEdits}
            type='button'
            disabled={saveDisabled}
          >
            cancel
          </button>
          <button
            className='rounded-sm bg-charcoal px-[4%] py-[1.5%] font-italiana uppercase text-white disabled:bg-charcoal/30'
            type='submit'
            disabled={saveDisabled}
          >
            save changes
          </button>
        </div>
      </form>
    </section>
  );
}
