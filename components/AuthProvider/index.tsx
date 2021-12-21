import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import type { User } from 'data/types';
import { apiService, OP } from 'lib/fetch';
import type { LoginFormInfo } from 'pages/api/auth';
export type { LoginFormInfo } from 'pages/api/auth';

const API_AUTH = 'auth';

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

  useEffect(() => {
    apiService<User>(API_AUTH, {
      op: OP.GET,
    }).then(({ data, error }) => {
      setUser(data);
      setAuthorised(!error);
    });
  }, []);

  const login = useCallback(
    (values: LoginFormInfo) =>
      apiService<LoginFormInfo, User>(API_AUTH, {
        op: OP.CREATE,
        data: values,
      }).then(({ data, error }) => {
        setUser(data);
        setAuthorised(!error);
        return { user: data, error };
      }),
    [setAuthorised, setUser]
  );

  const logout = useCallback(
    () =>
      apiService(API_AUTH, { op: OP.DELETE, id: user?.id }).then(() => {
        setAuthorised(false);
        setUser(undefined);
      }),
    [user]
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
