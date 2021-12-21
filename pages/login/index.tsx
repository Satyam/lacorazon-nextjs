import React, { useState } from 'react';
import * as yup from 'yup';
import { ERR_CODE, FetchError } from 'lib/errors';
import { useRouter } from 'next/router';
import {
  Form,
  TextField,
  SubmitButton,
  OnFormSubmitFunction,
} from 'components/Form';
import Layout from 'components/Layout';
import { useModals, Alert } from 'components/Modals';
import { LoginFormInfo, useAuth } from 'components/AuthProvider';

const loginSchema = yup.object().shape({
  email: yup.string().trim().required().default(''),
  password: yup.string().trim().required().default(''),
});

/*
 Needs to redirect once logged in.
 Need to handle first time users with no password.
 Need second password field to confirm
 */
export default function Login() {
  const { openLoading, closeLoading } = useModals();
  const { login } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);
  const router = useRouter();

  const onSubmit: OnFormSubmitFunction<LoginFormInfo> = async (values) => {
    openLoading('Verificando usuario');
    const { error } = await login(values);
    if (error instanceof FetchError) {
      if (error.code === ERR_CODE.UNAUTHORIZED) {
        setUnauthorized(true);
      } else {
        throw error;
      }
    } else {
      const ret = router.query.return;
      if (typeof ret === 'string') {
        router.replace(ret);
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
