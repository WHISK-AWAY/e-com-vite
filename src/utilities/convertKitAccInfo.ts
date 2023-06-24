import { useQuery, useQueryClient } from 'react-query';
import { httpClient } from './convertKitClient';
const VITE_CONVERTKIT_API_SECRET = import.meta.env.VITE_CONVERTKIT_API_SECRET;


type AccountInfoData = {
  name: string;
  plan_type: string;
  primary_email_address: string;
};

export const useAccountInfo = () => {
  const queryClient = useQueryClient()
  const queryString = [
    `api_secret=${VITE_CONVERTKIT_API_SECRET}`,
  ];

  return useQuery(`accountInfo-${queryString}`, async () => {
    const response = await httpClient.get<AccountInfoData>(
      `account?${queryString}`
    );

    return response.data;
  });
};
