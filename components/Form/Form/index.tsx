import React, { useState } from 'react';
import { Form as BSForm, Alert } from 'react-bootstrap';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  UseFormProps,
  SubmitHandler,
} from 'react-hook-form';
// TODO This is a patch, see: https://github.com/react-hook-form/resolvers/issues/271
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import invariant from 'invariant';
import { AnyObjectSchema } from 'yup';

import classnames from 'classnames';
import styles from '../styles.module.css';

export type OnFormSubmitFunction<V extends Record<string, any>> = (
  data: V,
  formReturn: UseFormReturn<V>
) => Promise<void> | void;

export default function Form<V extends Record<string, any>>({
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
  inline,
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
      return result.catch((err: any) => {
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
        className={classnames(className, styles.formBorder)}
        {...rest}
      >
        {status && <Alert color="danger">{status}</Alert>}
        {children}
      </BSForm>
    </FormProvider>
  );
}
