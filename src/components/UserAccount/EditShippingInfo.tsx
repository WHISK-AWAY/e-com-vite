import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TUser } from '../../redux/slices/userSlice';
import { appendErrors, useForm } from 'react-hook-form';
import { editUserAccountInfo } from '../../redux/slices/userSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import axios from 'axios';
import { checkAddress } from '../../utilities/googleAddressValidation';

type ShippingProps = {
  user: TUser;
};

type ShippingInfoFields = {
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;
};

const ZShippingData = z.object({
  address_1: z.string().min(5),
  address_2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2),
  zip: z.string().min(5),
});

// TODO: googleApi, empty fields validation

export default function ShippingInfo({ user }: ShippingProps) {
  const { address } = user;
  const dispatch = useAppDispatch();
  const { address_1, address_2, city, state, zip } = address!;

  const defaultValues: ShippingInfoFields = {
    address_1,
    address_2: address_2 || '',
    city,
    state,
    zip,
  };

  const {
    register,
    reset,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ShippingInfoFields>({
    resolver: zodResolver(ZShippingData),
    defaultValues,
    mode: 'onBlur',
  });

  if (!address) return <h1>No addresses saved...</h1>;

  const submitData = (data: ShippingInfoFields) => {
    console.log('inside submitData');

    checkAddress({
      addressLines: [data.address_1, data.address_2],
      administrativeArea: data.state,
      locality: data.city,
      postalCode: data.zip,
      regionCode: 'US',
    }).then((validatedAddress) => {});

    // dispatch(
    //   editUserAccountInfo({ userId: user._id!, user: { address: data } })
    // );
  };

  return (
    <div className="edit-shipping-info-container">
      <h1>SHIPPING INFO</h1>
      <form onSubmit={handleSubmit(submitData)}>
        <div className="address-1-field">
          <label htmlFor="address_1">Address_1</label>
          <input id="address_1" type="text" {...register('address_1')} />
        </div>

        <div className="address-2-field">
          <label htmlFor="address_2">Address_2</label>
          <input id="address_2" type="text" {...register('address_2')} />
          {errors.address_2 && <p>{errors.address_2.message}</p>}
        </div>

        <div className="city-field">
          <label htmlFor="city">City</label>
          <input id="city" type="text" {...register('city')} />
        </div>

        <div className="state-field">
          <label htmlFor="state">State</label>
          <input id="state" type="text" {...register('state')} />
        </div>

        <div className="zip-field">
          <label htmlFor="zip">Zip</label>
          <input id="zip" type="text" {...register('zip')} />
        </div>
        <button type="submit">SAVE</button>
      </form>
    </div>
  );
}
