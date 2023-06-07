import { useAppDispatch } from '../../../redux/hooks';
import { updateUserRole } from '../../../redux/slices/admin/usersAdminSlice';
import { TUser } from '../../../redux/slices/userSlice';

export type EditUserRoleProps = {
  user: TUser;
};

export type UserRole = 'admin' | 'guest' | 'user';

const roles: UserRole[] = ['admin', 'guest', 'user'];

export default function EditUserRole({ user }: EditUserRoleProps) {
  const dispatch = useAppDispatch();
  function handleRoleUpdate(role: UserRole) {
    dispatch(updateUserRole({ role, userId: user._id }));
  }

  return (
    <select
      defaultValue={user.role}
      onChange={(e) => handleRoleUpdate(e.target.value as UserRole)}
    >
      {roles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}
