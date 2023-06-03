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

type views = 'account' | 'shipping' | 'order';

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

  if (!user) return <h1>Loading...</h1>;
  return (
    <section className='user-profile-container flex'>
      <h1>HELLO {user.user.firstName}</h1>
      <div className='user-profile-menu-section flex flex-col'>
        <button onClick={() => setView('account')}>ACCOUNT INFO</button>
        <button onClick={() => setView('shipping')}>SHIPPING INFO</button>
        <button onClick={() => setView('order')}>ORDER HISTORY</button>
      </div>
      <div className='user-profile-edit-section h-full w-full border border-red-600'>
        {view === 'account' && <EditAccountInfo user={user.user} />}
        {view === 'shipping' && <EditShippingInfo user={user.user} />}
        {view === 'order' && <OrderHistory />}
      </div>
    </section>
  );
}
