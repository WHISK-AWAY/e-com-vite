import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../../redux/hooks';
import {
  TShippingAddress,
  TUser,
  addShippingAddress,
  editShippingAddress,
} from '../../../redux/slices/userSlice';
import { validateAddress } from '../../../utilities/googleAddressValidation';
import {
  EditFormModes,
  ShippingInfoFields,
  ShippingInfoString,
} from './ManageShippingAddress';
import { useEffect } from 'react';

const ZShippingData = z.object({
  isDefault: z.boolean(),
  shipToAddress: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    address_1: z.string().min(5),
    address_2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2),
    zip: z.string().min(5),
  }),
});

export type EditShippingAddressProps = {
  user: TUser;
  currentShippingAddress: TShippingAddress | null;
  setIsFormEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setAddressFormMode: React.Dispatch<React.SetStateAction<EditFormModes>>;
  addressFormMode: EditFormModes;
  setAddressIndex: React.Dispatch<React.SetStateAction<number>>;
  addresses: TShippingAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<TShippingAddress[]>>;
  addressIndex: number;
};

export default function EditShippingAddress({
  user,
  currentShippingAddress,
  setIsFormEdit,
  addressFormMode,
  setAddressFormMode,
  setAddressIndex,
  addresses,
  setAddresses,
}: EditShippingAddressProps) {
  const dispatch = useAppDispatch();

  const defaultValues: ShippingInfoFields = {
    shipToAddress: {
      firstName:
        currentShippingAddress?.shipToAddress.firstName || user.firstName || '',
      lastName:
        currentShippingAddress?.shipToAddress.lastName || user.lastName || '',
      email: currentShippingAddress?.shipToAddress.email || user.email || '',
      address_1:
        currentShippingAddress?.shipToAddress.address_1 ||
        user.address?.address_1 ||
        '',
      address_2:
        currentShippingAddress?.shipToAddress.address_2 ||
        user.address?.address_2 ||
        '',
      city:
        currentShippingAddress?.shipToAddress.city || user.address?.city || '',
      state:
        currentShippingAddress?.shipToAddress.state ||
        user.address?.state ||
        '',
      zip: currentShippingAddress?.shipToAddress.zip || user.address?.zip || '',
    },
    isDefault: currentShippingAddress?.isDefault || false,
  };

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, defaultValues: currentDefaults },
  } = useForm<ShippingInfoFields>({
    resolver: zodResolver(ZShippingData),
    defaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

  const submitNewAddress = async (data: ShippingInfoFields) => {
    const userFields = {
      isDefault: data.isDefault,
      userId: user._id,
      shipToAddress: data.shipToAddress,
    };

    // Send address to Google Places API for validation
    const addressCheckResult = await validateAddress(data.shipToAddress);
    const { unconfirmedFields, replacedFields } = addressCheckResult;

    console.log('addressCheckResult', addressCheckResult);

    // Result may be 'confirmed', 'replaced', 'unconfirmed', or 'rejected.'
    // If confirmed or replaced, we're all good to go ahead with address creation.
    // However, note that some address components may still be replaced (spelling, etc.).

    if (['confirmed', 'replaced'].includes(addressCheckResult.result)) {
      // replace form fields with validated API response
      userFields.shipToAddress = {
        ...userFields.shipToAddress,
        ...addressCheckResult.address,
      };

      if (user._id) {
        // If there's a user ID, we can save this new address to the database.
        if (addressFormMode === 'new') {
          await dispatch(addShippingAddress({ shippingData: userFields }));
        } else if (addressFormMode === 'edit') {
          dispatch(
            editShippingAddress({
              userId: user._id!,
              shippingAddressId: currentShippingAddress!._id!,
              shippingData: userFields,
            })
          );
        }

        // If we've chosen or created a new default, it will be moved to the top of the array.
        if (userFields.isDefault) {
          setAddressIndex(0);
        } else {
          setAddressIndex(addresses.length);
        }
        setIsFormEdit(false);
      } else {
        // No userId, therefore treat this address as that of a guest user
        const guestUserAddress = {
          // Since we're on the 'address confirmed' path, we can be confident that .address exists
          shipToAddress: {
            firstName: data.shipToAddress.firstName,
            lastName: data.shipToAddress.lastName,
            email: data.shipToAddress.email,
            address_1: addressCheckResult.address!.address_1,
            address_2:
              addressCheckResult.address?.address_2 ||
              data.shipToAddress.address_2,
            city: addressCheckResult.address!.city,
            state: addressCheckResult.address!.state,
            zip: addressCheckResult.address!.zip,
          },
          isDefault: true,
        };
        setAddresses([guestUserAddress]);
        setAddressIndex(0);
        setIsFormEdit(false);
      }
    } else if (
      ['unconfirmed', 'rejected'].includes(addressCheckResult.result)
    ) {
      // Address validation failed altogether - cannot proceed with given address.
      const validationDefaults = {
        ...data,
        shipToAddress: {
          ...data.shipToAddress,
          ...addressCheckResult.address,
        },
      };

      for (let comp of [
        ...(unconfirmedFields || []),
        ...(replacedFields || []),
      ]) {
        if (comp === 'IGNORE') continue;
        validationDefaults.shipToAddress![comp] = '';
      }

      reset(validationDefaults);

      if (unconfirmedFields) {
        for (let comp of unconfirmedFields) {
          if (comp === 'IGNORE') continue;
          const fieldName = ('shipToAddress.' + comp) as ShippingInfoString;
          setError(fieldName, {
            type: 'addressValidation',
            message:
              'Could not validate this entry. Please re-enter & resubmit.',
          });
        }
      }

      if (replacedFields) {
        for (let comp of replacedFields) {
          const fieldName = ('shipToAddress.' + comp) as ShippingInfoString;
          setError(fieldName, {
            type: 'addressValidation',
            message:
              'This entry was corrected during address validation. Resubmit to continue.',
          });
        }
      }
    } else {
      throw new Error("This shouldn't be possible.");
    }

    return;
  };

  return (
    <section>
      {/* EDIT SHIPPING INFO FORM */}

      <>
        {defaultValues.shipToAddress === undefined}
        <form onSubmit={handleSubmit(submitNewAddress)}>
          <div className='flex justify-center  py-3'>
            {user._id &&
              (addressFormMode === 'edit' ? (
                <h1>EDIT SHIPPING INFO</h1>
              ) : (
                <h1>ADD NEW SHIPPING ADDRESS</h1>
              ))}
          </div>

          <div className='flex flex-col '>
            <div className='flex w-4/6 flex-col gap-3 self-center  pt-8'>
              <div className='first-name-field flex flex-col'>
                <label htmlFor='first-name'>first name</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='first-name'
                  type='text'
                  {...register('shipToAddress.firstName')}
                  placeholder={
                    errors.shipToAddress?.firstName
                      ? errors.shipToAddress?.firstName?.message
                      : ''
                  }
                />
              </div>
              <div className='address-1-field flex flex-col'>
                <label htmlFor='last-name'>last name</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='last-name'
                  type='text'
                  {...register('shipToAddress.lastName')}
                  placeholder={
                    errors.shipToAddress?.lastName
                      ? errors.shipToAddress?.lastName?.message
                      : ''
                  }
                />
              </div>
              <div className='address-1-field flex flex-col'>
                <label htmlFor='email'>email</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='email'
                  type='text'
                  {...register('shipToAddress.email')}
                  placeholder={
                    errors.shipToAddress?.email
                      ? errors.shipToAddress?.email?.message
                      : ''
                  }
                />
              </div>
              <div className='address-1-field flex flex-col'>
                <label htmlFor='address_1'>address 1</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='address_1'
                  type='text'
                  {...register('shipToAddress.address_1')}
                  placeholder={
                    errors.shipToAddress?.address_1
                      ? errors.shipToAddress?.address_1?.message
                      : ''
                  }
                />
              </div>

              <div className='address-2-field flex flex-col'>
                <label htmlFor='address_2'>address 2</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='address_2'
                  type='text'
                  {...register('shipToAddress.address_2')}
                  placeholder={
                    errors.shipToAddress?.address_2
                      ? errors.shipToAddress?.address_2?.message
                      : ''
                  }
                />
              </div>

              <div className='city-field flex flex-col'>
                <label htmlFor='city'>city</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='city'
                  type='text'
                  {...register('shipToAddress.city')}
                  placeholder={
                    errors.shipToAddress?.city
                      ? errors.shipToAddress?.city?.message
                      : ''
                  }
                />
              </div>

              <div className='state-field flex flex-col'>
                <label htmlFor='state'>state</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='state'
                  type='text'
                  {...register('shipToAddress.state')}
                  placeholder={
                    errors.shipToAddress?.state
                      ? errors.shipToAddress?.state?.message
                      : ''
                  }
                />
              </div>

              <div className='zip-field flex flex-col'>
                <label htmlFor='zip'>zip</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='zip'
                  type='text'
                  {...register('shipToAddress.zip')}
                  placeholder={
                    errors.shipToAddress?.zip
                      ? errors.shipToAddress?.zip?.message
                      : ''
                  }
                />
              </div>

              <div className='default-field flex w-full flex-col pb-3 text-end text-sm'>
                <div className='flex self-end'>
                  <label htmlFor='isDefault'>
                    make this address the default:
                  </label>
                  <input
                    type='checkbox'
                    id='isDefault'
                    defaultChecked={
                      currentDefaults?.isDefault === true || false
                    }
                    {...register('isDefault')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='btn-section flex justify-center gap-6 pb-5'>
            <button
              type='submit'
              className='rounded-sm bg-charcoal px-6 py-1 font-italiana text-white lg:px-7'
            >
              SAVE CHANGES
            </button>
            {addresses.length > 0 && (
              <button
                type='button'
                className='rounded-sm bg-charcoal px-9  py-1 font-italiana text-white lg:px-11'
                onClick={() => {
                  setIsFormEdit(false);
                  setAddressFormMode('edit');
                }}
              >
                CANCEL
              </button>
            )}
          </div>
        </form>
      </>
    </section>
  );
}
