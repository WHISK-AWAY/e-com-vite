import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchSingleUser, selectSingleUser } from '../redux/slices/userSlice';
import { useParams } from 'react-router';
import { getUserId } from '../redux/slices/authSlice';

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectSingleUser);
  const { userId } = useParams();
  const authUserId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (!authUserId) dispatch(getUserId());
    else {
      if (userId) dispatch(fetchSingleUser(userId));
    }
  }, [authUserId, userId]);

  if (!user) return <h1>Loading...</h1>;
  return (
    <div>
      <h1>yo {user.user.firstName}</h1>
    </div>
  );
}
