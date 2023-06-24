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
        <div className='flex h-full flex-col items-center justify-between text-sm'>
          <div className='relative mx-auto mt-6 grid h-full w-4/5 grid-cols-[1fr,_2fr] place-content-start gap-y-2'>
            {/* <img src={arrowLeft} alt='left arrow' /> */}
            {addressIdx > 0 && (
              <img
                src={arrow}
                onClick={() => setAddressIdx((prev) => (prev -= 1))}
                className='absolute -left-[15%] top-[50%] w-4 translate-y-[-50%] cursor-pointer'
                alt='left arrow'
              />
            )}
            {addressIdx < addresses.length - 1 && (
              <img
                src={arrow}
                onClick={() => setAddressIdx((prev) => (prev += 1))}
                className='absolute -right-[15%] top-[50%] w-4 translate-y-[-50%] rotate-180 cursor-pointer'
                alt='right arrow'
              />
            )}
            <p className=''>full name</p>
            <p className='uppercase'>
              {currentAddress.firstName} {currentAddress.lastName}
            </p>
            <p className=''>email</p>
            <p className='uppercase'>{currentAddress.email}</p>
            <p className=''>address 1</p>
            <p className='uppercase'>{currentAddress.address_1}</p>
            <p className=''>address 2</p>
            <p className='uppercase'>
              {currentAddress.address_2 ? currentAddress.address_2 : '-'}
            </p>
            <p className=''>city</p>
            <p className='uppercase'>{currentAddress.city}</p>
            <p className=''>state</p>
            <p className='uppercase'>{currentAddress.state}</p>
            <p className=''>zip</p>
            <p className='uppercase'>{currentAddress.zip}</p>
          </div>
          <div className='flex justify-center gap-6'>
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
