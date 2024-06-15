import { NHOST_BASE_URL } from '@/constants/app.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(NHOST_BASE_URL);

export const createProtectedGraphQlClient = () => {
  return new GraphQLClient(NHOST_BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        LOCAL_STORAGE_KEYS.API_TOKEN
      )}`
    }
  });
};
