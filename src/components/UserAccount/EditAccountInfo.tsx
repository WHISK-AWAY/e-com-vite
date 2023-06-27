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
    <section className='edit-account-container h-fit w-[50vw]'>
      <form
        className='flex h-full flex-col justify-between'
        onSubmit={handleSubmit(formSubmit)}
      >
        <div className='input-wrapper grid grid-cols-[2fr_5fr] place-items-stretch gap-x-[0.5px] bg-charcoal'>
          <div className='label-column grid h-full grid-cols-1 grid-rows-3 place-items-start items-center gap-5 bg-white py-[15%] pl-[20%] lg:pl-[22%] xl:gap-y-6 xl:pl-[25%]'>
            <label className='' htmlFor='first-name'>
              first name
            </label>
            <label className='' htmlFor='last-name'>
              last name
            </label>
            <label className='' htmlFor='email'>
              email
            </label>
          </div>
          <div className='input-column grid h-full grid-cols-1 grid-rows-3 place-items-start items-center gap-5 bg-white p-[6%] xl:gap-y-6'>
            <input
              className='w-full border border-charcoal px-2 py-1'
              type='text'
              id='first-name'
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
            />

            <input
              className='w-full border border-charcoal px-2 py-1'
              type='text'
              id='last-name'
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
            />

            <input
              className='w-full border border-charcoal px-2 py-1'
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
