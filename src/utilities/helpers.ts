const VITE_API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

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
  const { data } = (await axios.post(
    VITE_API_URL + '/api/auth/check-password',
    { password },
    { withCredentials: true }
  )) as { data: { passwordCheck?: boolean; error?: string } };
  if (data.error) throw new Error(data.error);

  const passwordCheck = data.passwordCheck;
  console.log('passwordCheck:', passwordCheck);
  return passwordCheck;
}
