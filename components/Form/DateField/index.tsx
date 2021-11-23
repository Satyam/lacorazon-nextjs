import React, { useRef } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import invariant from 'invariant';

let counter = 0;

const DateField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  help?: string;
  className?: string;
  min?: string;
  max?: string;
}> = ({ name, label, help, className, id, ...rest }) => {
  invariant(name, 'DateField: name argument is mandatory');

  // const { locale } = useIntl();
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const hasError = name in errors;
  const error = hasError && (errors[name]?.message || errors[name]);

  const actualId = useRef(id || `F_DF_${counter}`);

  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <Form.Group as={Row} controlId={actualId.current}>
      <Form.Label column xs={12} lg={2}>
        {label}
      </Form.Label>
      <Col xs={12} lg={8}>
        <Form.Control type="date" {...register(name)} {...rest} />
        {help && <Form.Text>{help}</Form.Text>}
        <Form.Control.Feedback>{error}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default DateField;
