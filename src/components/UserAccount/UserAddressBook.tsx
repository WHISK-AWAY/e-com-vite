import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import {
  TShippingAddress,
  TUser,
  deleteShippingAddress,
} from '../../redux/slices/userSlice';
import { orderAddressArray } from '../../utilities/helpers';
import arrow from '../../assets/icons/arrowRight.svg';
import SimpleButton from '../SimpleButton';

export type UserAddressBookProps = {
  user: TUser;
};

export default function UserAddressBook({ user }: UserAddressBookProps) {
  const dispatch = useAppDispatch();

  const [addresses, setAddresses] = useState<TShippingAddress[]>([]);
  const [addressIdx, setAddressIdx] = useState(0);
  const [showAddressManager, setShowAddressManager] = useState(false);

  useEffect(() => {
    // Initialize state variables
    if (user.shippingAddresses?.length > 0) {
      const addressArray = orderAddressArray(user);
      if (addressArray?.length) setAddresses(addressArray);
    } else {
      setShowAddressManager(true);
    }
  }, [user]);

  useEffect(() => {
    //! debug logs
    console.log('addressIdx:', addressIdx);
    console.log('addresses length:', addresses.length);
  });

  if (!addresses.length) {
    return <div>Loading addresses...</div>;
  }

  function deleteAddress() {
    dispatch(
      deleteShippingAddress({
        shippingAddressId: addresses[addressIdx]._id!,
        userId: user._id,
      })
    ).then(() => {
      setAddresses((prev) =>
        prev.filter((address) => address._id !== addresses[addressIdx]._id)
      );
      setAddressIdx((prev) => Math.max(prev - 1, 0));
    });
  }

  // if (true) return <div className='w-full'>Still testing...</div>;
  const currentAddress = addresses[addressIdx].shipToAddress;
  return (
    <>
      {showAddressManager ? (
        <div>maybe someday this will be an address book manager...</div>
      ) : (
        <div className='flex h-full w-[50vw] flex-col items-center justify-start text-xs lg:text-sm xl:text-base 2xl:text-lg'>
          <div className='relative mx-auto grid h-full w-full grid-cols-[2fr,_4fr] place-items-stretch xl:grid-cols-[2fr,_5fr]'>
            {/* <img src={arrowLeft} alt='left arrow' /> */}
            {addressIdx > 0 && (
              <img
                src={arrow}
                onClick={() => setAddressIdx((prev) => (prev -= 1))}
                className='absolute left-2 top-1/2 w-4 translate-y-[-50%] cursor-pointer 2xl:w-6'
                alt='left arrow'
              />
            )}
            {addressIdx < addresses.length - 1 && (
              <img
                src={arrow}
                onClick={() => setAddressIdx((prev) => (prev += 1))}
                className='absolute right-2 top-1/2 w-4 translate-y-[-50%] rotate-180 cursor-pointer 2xl:w-6'
                alt='right arrow'
              />
            )}
            <div className='label-column grid h-full grid-cols-1 place-items-start items-center gap-2 border-r border-charcoal bg-white py-[15%] pl-[30%] xl:pl-[25%]'>
              <p className=''>full name</p>
              <p className=''>email</p>
              <p className=''>address 1</p>
              <p className=''>address 2</p>
              <p className=''>city</p>
              <p className=''>state</p>
              <p className=''>zip</p>
            </div>
            <div className='input-column grid h-full grid-cols-1 place-items-start items-center gap-2 bg-white p-[6%]'>
              <p className='uppercase'>
                {currentAddress.firstName} {currentAddress.lastName}
              </p>

              <p className='uppercase'>{currentAddress.email}</p>
              <p className='uppercase'>{currentAddress.address_1}</p>
              <p className='uppercase'>
                {currentAddress.address_2 ? currentAddress.address_2 : '-'}
              </p>
              <p className='uppercase'>{currentAddress.city}</p>
              <p className='uppercase'>{currentAddress.state}</p>
              <p className='uppercase'>{currentAddress.zip}</p>
            </div>
          </div>
          <div className='absolute -bottom-[20%] right-1/2 flex translate-x-[50%] justify-center gap-6 2xl:-bottom-[22%] 2xl:text-xl'>
            {/* disabling edit & new until ready to work on it... */}
            {addresses.length && (
              <>
                {/* <SimpleButton clickHandler={testFunction}>edit</SimpleButton> */}
                <SimpleButton clickHandler={deleteAddress}>delete</SimpleButton>
              </>
            )}
            {/* <SimpleButton clickHandler={testFunction}>new</SimpleButton> */}
          </div>
        </div>
      )}
    </>
  );
}
