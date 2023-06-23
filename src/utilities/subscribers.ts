import { useQuery } from 'react-query';
import { httpClient } from './convertKitClient';
const VITE_CONVERTKIT_API_SECRET = import.meta.env.VITE_CONVERTKIT_API_SECRET;

type SubscribersData = {
  total_subscribers: number;
  page: number;
  total_pages: number;
  subscribers: Array<{
    id: number;
    first_name: string | null;
    email_address: string;
    state: string;
    created_at: string;
    fields: {
      last_name?: string;
    };
  }>;
};

export const useSubscribers = () => {
  const queryString = [
    `api_secret=${VITE_CONVERTKIT_API_SECRET}`,
  ];

  return useQuery(`subscribers-${queryString}`, async () => {
    const response = await httpClient.get<SubscribersData>(
      `subscribers?${queryString}`
    );

    return response.data;
  });
};
