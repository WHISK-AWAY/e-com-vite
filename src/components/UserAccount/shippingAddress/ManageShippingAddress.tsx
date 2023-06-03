import { TShippingAddress, TUser } from '../../../redux/slices/userSlice';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import EditShippingAddress from './EditShippingAddress';

export type ShippingInfoFields = {
  isDefault: boolean;
  shipToAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
  };
};

export type EditFormModes = 'edit' | 'new';

export default function ManageShippingAddress({
  // ? we'll need to bring in a "current" setter so this component can choose an address & send choice back to recap component
  user,
  setManageShippingAddress,
  currentShippingAddress,
}: {
  // ? getting a little bulky - maybe we should define a Props type (e.g., ManageShippingAddressProps)?
  user: TUser;
  setManageShippingAddress: React.Dispatch<React.SetStateAction<boolean>>;
  currentShippingAddress: TShippingAddress | null;
}) {
  const dispatch = useAppDispatch();
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const [addressFormMode, setAddressFormMode] = useState<EditFormModes>('edit');

  return (
    <div>
      <h1>address book</h1>

      {/* CURRENT SHIPPING ADDRESS */}
      <section>
        {isFormEdit ? (
          <EditShippingAddress
            user={user}
            currentShippingAddress={currentShippingAddress}
            setIsFormEdit={setIsFormEdit}
            addressFormMode={addressFormMode}
          />
        ) : (
          <>
            <p>first name: {currentShippingAddress?.shipToAddress.firstName}</p>
            <p>last name: {currentShippingAddress?.shipToAddress.lastName}</p>
            <p>email: {currentShippingAddress?.shipToAddress.email}</p>
            <p>address 1: {currentShippingAddress?.shipToAddress.address_1}</p>
            <p>address 2: {currentShippingAddress?.shipToAddress.address_2}</p>
            <p>city: {currentShippingAddress?.shipToAddress.city}</p>
            <p>state: {currentShippingAddress?.shipToAddress.state}</p>
            <p>zip: {currentShippingAddress?.shipToAddress.zip}</p>

            <button onClick={() => setIsFormEdit(true)}>EDIT</button>
          </>
        )}
        <br />
        <button // ? hide this while in edit mode
          onClick={() => {
            setIsFormEdit(true);
            setAddressFormMode('new');
          }}
        >
          ADD NEW
        </button>
      </section>
    </div>
  );
}
