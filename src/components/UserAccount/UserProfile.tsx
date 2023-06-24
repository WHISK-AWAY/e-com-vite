import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useParams } from 'react-router';
import { getUserId } from '../../redux/slices/authSlice';
import EditAccountInfo from './EditAccountInfo';
import OrderHistory from './OrderHistory';

import EditPassword from './EditPassword';
import UserAddressBook from './UserAddressBook';

type views = 'account' | 'shipping' | 'order' | 'password';

const viewMap = {
  account: 'account info',
  shipping: 'address book',
  order: 'order history',
  password: 'update password',
};

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<views>('account');
  const { userId } = useParams();
  const authUserId = useAppSelector((state) => state.auth.userId);
  const user = useAppSelector(selectSingleUser);

  useEffect(() => {
    if (!authUserId) dispatch(getUserId());
    else {
      if (userId) dispatch(fetchSingleUser(userId));
    }
  }, [authUserId, userId]);

  if (!user) return <h1>Loading...</h1>;
  return (
    <section className='user-profile-container mx-auto flex min-h-[calc(100dvh_-_64px)] w-11/12 max-w-[1440px] flex-col items-center gap-2 font-marcellus'>
      <h1 className='self-start font-italiana text-[2.5rem] uppercase'>
        hello, {user.user.firstName}
      </h1>
      <div className='user-settings-wrapper flex h-[370px] w-full items-start justify-center gap-6 text-xl'>
        <div className='user-profile-menu-section mt-10 flex shrink-0 grow-0 basis-[32.5%] flex-col items-end gap-6'>
          <button
            className={
              '' + view === 'account' ? ' uppercase underline' : ' lowercase'
            }
            onClick={() => setView('account')}
          >
            account info
          </button>
          <button
            className={
              '' + view === 'password' ? ' uppercase underline' : ' lowercase'
            }
            onClick={() => setView('password')}
          >
            update password
          </button>
          <button
            className={
              '' + view === 'shipping' ? ' uppercase underline' : ' lowercase'
            }
            onClick={() => setView('shipping')}
          >
            address book
          </button>
          <button
            className={
              '' + view === 'order' ? ' uppercase underline' : ' lowercase'
            }
            onClick={() => setView('order')}
          >
            order history
          </button>
        </div>
        <div className='flex h-full w-full flex-col'>
          <div className='mx-auto w-11/12'>
            <h2 className='border border-b-0 border-charcoal text-center font-italiana uppercase'>
              {viewMap[view]}
            </h2>
          </div>
          <div
            className={`user-profile-edit-section relative h-full w-full shrink-0 grow-0 overflow-auto border border-charcoal bg-cover p-7`}
          >
            {view === 'account' && <EditAccountInfo user={user.user} />}
            {view === 'password' && <EditPassword user={user.user} />}
            {view === 'shipping' && <UserAddressBook user={user.user} />}
            {view === 'order' && <OrderHistory />}
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /* 
image background
<div className='absolute left-0 top-0 -z-10 h-full w-full bg-[url("/src/assets/bg-img/ingredient-bg/sliced-citrus.jpg")] bg-cover opacity-20'></div>
*/
}
