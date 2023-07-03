import {
  TShippingAddress,
  TUser,
  deleteShippingAddress,
} from '../../../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import EditShippingAddress from './EditShippingAddress';
import arrowLeft from '../../../assets/icons/arrowLeft.svg';
import arrowRight from '../../../assets/icons/arrowRight.svg';
import x from '../../../assets/icons/x.svg';

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

export type ShippingInfoString =
  | 'isDefault'
  | 'shipToAddress'
  | 'root'
  | `root.${string}`
  | 'shipToAddress.firstName'
  | 'shipToAddress.lastName'
  | 'shipToAddress.email'
  | 'shipToAddress.address_1'
  | 'shipToAddress.address_2'
  | 'shipToAddress.city'
  | 'shipToAddress.state'
  | 'shipToAddress.zip';

export type EditFormModes = 'edit' | 'new';

export type ManageShippingAddressProps = {
  user: TUser;
  addressIndex: number;
  setAddressIndex: React.Dispatch<React.SetStateAction<number>>;
  addresses: TShippingAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<TShippingAddress[]>>;
  setManageShippingAddress: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ManageShippingAddress({
  user,
  setManageShippingAddress,
  addressIndex,
  setAddressIndex,
  addresses,
  setAddresses,
}: ManageShippingAddressProps) {
  const dispatch = useAppDispatch();
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const [addressFormMode, setAddressFormMode] = useState<EditFormModes>('new');
  const [selectorIdx, setSelectorIdx] = useState<number>(0);

  useEffect(() => {
    if (!selectorIdx) setSelectorIdx(addressIndex);
  }, [addressIndex]);

  useEffect(() => {
    if (!addresses || !addresses.length) setIsFormEdit(true);
  }, []);

  useEffect(() => {
    //! debug
    console.log('selectorIdx', selectorIdx);
    console.log('addresses', addresses);
  }, [selectorIdx]);

  // function setDefault() {
  //   let address = addresses[selectorIdx!];

  //   let shippingData: Partial<ShippingInfoFields> = {
  //     isDefault: true,
  //   };

  //   dispatch(
  //     editShippingAddress({
  //       userId: user._id,
  //       shippingAddressId: address._id!,
  //       shippingData,
  //     })
  //   );

  //   setAddressIndex(0);
  //   setManageShippingAddress(false);
  // }

  function selectAddress() {
    setAddressIndex(selectorIdx);
    setManageShippingAddress(false);
  }

  const handleShippingAddressDelete = async () => {
    await dispatch(
      deleteShippingAddress({
        shippingAddressId: addresses[selectorIdx]._id!,
        userId: user._id,
      })
    );
    setSelectorIdx((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      {!isFormEdit && (
        <>
          {user._id && (
            <button
              className='absolute right-[3%] top-[5%]'
              onClick={handleShippingAddressDelete}
            >
              <img src={x} className='h-3' />
            </button>
          )}

          {/* previous address button */}
          {selectorIdx > 0 && (
            <button
              className='absolute -left-[10%] top-[40%] h-4 w-4'
              onClick={() => {
                if (selectorIdx === 0) {
                  setSelectorIdx(addresses.length - 1);
                } else {
                  setSelectorIdx(selectorIdx - 1);
                }
              }}
            >
              <img src={arrowLeft} className='h-5' />
            </button>
          )}

          {/* next address button */}
          {selectorIdx < addresses.length - 1 && (
            <button
              className=''
              onClick={() => {
                if (selectorIdx < addresses.length - 1) {
                  setSelectorIdx(selectorIdx + 1);
                } else {
                  setSelectorIdx(0);
                }
              }}
            >
              <img
                src={arrowRight}
                className='absolute  -right-[10%] top-[40%] h-4 rotate-180'
              />
            </button>
          )}
        </>
      )}

      <div className='w-full'>
        {/* CURRENT SHIPPING ADDRESS */}
        <section className=' w-full'>
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
              setAddresses={setAddresses}
            />
          ) : (
            <div className='flex w-full justify-center '>
              <div className='flex w-[40%] flex-col items-center border-r border-charcoal lg:w-[40%] lg:items-center xl:w-2/6 2xl:w-[30%] 2xl:items-center'>
                <div className='form-keys flex h-full  flex-col  py-9  text-start  leading-loose'>
                  <p>full name</p>
                  <p>last name</p>
                  <p>email</p>
                  <p>address 1</p>
                  <p>address 2</p>
                  <p>city</p>
                  <p>state</p>
                  <p>zip</p>
                </div>
              </div>

              <div className='flex w-5/6 flex-col items-start'>
                <div className='form-values flex w-full flex-col whitespace-nowrap px-12 pt-9 text-start uppercase leading-loose'>
                  <p>{addresses[selectorIdx!]?.shipToAddress.firstName}</p>
                  <p>{addresses[selectorIdx!]?.shipToAddress.lastName}</p>
                  <p> {addresses[selectorIdx!]?.shipToAddress.email}</p>
                  <p>{addresses[selectorIdx!]?.shipToAddress.address_1}</p>
                  {addresses[selectorIdx]?.shipToAddress.address_2 ? (
                    <p>{addresses[selectorIdx!]?.shipToAddress.address_2}</p>
                  ) : (
                    '-'
                  )}

                  <p> {addresses[selectorIdx!]?.shipToAddress.city}</p>
                  <p>{addresses[selectorIdx!]?.shipToAddress.state}</p>
                  <p> {addresses[selectorIdx!]?.shipToAddress.zip}</p>
                </div>
              </div>
            </div>
          )}
          {/* <label htmlFor="checkbox" > set as default</label>
        <input name='checkbox' id='checkbox' type='checkbox' onChange={setDefault} className='border border-blue'>
        
      </input> */}
        </section>

        {!isFormEdit && (
          <div className=' btn-section wrap-nowrap relative flex  w-full items-center justify-center font-italiana text-sm text-white '>
            <div className='absolute top-5 flex justify-center gap-4 lg:w-11/12  lg:gap-6'>
              <button
                onClick={() => {
                  setIsFormEdit(true);
                  setAddressFormMode('edit');
                }}
                className='rounded-sm bg-charcoal px-5 py-1  lg:px-8  lg:py-2 xl:px-10'
              >
                EDIT
              </button>

              <button
                onClick={selectAddress}
                className='rounded-sm bg-charcoal px-5 py-1 lg:px-4 lg:py-2 xl:px-6'
              >
                USE THIS ADDRESS
              </button>

              {!isFormEdit && user._id && (
                <button
                  onClick={() => {
                    setIsFormEdit(true);
                    setAddressFormMode('new');
                  }}
                  className='rounded-sm bg-charcoal px-5 py-1 lg:px-4 lg:py-2 xl:px-8'
                >
                  ADD NEW
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
