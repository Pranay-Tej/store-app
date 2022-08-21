import { NHOST_BASE_URL } from '@/constants/app.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';

type AuthHeaderProps = {
  authorization: string;
};

export const fetchData = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers']
): (() => Promise<TData>) => {
  return async () => {
    const authHeaders = {} as AuthHeaderProps;
    if (localStorage.getItem(LOCAL_STORAGE_KEYS.API_TOKEN)) {
      authHeaders['authorization'] = `Bearer ${localStorage.getItem(
        LOCAL_STORAGE_KEYS.API_TOKEN
      )}`;
    }
    const res = await fetch(NHOST_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options ?? {})
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || 'Error..';
      throw new Error(message);
    }

    return json.data;
  };
};
