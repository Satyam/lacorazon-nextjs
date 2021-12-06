import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useMemo,
} from 'react';

import type { User } from 'data/types';
import { localFetch } from 'lib/fetch';
import type { LoginFormInfo } from 'pages/api/auth/login';
export type { LoginFormInfo } from 'pages/api/auth/login';

const API_AUTH = '/api/auth';

type AuthType = {
  authorized: boolean;
  user?: User;
  login: (values: LoginFormInfo) => Promise<{ user?: User; error?: Error }>;
  logout: () => Promise<void>;
};

const notImplemented = () => {
  throw new Error('Auth Context not ready yet');
};

const initialValue = {
  authorized: false,
  login: notImplemented,
  logout: notImplemented,
};

export const AuthContext = createContext<AuthType>(initialValue);

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [authorized, setAuthorised] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  const login = useCallback(
    (values: LoginFormInfo) =>
      localFetch<User>(`${API_AUTH}/login`, {
        method: 'PUT',
        body: JSON.stringify(values),
      }).then(({ data, error }) => {
        setUser(data);
        setAuthorised(!error);
        return { user: data, error };
      }),
    [setAuthorised, setUser]
  );

  const logout = useCallback(
    () =>
      localFetch(`${API_AUTH}/logout`).then(() => {
        setAuthorised(false), setUser(undefined);
      }),
    [setAuthorised]
  );

  const ctx = useMemo(
    () => ({ authorized, user, login, logout }),
    [authorized, user, login, logout]
  );

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
