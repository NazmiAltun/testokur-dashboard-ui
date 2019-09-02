import React from 'react';
import { TextValidator } from 'react-material-ui-form-validator';

interface Props {
  errorMessages?: any[] | string;
  validators?: any[];
  label: string;
  value: any;
  name: string;
  onChange?(e: React.FormEvent<{}>, newValue: string): void;
}

export const passwordField = (props: Props) => {
  return (
    <TextValidator
      variant="outlined"
      margin="normal"
      label={props.label}
      type="password"
      autoComplete={props.name}
      fullWidth
      onChange={props.onChange}
      name={props.name}
      value={props.value}
      required
      validators={props.validators}
      errorMessages={props.errorMessages}
    />
  );
};
