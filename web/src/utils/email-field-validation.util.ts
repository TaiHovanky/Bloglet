import { validateRequiredTextField } from './text-field-validation.util';

export const validateEmailField = (value: string): boolean => {
  let isEmailValid: boolean = validateRequiredTextField(value);
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!value.match(mailformat)) {
    isEmailValid = false;
  }
  return isEmailValid;
}