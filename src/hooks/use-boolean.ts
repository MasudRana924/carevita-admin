import { useState, useCallback } from 'react';

export function useBoolean(defaultValue?: boolean) {
  const [value, setValue] = useState(!!defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const onSetValue = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return {
    value,
    onTrue,
    onFalse,
    onToggle,
    onSetValue,
    setValue,
  };
}
