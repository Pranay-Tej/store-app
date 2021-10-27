import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

export default function useAxios(
  url: string,
  options?: AxiosRequestConfig<any>
) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useEffect(() => execute(), []);

  const execute = () => {
    setIsLoading(true);

    axios(url, options)
      .then((response: any) => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { data, isLoading, errorMessage, execute };
}
