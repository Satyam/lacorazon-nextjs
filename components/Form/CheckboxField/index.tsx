import React, { useRef } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import invariant from 'invariant';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
const CheckboxField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  help?: string;
}> = ({ name, label, id, help, ...rest }) => {
  invariant(name, 'CheckboxField: name argument is mandatory');

  const actualId = useRef(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = name in errors;
  const error = hasError && (errors[name]?.message || errors[name]);

  return (
    <Form.Group as={Row} controlId={actualId.current}>
      <Form.Label column xs={12} lg={2}>
        {label}
      </Form.Label>
      <Col xs={12} lg={8}>
        <Form.Check
          type="checkbox"
          isInvalid={hasError}
          style={{ marginLeft: '0' }}
          {...register(name)}
          {...rest}
        />
        {help && <Form.Text>{help}</Form.Text>}
        <Form.Control.Feedback>{error}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default CheckboxField;
