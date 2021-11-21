import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useMemo,
} from 'react';

import { Loading, ConfirmDelete, Alert } from '.';

type ModalsType = {
  openLoading: (message: string) => void;
  closeLoading: () => void;
  confirmDelete: (descr: string, fn: () => void) => void;
  alert: (
    heading?: string,
    descr?: string,
    warning?: boolean,
    fn?: () => void
  ) => void;
};

const notImplemented = () => {
  throw new Error('Popup Context not ready yet');
};

const initialValue = {
  openLoading: notImplemented,
  closeLoading: notImplemented,
  confirmDelete: notImplemented,
  alert: notImplemented,
};

export const ModalsContext = createContext<ModalsType>(initialValue);

export const ModalsProvider: React.FC<{}> = ({ children }) => {
  // Loading:
  const [t, setLoading] = useState<string | undefined>(undefined);

  const openLoading = useCallback(
    (message: string) => setLoading(message),
    [setLoading]
  );

  const closeLoading = useCallback(() => setLoading(undefined), [setLoading]);

  // Confirm Delete
  const [delParams, setDelParams] = useState<{
    descr?: string;
    fn?: () => void;
  }>({});

  const confirmDelete = useCallback(
    (descr: string, fn: () => void): void => setDelParams({ descr, fn }),
    [setDelParams]
  );

  const onCloseConfirmDelete = useCallback(
    (result: boolean) => {
      setDelParams({});
      if (result && delParams.fn) delParams.fn();
    },
    [setDelParams, delParams]
  );

  // Alert

  const [alertParams, setAlertParams] = useState<{
    heading?: string;
    descr?: string;
    warning?: boolean;
    fn?: () => void;
  }>({});

  const alert = useCallback(
    (
      heading?: string,
      descr?: string,
      warning?: boolean,
      fn?: () => void
    ): void => setAlertParams({ heading, descr, warning, fn }),
    [setAlertParams]
  );

  const onCloseAlert = useCallback(() => {
    setAlertParams({});
    if (alertParams.fn) alertParams.fn();
  }, [setAlertParams, alertParams]);

  const ctx = useMemo(
    () => ({ openLoading, closeLoading, confirmDelete, alert }),
    [openLoading, closeLoading, confirmDelete, alert]
  );

  return (
    <ModalsContext.Provider value={ctx}>
      <Loading isOpen={!!t}>{t}</Loading>
      <ConfirmDelete descr={delParams.descr} onClose={onCloseConfirmDelete} />
      <Alert {...alertParams} onClose={onCloseAlert} />
      {children}
    </ModalsContext.Provider>
  );
};

export function useModals() {
  return useContext(ModalsContext);
}
