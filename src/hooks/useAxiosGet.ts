import useAPiCallStatus from './useApiCallStatus';
import { AxiosResponse } from 'axios';
import { useAxiosInstance } from '@/context/axios.context';

export default function useAxiosGet<T>() {
  const { axiosInstance, protectedAxiosInstance } = useAxiosInstance();

  const {
    data: data,
    setData: setData,
    isLoading: isLoading,
    setIsLoading: setIsLoading,
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessage,
    reset: reset
  } = useAPiCallStatus<T>();

  const fetchData = async ({
    url,
    isProtected = false
  }: {
    url: string;
    isProtected?: boolean;
  }) => {
    try {
      const requestUrl = url;
      setIsLoading(true);
      let response: AxiosResponse<T> | undefined;
      if (isProtected) {
        response = await protectedAxiosInstance.get<T>(requestUrl);
      } else {
        response = await axiosInstance.get<T>(requestUrl);
      }

      setData(response.data);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, errorMessage, fetchData, reset };
}
