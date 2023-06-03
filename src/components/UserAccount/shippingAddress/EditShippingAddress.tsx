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
  setAddressFormMode : React.Dispatch<React.SetStateAction<EditFormModes>>
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
  addressIndex
}: EditShippingAddressProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('cur:', currentShippingAddress);
  }, []);

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

  const handleEditOrAddNewForm = async(data: ShippingInfoFields) => {
    const userFields = {
      isDefault: data.isDefault,
      userId: user._id!,
      shipToAddress: data.shipToAddress,
    };

    if (addressFormMode === 'new') {
      console.log('addressIdx', addressIndex)
      // dispatch new address thunk
      await dispatch(addShippingAddress({ shippingData: userFields }));
      // setAddressIndex(addresses.length -1)
      // console.log(setAddressIndex(addresses.length - 1));

      if(userFields.isDefault) {
        setAddressIndex(0);

      } else {
        setAddressIndex(addresses.length);
      }
    } else if (addressFormMode === 'edit') {
      //dispatch edit address thunk (w/ address ID)

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
          <>
            {addressFormMode === 'edit' ? (
              <h1>EDIT SHIPPING INFO</h1>
            ) : (
              <h1>ADD NEW SHIPPING ADDRESS</h1>
            )}
          </>

          <div className='first-name-field'>
            <label htmlFor='first-name'>First name</label>
            <input
              id='first-name'
              type='text'
              {...register('shipToAddress.firstName')}
            />
          </div>
          <div className='address-1-field'>
            <label htmlFor='last-name'>Last name</label>
            <input
              id='last-name'
              type='text'
              {...register('shipToAddress.lastName')}
            />
          </div>
          <div className='address-1-field'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              type='text'
              {...register('shipToAddress.email')}
            />
          </div>
          <div className='address-1-field'>
            <label htmlFor='address_1'>Address_1</label>
            <input
              id='address_1'
              type='text'
              {...register('shipToAddress.address_1')}
            />
          </div>

          <div className='address-2-field'>
            <label htmlFor='address_2'>Address_2</label>
            <input
              id='address_2'
              type='text'
              {...register('shipToAddress.address_2')}
            />
            {errors.shipToAddress?.address_2 && (
              <p>{errors.shipToAddress.address_2.message}</p>
            )}
          </div>

          <div className='city-field'>
            <label htmlFor='city'>City</label>
            <input id='city' type='text' {...register('shipToAddress.city')} />
          </div>

          <div className='state-field'>
            <label htmlFor='state'>State</label>
            <input
              id='state'
              type='text'
              {...register('shipToAddress.state')}
            />
          </div>

          <div className='zip-field'>
            <label htmlFor='zip'>Zip</label>
            <input id='zip' type='text' {...register('shipToAddress.zip')} />
          </div>

          <div className='default-field'>
            <label htmlFor='isDefault'>Make this address the default:</label>
            <input
              type='checkbox'
              id='isDefault'
              defaultChecked={currentDefaults?.isDefault === true || false}
              {...register('isDefault')}
            />
          </div>

          <button type='submit' className='bg-green-800'>
            SAVE CHANGES
          </button>
          <button
            type='button'
            className='bg-red-800'
            onClick={() => {setIsFormEdit(false); setAddressFormMode('edit')}}
          >
            CANCEL
          </button>

          {/* {addressValidationFailed && <h2>INVALID ADDRESS - RE-ENTER</h2>} */}
        </form>
      </>
    </section>
  );
}
