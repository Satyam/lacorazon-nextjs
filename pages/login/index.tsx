import React, { useState } from 'react';
import * as yup from 'yup';
import { localFetch } from 'lib/fetch';

import { FetchError } from 'lib/fetch';
import {
  Form,
  TextField,
  SubmitButton,
  OnFormSubmitFunction,
} from 'components/Form';
import Layout from 'components/Layout';
import { useModals, Alert } from 'components/Modals';
import type { LoginFormInfo } from 'pages/api/auth/login';
import type { User } from 'data/types';

const loginSchema = yup.object().shape({
  email: yup.string().trim().required().default(''),
  password: yup.string().trim().required().default(''),
});

const API_LOGIN = '/api/auth/login';
/*
 Needs to redirect once logged in.
 Need to handle first time users with no password.
 Need second password field to confirm
 */
export default function Login() {
  const { openLoading, closeLoading } = useModals();
  const [unauthorized, setUnauthorized] = useState(false);

  const onSubmit: OnFormSubmitFunction<LoginFormInfo> = async (values) => {
    console.log({ values });
    openLoading('Verificando usuario');
    const { data: user, error } = await localFetch<User>(API_LOGIN, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
    console.log({ user, error });
    if (error) {
      if (error instanceof FetchError && error.status === 401) {
        setUnauthorized(true);
      } else {
        throw error;
      }
    }
    closeLoading();
  };

  return (
    <Layout title="Login" heading="Login">
      {unauthorized && (
        <Alert
          heading="Usuario Inválido"
          warning
          onClose={() => setUnauthorized(false)}
        >
          El email no existe o la contraseña es incorrecta
        </Alert>
      )}
      <Form<LoginFormInfo> onSubmit={onSubmit} schema={loginSchema}>
        <TextField name="email" label="e-Mail" />
        <TextField type="password" name="password" label="Contraseña" />
        <SubmitButton>Login</SubmitButton>
      </Form>
    </Layout>
  );
}
