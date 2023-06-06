import {
  TShippingAddress,
  TUser,
  deleteShippingAddress,
} from '../../../redux/slices/userSlice';
import { editShippingAddress } from '../../../redux/slices/userSlice';
import { useEffect, useState } from 'react';
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

export type ManageShippingAddressProps = {
  // ? getting a little bulky - maybe we should define a Props type (e.g., ManageShippingAddressProps)?
  user: TUser;
  setManageShippingAddress: React.Dispatch<React.SetStateAction<boolean>>;
  addressIndex: number;
  setAddressIndex: React.Dispatch<React.SetStateAction<number>>;
  // currentShippingAddress: TShippingAddress | null;
  // setCurrentShippingAddress: React.Dispatch<
  //   React.SetStateAction<TShippingAddress | null>
  // >;
  addresses: TShippingAddress[];
};

// TODO: render empty ('new') form on load if no addresses exist

export default function ManageShippingAddress({
  user,
  setManageShippingAddress,
  addressIndex,
  setAddressIndex,
  // currentShippingAddress,
  // setCurrentShippingAddress,
  addresses,
}: ManageShippingAddressProps) {
  const dispatch = useAppDispatch();
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const [addressFormMode, setAddressFormMode] = useState<EditFormModes>('edit');
  // const [addresses, setAddresses] = useState<TShippingAddress[]>([]);
  const [selectorIdx, setSelectorIdx] = useState<number>(0);

  useEffect(() => {
    if (!selectorIdx) setSelectorIdx(addressIndex);
  }, [addressIndex]);

  function setDefault() {
    let address = addresses[selectorIdx!];

    let shippingData: Partial<ShippingInfoFields> = {
      isDefault: true,
    };

    dispatch(
      editShippingAddress({
        userId: user._id,
        shippingAddressId: address._id,
        shippingData,
      })
    );

    setAddressIndex(0);
    setManageShippingAddress(false);
  }

  function selectAddress() {
    setAddressIndex(selectorIdx);
    setManageShippingAddress(false);
  }

  const handleShippingAddressDelete = async() => {
    // console.log('fuck you');
   await dispatch(
      deleteShippingAddress({
        shippingAddressId: addresses[selectorIdx]._id,
        userId: user._id,
      })
    );
    setSelectorIdx((prev) => Math.max(prev - 1, 0));
    // setAddressIndex(0);
  };

  // console.log('addresses', addresses)
  // console.log('selectorIdx',selectorIdx)
  return (
    <div>
      <h1>address book</h1>

      {/* CURRENT SHIPPING ADDRESS */}
      <section>
        {isFormEdit ? (
          <EditShippingAddress
            user={user}
            currentShippingAddress={addresses[selectorIdx!]}
            setIsFormEdit={setIsFormEdit}
            addressFormMode={addressFormMode}
            setAddressFormMode={setAddressFormMode}
            setAddressIndex={setAddressIndex}
            addressIndex={addressIndex}
            addresses={addresses}
          />
        ) : (
          <>
            <p>
              first name: {addresses[selectorIdx!]?.shipToAddress.firstName}
            </p>
            <p>last name: {addresses[selectorIdx!]?.shipToAddress.lastName}</p>
            <p>email: {addresses[selectorIdx!]?.shipToAddress.email}</p>
            <p>address 1: {addresses[selectorIdx!]?.shipToAddress.address_1}</p>
            <p>address 2: {addresses[selectorIdx!]?.shipToAddress.address_2}</p>
            <p>city: {addresses[selectorIdx!]?.shipToAddress.city}</p>
            <p>state: {addresses[selectorIdx!]?.shipToAddress.state}</p>
            <p>zip: {addresses[selectorIdx!]?.shipToAddress.zip}</p>
            <button onClick={setDefault} className='bg-blue-300'>
              SET DEFAULT
            </button>
            <br />
            <button
              onClick={() => setIsFormEdit(true)}
              className='bg-green-500'
            >
              EDIT
            </button>
          </>
        )}
        <br />
        <button onClick={selectAddress} className='bg-fuchsia-500'>
          USE THIS ADDRESS
        </button>
        <br />
        <button
          onClick={() => setManageShippingAddress(false)}
          className='bg-red-400'
        >
          CANCEL
        </button>
        <br />
        <>
          <button
            className='bg-gray-500'
            onClick={() => {
              if (selectorIdx! < addresses.length - 1)
                setSelectorIdx((prev) => prev! + 1);
              else setSelectorIdx(0);
            }}
          >
            NEXT
          </button>
          <br />
        </>
        <button
          className='bg-gray-500'
          onClick={() => {
            if (selectorIdx! > 0) setSelectorIdx((prev) => prev! - 1);
            else setSelectorIdx(addresses.length - 1);
          }}
        >
          PREVIOUS
        </button>
        <br />
        <button
          onClick={() => {
            setIsFormEdit(true);
            setAddressFormMode('new');
          }}
          className='bg-yellow-400'
        >
          ADD NEW
        </button>
        <br />
        <button className='bg-rose-900' onClick={handleShippingAddressDelete}>
          DELETE
        </button>
      </section>
    </div>
  );
}
