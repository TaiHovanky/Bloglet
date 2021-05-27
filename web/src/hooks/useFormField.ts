import { useState, useCallback, ChangeEvent } from 'react';
import { validateEmailField } from '../utils/emailFieldValidation';
import { validateRequiredTextField } from '../utils/textFieldValidation';

export const useFormField = (initialValue: string = '', fieldType: string = 'text') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (fieldType === 'text') {
      setError(!validateRequiredTextField(e.target.value));
    } else if (fieldType === 'email') {
      setError(!validateEmailField(e.target.value));
    }
    setValue(e.target.value);
  }, [fieldType]);
  return { value, onChange, error };
};