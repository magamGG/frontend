import { useState, useCallback } from 'react';

export const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  const setCustomValue = useCallback((newValue) => {
    setValue(newValue);
  }, []);
  
  return {
    value,
    onChange,
    reset,
    setValue: setCustomValue,
  };
};

export default useInput;
