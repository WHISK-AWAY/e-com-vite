import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  deleteUser,
  fetchAllUsersAdmin,
  selectAdminUsers,
  sortUsersAdmin,
} from '../../../redux/slices/admin/usersAdminSlice';
import EditUserRole from './EditUserRole';

export type UserSortField =
  | 'lastName'
  | 'firstName'
  | 'role'
  | 'email'
  | 'cartSize'
  | 'reviewCount'
  | 'voteCount';

export type UserSort = {
  sortField: UserSortField;
  sortDir: 'asc' | 'desc';
};

export default function AdminUsers() {
  const [sort, setSort] = useState<UserSort>({
    sortField: 'lastName',
    sortDir: 'asc',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector(selectAdminUsers);

  useEffect(() => {
    dispatch(fetchAllUsersAdmin()).then(() => dispatch(sortUsersAdmin(sort)));
  }, []);

  useEffect(() => {
    dispatch(sortUsersAdmin(sort));
  }, [sort]);

  function handleSort(sortField: UserSortField) {
    if (sortField === sort.sortField) {
      setSort((prev) => {
        return { ...prev, sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc' };
      });
    } else {
      setSort({ sortField, sortDir: 'asc' });
    }
  }

  // TODO: delete button
  // TODO: edit user role

  if (!users.length) return <h1>Loading user info...</h1>;
  return (
    <main>
      <h1>USERS</h1>
      <table>
        <thead>
          <tr>
            <th
              onClick={() => handleSort('lastName')}
              className='cursor-pointer'
            >
              LAST
            </th>
            <th
              onClick={() => handleSort('firstName')}
              className='cursor-pointer'
            >
              FIRST
            </th>
            <th onClick={() => handleSort('role')} className='cursor-pointer'>
              ROLE
            </th>
            <th onClick={() => handleSort('email')} className='cursor-pointer'>
              EMAIL
            </th>
            <th
              onClick={() => handleSort('cartSize')}
              className='cursor-pointer'
            >
              CART SIZE
            </th>
            <th
              onClick={() => handleSort('reviewCount')}
              className='cursor-pointer'
            >
              REVIEW COUNT
            </th>
            <th
              onClick={() => handleSort('voteCount')}
              className='cursor-pointer'
            >
              VOTE COUNT
            </th>
            <th>ORDERS</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>
                <EditUserRole user={user} />
              </td>
              <td>{user.email}</td>
              <td className='text-center'>{user.cart.products.length}</td>
              <td className='text-center'>{user.reviewCount}</td>
              <td className='text-center'>{user.voteCount}</td>
              <td
                onClick={() => navigate('/admin/users/' + user._id + '/orders')}
                className='cursor-pointer text-center'
              >
                (view)
              </td>
              <td
                onClick={() => dispatch(deleteUser({ userId: user._id }))}
                className='cursor-pointer text-center text-red-600'
              >
                X
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
