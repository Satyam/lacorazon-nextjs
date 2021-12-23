import React, { DOMAttributes } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import classnames from 'classnames';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import styles from '../styles.module.css';

export const LabeledText: React.FC<
  {
    label: string;
    value?: string;
    pre?: boolean;
    className?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ label, value, pre, className }) => (
  <Form.Group as={Row} className={classnames(styles.formGroup, className)}>
    <Form.Label column xs={12} lg={2}>
      {label}
    </Form.Label>
    <Col xs={12} lg={8}>
      <Form.Control
        readOnly
        plaintext
        className={classnames(styles.labeledField, {
          [styles.labeledPre]: pre,
        })}
        defaultValue={value}
      />
    </Col>
  </Form.Group>
);

export const LabeledCheckbox: React.FC<{
  label: string;
  value?: boolean;
  checked?: boolean;
  className?: string;
}> = ({ label, value, checked, className, ...rest }) => (
  <Form.Group as={Row} className={classnames(styles.formGroup, className)}>
    <Form.Label column xs={12} lg={2}>
      {label}
    </Form.Label>
    <Col xs={12} lg={8}>
      <div className={styles.labeledField} {...rest}>
        {value ?? checked ? <FaRegCheckSquare /> : <FaRegSquare />}
      </div>
    </Col>
  </Form.Group>
);
