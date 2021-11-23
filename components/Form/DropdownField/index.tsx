import React, { useRef } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import invariant from 'invariant';

let counter = 0;

const DropdownField: React.FC<{
  name: string;
  optValue?: string;
  optLabel?: string;
  options: { [index: string]: string | number }[];
  noOption: boolean;
  label?: string;
  id?: string;
  rows?: number;
  help?: string;
}> = ({
  name,
  label,
  id,
  options,
  optValue = 'id',
  optLabel = 'nombre',
  help,
  noOption,
  ...rest
}) => {
  invariant(name, 'DropdownField: name argument is mandatory');
  invariant(options, 'DropdownField: options argument is mandatory');

  const actualId = useRef(id || `F_DDF_${counter}`);
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
        <Form.Select isInvalid={hasError} {...register(name)} {...rest}>
          {noOption && (
            <option key=" " value="">
              {' ----   '}
            </option>
          )}
          {options.map((o) => (
            <option key={o[optValue]} value={o[optValue]}>
              {o[optLabel]}
            </option>
          ))}
        </Form.Select>

        {help && <Form.Text>{help}</Form.Text>}
        <Form.Control.Feedback>{error}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default DropdownField;
