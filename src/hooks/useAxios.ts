import axios, { AxiosRequestConfig } from 'axios';
import { useState } from 'react';

export default function useAxios() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  // useEffect(() => execute(), []);

  const execute = (options: {
    url: string;
    axiosConfig?: AxiosRequestConfig<any>;
    successCallback?: CallableFunction;
  }) => {
    const {
      url,
      axiosConfig = undefined,
      successCallback = undefined
    } = options;
    setIsLoading(true);

    axios(url, axiosConfig)
      .then((response: any) => {
        setData(response.data);
        if (successCallback) {
          successCallback(response.data);
        }
      })
      .catch(error => {
        console.error(error);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const reset = () => {
    setData(null);
    setErrorMessage(undefined);
    setIsLoading(false);
  };

  return { data, isLoading, errorMessage, execute, reset };
}
