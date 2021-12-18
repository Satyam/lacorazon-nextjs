import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col } from 'react-bootstrap';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';
import invariant from 'invariant';

import styles from '../styles.module.css';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
const TextField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  rows?: number;
  help?: string;
  type?: string;
  className?: string;
}> = ({ name, type = 'input', label, id, rows, help, className, ...rest }) => {
  invariant(name, 'TextField: name argument is mandatory');

  const actualId = useRef<string>(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const hasError = name in errors;
  const error = hasError && (errors[name]?.message || errors[name]);

  return (
    <Form.Group
      as={Row}
      controlId={actualId.current}
      className={classnames(styles.formGroup, className)}
    >
      <Form.Label column xs={12} lg={2}>
        {label}
      </Form.Label>
      <Col xs={12} lg={8}>
        <Form.Control
          as={rows ? 'textarea' : 'input'}
          type={type}
          isInvalid={hasError}
          className={styles.formControl}
          {...register(name, {
            onChange: () => {
              if (hasError) setTimeout(() => clearErrors(name), 1000);
            },
          })}
          {...rest}
        />
        {help && <Form.Text>{help}</Form.Text>}
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

TextField.propTypes = {
  /**
   * Name of the field this component is to show or edit.
   * It should match the key of one of the values in the
   * enclosing [`Form`](#form) `values` property.
   */
  name: PropTypes.string.isRequired,
  /**
   * The label to be shown to the user along the input box
   */
  label: PropTypes.string,
  /**
   * An optional `id` attribute.
   * If none is provided, the component will generate a unique one
   * so the `<label for="inputId">` element can match it
   */
  id: PropTypes.string,
  /**
   * If provided, a `<textarea>` will be produced with as many rows
   * as given, instead of a regular `<input>`box
   */
  rows: PropTypes.number,
  /**
   * An optional help text to be shown below the input field
   */
  help: PropTypes.string,
  /**
   * Any other properties will be passed on to the `<input>` or `<textarea>` elements
   */
  // '...rest': PropTypes.object,
};

export default TextField;
