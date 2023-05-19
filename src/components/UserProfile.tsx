import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchSingleUser, selectSingleUser } from '../redux/slices/userSlice';
import { useParams } from 'react-router';

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectSingleUser);
  const { userId } = useParams();

  useEffect(() => {
    if (userId) dispatch(fetchSingleUser(userId));
  }, [userId]);

  return (
    <div>
      <h1>yo</h1>
    </div>
  );
}
