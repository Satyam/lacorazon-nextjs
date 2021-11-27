import React, { DOMAttributes } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import classNames from 'classnames/bind';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import styles from '../styles.module.css';

const cx = classNames.bind(styles);

export const LabeledText: React.FC<
  {
    label: string;
    value: any;
    pre?: boolean;
    className?: string;
  } & DOMAttributes<HTMLDivElement>
> = ({ label, value, children, pre, className, ...rest }) => (
  <Form.Group as={Row} className={styles.formGroup}>
    <Form.Label column xs={12} lg={2}>
      {label}
    </Form.Label>
    <Col xs={12} lg={8}>
      <div
        className={cx(
          'form-control',
          'readonly',
          { 'labeled-pre': pre },
          className
        )}
        {...rest}
      >
        {value}
        {children}
      </div>
    </Col>
  </Form.Group>
);

export const LabeledCheckbox: React.FC<{
  label: string;
  value?: any;
  checked?: boolean;
  className?: string;
}> = ({ label, value, checked, className, ...rest }) => (
  <Form.Group as={Row} className={styles.formGroup}>
    <Form.Label column xs={12} lg={2}>
      {label}
    </Form.Label>
    <Col xs={12} lg={8}>
      <div
        className={classNames('form-control', 'readonly', className)}
        {...rest}
      >
        {value || checked ? <FaRegCheckSquare /> : <FaRegSquare />}
      </div>
    </Col>
  </Form.Group>
);
