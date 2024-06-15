import { useState } from 'react';

function useToggle(initialValue: boolean = true) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(!value);

  return { value, toggle };
}

export default useToggle;
