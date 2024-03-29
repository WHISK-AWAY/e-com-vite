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
  mobileMenu: boolean
};

export default function ManageShippingAddress({
  user,
  setManageShippingAddress,
  addressIndex,
  setAddressIndex,
  addresses,
  setAddresses,
  mobileMenu
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
  }, [addresses]);

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
              className="absolute right-[3%] top-[5%]"
              onClick={handleShippingAddressDelete}
              aria-label="delete address"
            >
              <img
                src={x}
                className="h-3"
                alt="delete address"
              />
            </button>
          )}

          {/* previous address button */}
          {selectorIdx > 0 && (
            <button
              className={` ${
                mobileMenu ? '-left-[7%]' : '-left-[10%]'
              } absolute  top-[40%] h-4 w-4`}
              onClick={() => {
                if (selectorIdx === 0) {
                  setSelectorIdx(addresses.length - 1);
                } else {
                  setSelectorIdx(selectorIdx - 1);
                }
              }}
              aria-label="previous entry"
            >
              <img
                src={arrowLeft}
                className="h-5"
                alt="previous entry"
              />
            </button>
          )}

          {/* next address button */}
          {selectorIdx < addresses.length - 1 && (
            <button
              className=""
              onClick={() => {
                if (selectorIdx < addresses.length - 1) {
                  setSelectorIdx(selectorIdx + 1);
                } else {
                  setSelectorIdx(0);
                }
              }}
              aria-label="next entry"
            >
              <img
                src={arrowRight}
                className={` ${
                  mobileMenu ? '-right-[7%]' : '-right-[10%]'
                } absolute   top-[40%] h-4 rotate-180`}
                alt="next entry"
              />
            </button>
          )}
        </>
      )}

      <div className="w-full">
        {/* CURRENT SHIPPING ADDRESS */}
        <section className=" w-full">
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
              mobileMenu={mobileMenu}
            />
          ) : (
            <div className="flex w-full justify-center ">
              <div className="flex w-[40%] flex-col items-center border-r border-charcoal lg:w-[40%] lg:items-center xl:w-2/6 2xl:w-[30%] 2xl:items-center portrait:w-[25%]">
                <div className={`${mobileMenu ? '' : 'leading-loose' } form-keys flex h-full flex-col py-9  text-start  font-grotesque  portrait:text-[1.1rem]`}>
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

              <div
                className={` ${
                  mobileMenu ? 'w-4/5 items-center justify-center' : 'w-5/6 items-start'
                } flex flex-col  portrait:w-4/5`}
              >
                <div
                  className={` ${
                    mobileMenu ? 'px-2 text-[1rem]' : 'px-12 pt-9 leading-loose'
                  } form-values flex w-full flex-col whitespace-nowrap text-start uppercase `}
                >
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
        </section>

        {!isFormEdit && (
          <div className=" btn-section wrap-nowrap relative flex  w-full items-center justify-center font-poiret text-sm text-white ">
            <div className="absolute top-5 flex justify-center gap-4 lg:w-11/12  lg:gap-6">
              <button
                onClick={() => {
                  setIsFormEdit(true);
                  setAddressFormMode('edit');
                }}
                className="rounded-sm bg-charcoal px-5 py-1  lg:px-8  lg:py-2 xl:px-10"
              >
                EDIT
              </button>

              <button
                onClick={selectAddress}
                className="whitespace-nowrap rounded-sm bg-charcoal px-5 py-1 lg:px-4 lg:py-2 xl:px-6"
              >
                USE THIS ADDRESS
              </button>

              {!isFormEdit && user._id && (
                <button
                  onClick={() => {
                    setIsFormEdit(true);
                    setAddressFormMode('new');
                  }}
                  className="whitespace-nowrap rounded-sm bg-charcoal px-5 py-1 lg:px-4 lg:py-2 xl:px-8"
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
