import React from 'react';
import { Button } from 'react-bootstrap';
import { MyButtonProps } from 'components/Icons';
import { useFormContext } from 'react-hook-form';

const SubmitButton: React.FC<
  MyButtonProps & {
    component?: React.ComponentType<MyButtonProps>;
  }
> = ({ component: Component = Button, ...rest }) => {
  const {
    formState: { isSubmitting, isDirty, errors },
  } = useFormContext();

  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isDirty || !!Object.keys(errors).length}
      {...rest}
    />
  );
};

export default SubmitButton;
