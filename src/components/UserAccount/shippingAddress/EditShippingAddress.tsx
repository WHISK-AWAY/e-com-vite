import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../../redux/hooks';
import {
  TShippingAddress,
  TUser,
  addShippingAddress,
  editShippingAddress,
} from '../../../redux/slices/userSlice';
import { EditFormModes, ShippingInfoFields } from './ManageShippingAddress';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  addressIndex,
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
    formState: { errors, defaultValues: currentDefaults },
  } = useForm<ShippingInfoFields>({
    resolver: zodResolver(ZShippingData),
    defaultValues,
    mode: 'onBlur',
  });

  const handleEditOrAddNewForm = async (data: ShippingInfoFields) => {
    const userFields = {
      isDefault: data.isDefault,
      userId: user._id!,
      shipToAddress: data.shipToAddress,
    };

    if (addressFormMode === 'new') {
      await dispatch(addShippingAddress({ shippingData: userFields }));

      if (userFields.isDefault) {
        setAddressIndex(0);
      } else {
        setAddressIndex(addresses.length);
      }
    } else if (addressFormMode === 'edit') {
      dispatch(
        editShippingAddress({
          userId: user._id!,
          shippingAddressId: currentShippingAddress!._id,
          shippingData: userFields,
        })
      );
    }

    setIsFormEdit(false);
  };

  function newShippingAddress() {
    // ? this would probably make more sense as an object -- then we can pass the "new" or "default" object to reset() depending on form mode

    reset({
      shipToAddress: {
        firstName: '',
        lastName: '',
        email: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
      },
    });
  }

  useEffect(() => {
    if (addressFormMode === 'new') newShippingAddress();
  }, [addressFormMode]);

  return (
    <section>
      {/* EDIT SHIPPING INFO FORM */}

      <>
        <form onSubmit={handleSubmit(handleEditOrAddNewForm)}>
          <div className='flex justify-center  py-3'>
            {addressFormMode === 'edit' ? (
              <h1>EDIT SHIPPING INFO</h1>
            ) : (
              <h1>ADD NEW SHIPPING ADDRESS</h1>
            )}
          </div>

          <div className='flex flex-col '>
            <div className='self-center pt-8 flex flex-col gap-3  w-4/6'>
              <div className='first-name-field flex flex-col'>
                <label htmlFor='first-name'>first name</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='first-name'
                  type='text'
                  {...register('shipToAddress.firstName')}
                />
              </div>
              <div className='address-1-field flex flex-col'>
                <label htmlFor='last-name'>last name</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='last-name'
                  type='text'
                  {...register('shipToAddress.lastName')}
                />
              </div>
              <div className='address-1-field flex flex-col'>
                <label htmlFor='email'>email</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='email'
                  type='text'
                  {...register('shipToAddress.email')}
                />
              </div>
              <div className='address-1-field flex flex-col'>
                <label htmlFor='address_1'>address_1</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='address_1'
                  type='text'
                  {...register('shipToAddress.address_1')}
                />
              </div>

              <div className='address-2-field flex flex-col'>
                <label htmlFor='address_2'>address_2</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='address_2'
                  type='text'
                  {...register('shipToAddress.address_2')}
                />
                {errors.shipToAddress?.address_2 && (
                  <p>{errors.shipToAddress.address_2.message}</p>
                )}
              </div>

              <div className='city-field flex flex-col'>
                <label htmlFor='city'>city</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='city'
                  type='text'
                  {...register('shipToAddress.city')}
                />
              </div>

              <div className='state-field flex flex-col'>
                <label htmlFor='state'>state</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='state'
                  type='text'
                  {...register('shipToAddress.state')}
                />
              </div>

              <div className='zip-field flex flex-col'>
                <label htmlFor='zip'>zip</label>
                <input
                  className='rounded-sm border border-charcoal p-1'
                  id='zip'
                  type='text'
                  {...register('shipToAddress.zip')}
                />
              </div>

              <div className='default-field text-sm flex text-end flex-col pb-3 w-full'>
                <div className="flex self-end">

                <label htmlFor='isDefault'>
                  make this address the default:
                </label>
                <input
                  type='checkbox'
                  
                  id='isDefault'
                  defaultChecked={currentDefaults?.isDefault === true || false}
                  {...register('isDefault')}
                  />
                  </div>
              </div>
            </div>
          </div>

          <div className='btn-section flex justify-center gap-6 pb-5'>
            <button
              type='submit'
              className='rounded-sm bg-charcoal lg:px-7 px-6 py-1 font-italiana text-white'
            >
              SAVE CHANGES
            </button>
            <button
              type='button'
              className='rounded-sm bg-charcoal lg:px-11  px-9 py-1 font-italiana text-white'
              onClick={() => {
                setIsFormEdit(false);
                setAddressFormMode('edit');
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </>
    </section>
  );
}
