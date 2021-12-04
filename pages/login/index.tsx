import React from 'react';
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
  nombre: yup.string().trim().required().default(''),
  password: yup.string().trim().required().default(''),
});

const API_LOGIN = '/api/auth/login';

export default function Login() {
  const { openLoading, closeLoading, alert } = useModals();
  const onSubmit: OnFormSubmitFunction<LoginFormInfo> = async (
    values,
    formReturn
  ) => {
    console.log({ values });
    openLoading('Verificando usuario');
    const { data: user, error } = await localFetch<User>(API_LOGIN, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
    console.log({ user, error });
    if (error) {
      if (error instanceof FetchError && error.status === 401) {
        alert(
          'Usuario Inválido',
          'El nombre de usuario o contraseña es incorrecto',
          true,
          undefined
        );
      } else {
        alert('Error Desconocido', error.message, true);
      }
    }
    closeLoading();
  };

  return (
    <Layout title="Login" heading="Login">
      <Form<LoginFormInfo> onSubmit={onSubmit} schema={loginSchema}>
        <TextField name="nombre" label="Nombre" />
        <TextField type="password" name="password" label="Contraseña" />
        <SubmitButton>Login</SubmitButton>
      </Form>
    </Layout>
  );
}
