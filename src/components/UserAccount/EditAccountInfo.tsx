import { TUser } from '../../redux/slices/userSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { saveButtonShouldDisable } from '../../utilities/helpers';
import { editUserAccountInfo } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hooks';

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
    handleSubmit,
    getValues,
    setValue,

    formState: { errors, dirtyFields },
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

  function formSubmit(_: AccountFormData) {
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
    <section className="edit-account-container h-fit w-fit text-[1rem] xl:w-[30svw]  5xl:w-[20svw] 6xl:w-[15svw] portrait:w-full portrait:md:max-w-[60svw]">
      <form
        className="flex h-full w-full flex-col justify-between"
        onSubmit={handleSubmit(formSubmit)}
      >
        <div className="input-wrapper flex h-fit items-center">
          <div className="label-column shrink-1 flex h-44 grow-0 basis-[25%] flex-col items-start justify-around border-r border-charcoal bg-white p-5 lg:basis-[20%] ">
            <label
              className="w-fit whitespace-nowrap text-sm 2xl:text-base portrait:md:text-base"
              htmlFor="first-name"
            >
              first name
            </label>
            <label
              className="w-fit whitespace-nowrap text-sm 2xl:text-base portrait:md:text-base"
              htmlFor="last-name"
            >
              last name
            </label>
            <label
              className="w-fit whitespace-nowrap text-sm 2xl:text-base portrait:md:text-base"
              htmlFor="email"
            >
              email
            </label>
          </div>
          <div className="input-column grow-1 flex h-44 shrink-0 basis-[75%] flex-col items-center justify-around overflow-x-hidden bg-white p-5 lg:basis-[80%]">
            <input
              className="focus-no-ring w-full border border-charcoal px-3 py-1 text-sm 2xl:text-base"
              type="text"
              id="first-name"
              placeholder={errors.firstName?.message || ''}
              {...register('firstName')}
            />

            <input
              className="focus-no-ring w-full border border-charcoal px-3 py-1 text-sm 2xl:text-base"
              type="text"
              id="last-name"
              placeholder={errors.lastName?.message || ''}
              {...register('lastName')}
            />

            <input
              className="focus-no-ring w-full border border-charcoal px-3 py-1 text-sm 2xl:text-base"
              type="text"
              id="email"
              placeholder={errors.email?.message || ''}
              {...register('email')}
            />
          </div>
        </div>

        <div className="button-wrapper absolute -bottom-[20%] right-1/2 flex w-full translate-x-[50%] justify-center gap-[3%] font-poiret text-[.5rem] lg:text-[.8rem] 2xl:text-[1rem] portrait:bottom-[5%] ">
          <button
            className="self-end rounded-sm border border-charcoal bg-white/30 px-4 uppercase text-charcoal disabled:border-charcoal/50 disabled:text-charcoal/50"
            onClick={cancelEdits}
            type="button"
            disabled={saveDisabled}
          >
            cancel
          </button>
          <button
            className="rounded-sm bg-charcoal px-4 uppercase text-white disabled:bg-charcoal/50"
            type="submit"
            disabled={saveDisabled}
          >
            save changes
          </button>
        </div>
      </form>
    </section>
  );
}
