import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TEditUser,
  TUser,
  editUserAccountInfo,
} from '../../redux/slices/userSlice';
import { useEffect } from 'react';
import {
  checkPassword,
  saveButtonShouldDisable,
} from '../../utilities/helpers';

type AccountProps = {
  user: TUser;
};

const ZPasswordEdit = z
  .object({
    oldPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
    newPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
  })
  .refine(({ oldPassword, newPassword }) => oldPassword !== newPassword, {
    message: 'New password must be different than old one.',
    path: ['newPassword'],
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: 'New password & confirm password must match.',
      path: ['confirmPassword'],
    }
  );

type PasswordFormData = z.infer<typeof ZPasswordEdit>;

const defaultValues: PasswordFormData = {
  confirmPassword: '',
  newPassword: '',
  oldPassword: '',
};

export default function EditPassword({ user }: AccountProps) {
  const dispatch = useAppDispatch();
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const {
    register,
    reset,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(ZPasswordEdit),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    // Disable save/cancel buttons until fields are edited
    setSaveDisabled(saveButtonShouldDisable(dirtyFields));
  }, [Object.keys(dirtyFields)]);

  useEffect(() => {
    // Display "password updated" message for a short time
    if (passwordUpdated) {
      setTimeout(() => {
        setPasswordUpdated(false);
      }, 5000);
    }
  }, [passwordUpdated]);

  // useEffect(() => {
  //   console.log('form errors:', errors);
  // }, [errors]);

  function formSubmit(data: PasswordFormData) {
    // console.log('form-submitted data:', data);
    const updateUser: TEditUser = {
      userId: user._id,
      user: {
        oldPassword: data.oldPassword,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
    };
    dispatch(editUserAccountInfo(updateUser)).then(({ meta }) => {
      if (meta.requestStatus === 'fulfilled') {
        reset(defaultValues);
        setPasswordUpdated(true);
      }
    });
  }

  async function checkOldPassword(testPassword: string) {
    if (testPassword === '') return;
    const passwordMatches = await checkPassword(testPassword);

    if (!passwordMatches) {
      reset({ oldPassword: '' });
      setError('oldPassword', { message: 'Password incorrect.' });
    } else {
      clearErrors('oldPassword');
    }
  }

  return (
    <section className="edit-password-container h-full w-full pt-3">
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={handleSubmit(formSubmit)}
      >
        <div className="input-wrapper grid grid-cols-2 items-center gap-x-4 gap-y-3">
          <label
            htmlFor="old-password"
            className=""
          >
            old password
          </label>
          <input
            type="password"
            id="old-password"
            className="border border-charcoal text-base"
            {...register('oldPassword')}
            onBlur={(e) => checkOldPassword(e.target.value)}
            placeholder={errors.oldPassword ? errors.oldPassword.message : ''}
          />
          <label
            htmlFor="new-password"
            className=""
          >
            new password
          </label>
          <input
            type="password"
            id="new-password"
            className="border border-charcoal text-base"
            {...register('newPassword')}
          />
          <label
            htmlFor="confirm-password"
            className=""
          >
            confirm password
          </label>
          <input
            type="password"
            id="confirm-password"
            className="border border-charcoal text-base"
            {...register('confirmPassword')}
          />
        </div>
        {passwordUpdated && (
          <div className="password-update-message flex justify-center">
            <h2>Password updated successfully!</h2>
          </div>
        )}
        {!false && (
          <div className="button-wrapper flex gap-2 self-end">
            {!saveDisabled && (
              <>
                <button
                  className="self-end rounded-sm border border-charcoal bg-white px-4 py-2 font-grotesque uppercase text-charcoal"
                  type="reset"
                >
                  cancel
                </button>
                <button
                  className="rounded-sm bg-charcoal px-4 py-2 font-grotesque uppercase text-white"
                  type="submit"
                >
                  save changes
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
