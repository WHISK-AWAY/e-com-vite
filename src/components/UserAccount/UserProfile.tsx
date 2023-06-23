import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useParams } from 'react-router';
import { getUserId } from '../../redux/slices/authSlice';
import EditAccountInfo from './EditAccountInfo';
import EditShippingInfo from './EditShippingInfo';
import OrderHistory from './OrderHistory';

import citrusSlice from '../../assets/bg-img/ingredient-bg/sliced-citrus.jpg';

type views = 'account' | 'shipping' | 'order' | 'password';

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

  // TODO: prop types for Shipping Info & Order History

  // TODO: change password form

  if (!user) return <h1>Loading...</h1>;
  return (
    <section className='user-profile-container mx-auto flex h-full w-11/12 max-w-[1440px] flex-col items-center gap-2 font-marcellus'>
      <h1 className='self-start font-italiana text-[2.5rem] uppercase'>
        hello, {user.user.firstName}
      </h1>
      <div className='user-settings-wrapper flex h-[370px] w-full items-start gap-6'>
        <div className='user-profile-menu-section basis-3/8 mt-10 flex grow-0 flex-col items-end gap-6 text-2xl'>
          <button
            className={'' + view === 'account' ? ' uppercase underline' : ''}
            onClick={() => setView('account')}
          >
            account info
          </button>
          <button
            className={'' + view === 'password' ? ' uppercase underline' : ''}
            onClick={() => setView('password')}
          >
            change password
          </button>
          <button
            className={'' + view === 'shipping' ? ' uppercase underline' : ''}
            onClick={() => setView('shipping')}
          >
            address book
          </button>
          <button
            className={'' + view === 'order' ? ' uppercase underline' : ''}
            onClick={() => setView('order')}
          >
            order history
          </button>
        </div>
        <div
          className={`user-profile-edit-section basis-5/8 relative h-full grow border border-charcoal bg-cover p-7`}
        >
          <div className='absolute left-0 top-0 -z-10 h-full w-full bg-[url("/src/assets/bg-img/ingredient-bg/sliced-citrus.jpg")] bg-cover opacity-20'></div>
          {view === 'account' && <EditAccountInfo user={user.user} />}
          {/* {view === 'password' && <EditPassword user={user.user} />} */}
          {view === 'shipping' && <EditShippingInfo user={user.user} />}
          {view === 'order' && <OrderHistory />}
        </div>
      </div>
    </section>
  );
}
