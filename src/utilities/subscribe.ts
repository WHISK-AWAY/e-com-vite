import { useMutation } from 'react-query';
import { httpClient } from './convertKitClient';
const VITE_CONVERTKIT_API_KEY = import.meta.env.VITE_CONVERTKIT_API_KEY;

type SubscribeInput = {
  email: string;
};

type SubscribeData = {
  subscription: {
    id: number;
    state: string;
    created_at: string;
    source: string | null;
    referrer: string | null;
    subscribable_id: number;
    subscribable_type: string;
    subscriber: {
      id: number;
    };
  };
};

export const useSubscribe = (formId: string) => {
  return useMutation((input: SubscribeInput) => {
    const inputBody = {
      ...input,
      api_key: VITE_CONVERTKIT_API_KEY,
    };

    return httpClient.post<SubscribeData>(
      `forms/${formId}/subscribe`,
      inputBody
    );
  });
};
