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
  onSubmit: (values: V, formMethods: UseFormReturn<V>) => Promise<void> | void;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const methods = useForm<V>({
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
    const result = onSubmit(values as V, methods);
    if (result instanceof Promise) {
      return result.catch((err: any) => {
        console.error(err);
        setStatus(err.toString());
      });
    }
    return;
  };
  return (
    <FormProvider {...methods}>
      <BSForm
        noValidate
        onSubmit={methods.handleSubmit(mySubmit)}
        onReset={() => methods.reset()}
        className={className}
        {...rest}
      >
        {status && <Alert color="danger">{status}</Alert>}
        {children}
      </BSForm>
    </FormProvider>
  );
}
