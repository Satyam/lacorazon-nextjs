import React, { useState } from 'react';
import { Form as BSForm, Alert } from 'react-bootstrap';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  UseFormProps,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import invariant from 'invariant';
import { AnyObjectSchema } from 'yup';

import classnames from 'classnames';
import styles from '../styles.module.css';

export type OnFormSubmitFunction<V extends Record<string, unknown>> = (
  data: V,
  formReturn: UseFormReturn<V>
) => Promise<void> | void;

export function ReadOnlyForm({
  className,
  children,
  ...rest
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <BSForm className={classnames(styles.formBorder, className)} {...rest}>
      {children}
    </BSForm>
  );
}
export function Form<V extends Record<string, unknown>>({
  mode,
  reValidateMode,
  defaultValues,
  schema,
  resolver,
  context,
  criteriaMode,
  shouldFocusError,
  onSubmit,
  children,
  className,
  ...rest
}: UseFormProps<V> & {
  schema?: AnyObjectSchema;
  onSubmit: OnFormSubmitFunction<V>;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const formReturn = useForm<V>({
    defaultValues: schema
      ? Object.assign(schema.getDefault(), defaultValues)
      : defaultValues,
    resolver: schema ? yupResolver(schema) : resolver,
    mode,
    reValidateMode,
    context,
    criteriaMode,
    shouldFocusError,
  });
  invariant(
    typeof onSubmit === 'function',
    'Form should have an onSubmit function'
  );
  const [status, setStatus] = useState<string | undefined>();

  const mySubmit: SubmitHandler<V> = (values) => {
    const result = onSubmit(values as V, formReturn);
    if (result instanceof Promise) {
      return result.catch((err: Error) => {
        console.error(err);
        setStatus(err.toString());
      });
    }
    return;
  };
  return (
    <FormProvider {...formReturn}>
      <BSForm
        noValidate
        onSubmit={formReturn.handleSubmit(mySubmit)}
        onReset={() => formReturn.reset()}
        className={classnames(styles.formBorder, className)}
        {...rest}
      >
        {status && <Alert color="danger">{status}</Alert>}
        {children}
      </BSForm>
    </FormProvider>
  );
}
