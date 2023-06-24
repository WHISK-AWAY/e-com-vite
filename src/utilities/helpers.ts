const VITE_API_URL = import.meta.env.VITE_API_URL;
import axios, { AxiosError } from 'axios';
import { TShippingAddress, TUser } from '../redux/slices/userSlice';

export async function emailExists(email: string): Promise<boolean> {
  try {
    const { data }: { data: { message: boolean } } = await axios.post(
      VITE_API_URL + '/api/auth/check-email',
      {
        email,
      },
      { withCredentials: true }
    );

    return data.message;
  } catch (err) {
    console.error('email fetcher error:', err);
    return false;
  }
}

export async function checkPassword(password: string) {
  // react hook form calls this "onBlur", but also calls it the moment the user starts typing (for some reason) - expect a 400 at the beginning
  try {
    const { data } = (await axios.post(
      VITE_API_URL + '/api/auth/check-password',
      { password },
      { withCredentials: true }
    )) as { data: { passwordCheck?: boolean; error?: string } };
    // if (data.error) throw new Error(data.error);
    if (data.error) {
      console.log('passwordcheck error:', data.error);
      return false;
    }

    const passwordCheck = data.passwordCheck;
    console.log('passwordCheck:', passwordCheck);
    return passwordCheck;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log({
        status: err.response?.status,
        message: err.response?.data.error,
      });
      // return {
      //   status: err.response?.status,
      //   message: err.response?.data.error,
      // };
      return false;
    } else {
      console.log('some other kinda err:', err);
      return false;
    }
  }
}

export function saveButtonShouldDisable(
  dirtyFields: Partial<
    Readonly<{
      firstName?: boolean | undefined;
      lastName?: boolean | undefined;
      email?: boolean | undefined;
      oldPassword?: boolean | undefined;
      newPassword?: boolean | undefined;
      confirmPassword?: boolean | undefined;
    }>
  >
): boolean {
  const dirtyFieldNames = Object.keys(dirtyFields);
  const passwordFields = ['oldPassword', 'newPassword', 'confirmPassword'];

  if (dirtyFieldNames.length > 0) {
    // there's at least 1 dirty field...
    // if one of them is password related, we must have all 3
    if (dirtyFieldNames.some((field) => passwordFields.includes(field))) {
      return !passwordFields.every((field) => dirtyFieldNames.includes(field));
    } else {
      return false;
    }
  } else {
    return true;
  }
}

export function orderAddressArray(user: TUser) {
  // Given a user object, move the default shipping address to the beginning _
  // of the array of addresses.
  let addressList: TShippingAddress[] = user.shippingAddresses;
  if (addressList.length === 0) return;
  let defaultAddress = user.shippingAddresses.find(
    (address) => address.isDefault === true
  );
  if (defaultAddress)
    addressList = [
      defaultAddress,
      ...user.shippingAddresses.filter(
        (address) => address._id !== defaultAddress?._id
      ),
    ];
  return addressList;
}
