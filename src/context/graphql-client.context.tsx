import { NHOST_BASE_URL } from '@/constants/app.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import { GraphQLClient } from 'graphql-request';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './auth.context';

const client = new GraphQLClient(NHOST_BASE_URL);

const GraphqlClientContext = createContext({
  graphQlClient: client,
  protectedGraphQlClient: client
});

export const GraphqlClientProvider: React.FC<React.ReactNode> = ({
  children
}) => {
  const { isAuthenticated } = useAuthContext();

  const graphQlClient = new GraphQLClient(NHOST_BASE_URL);
  const protectedGraphQlClient = new GraphQLClient(NHOST_BASE_URL);

  useEffect(() => {
    if (isAuthenticated) {
      protectedGraphQlClient.setHeaders({
        Authorization: `Bearer ${localStorage.getItem(
          LOCAL_STORAGE_KEYS.API_TOKEN
        )}`
      });
    }
  }, [isAuthenticated]);

  return (
    <GraphqlClientContext.Provider
      value={{
        graphQlClient,
        protectedGraphQlClient
      }}
    >
      {children}
    </GraphqlClientContext.Provider>
  );
};

export const useGraphqlClient = () => {
  const context = useContext(GraphqlClientContext);
  if (!context) {
    throw new Error(
      'useGraphqlClient must be used within a GraphqlClientProvider'
    );
  }
  return context;
};
