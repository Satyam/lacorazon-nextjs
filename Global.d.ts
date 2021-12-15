declare module '*.module.css';
declare module '*.jpg';
declare module '*.gif';

type BootstrapColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'dark'
  | 'light';
type BootstrapSize = 'sm' | 'md' | 'lg';

type ID = string | number;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

type RecordWithId = { id: ID; [key: string]: unknown };

type RecordWithoutId = { [key: string]: unknown };

type AnyRecord = Record<string, any>;
type AnyRecordOrArray = AnyRecord | AnyRecord[];
