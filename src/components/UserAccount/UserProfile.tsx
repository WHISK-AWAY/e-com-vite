import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleUser,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useParams } from 'react-router';
import { getUserId } from '../../redux/slices/authSlice';

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<string>('');
  const user = useAppSelector(selectSingleUser);
  const { userId } = useParams();
  const authUserId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (!authUserId) dispatch(getUserId());
    else {
      if (userId) dispatch(fetchSingleUser(userId));
    }
  }, [authUserId, userId]);

  const handleClick = () => {};

  if (!user) return <h1>Loading...</h1>;
  return (
    <section className='user-profile-container'>
      <h1>HELLO {user.user.firstName}</h1>
      <div className='user-profile-edit-section'>
        <h2>ACCOUNT INFO</h2>
        <h2>SHIPPING INFO</h2>
        <h2>ORDER HISTORY</h2>
      </div>
    </section>
  );
}
