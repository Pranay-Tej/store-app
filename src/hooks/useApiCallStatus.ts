import { useState } from 'react';

export default function useAPiCallStatus<T>() {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const reset = () => {
    setData(undefined);
    setErrorMessage(undefined);
    setIsLoading(false);
  };
  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    reset
  };
}
