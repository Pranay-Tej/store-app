import { QueryCache, QueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      showNotification({
        title: 'Error',
        autoClose: false,
        color: 'red',
        message: JSON.stringify(error?.message || {})
      });
    }
  })
});
