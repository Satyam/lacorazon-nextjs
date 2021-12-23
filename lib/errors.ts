// These are HTTP status codes
export enum ERR_CODE {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  UNKNOWN = 500,
}

export class MyError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export class FetchError extends MyError {
  url?: string;
  constructor(res: Response);
  constructor(message: string, code: number, url?: string);
  constructor(resM: Response | string, code?: number, url?: string) {
    if (typeof code === 'number' && typeof resM === 'string') {
      super(resM, code);
      this.url = url;
    } else if (resM instanceof Response) {
      super(resM.statusText, resM.status);
      this.url = resM.url;
    } else {
      super(resM, ERR_CODE.UNKNOWN);
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
    this.name = 'FetchError';
  }
  toString() {
    return `FetchError: ${this.message} Status: ${this.code} on fetch from  ${this.url}`;
  }
}

type SQLiteErr = {
  errno: number;
  code: string;
  toString: () => string;
};

// const SQLITE_EMPTY = 16; // Declared but not used by SQLite,
export const SQLITE_ERROR = 1; // Generic
export const SQLITE_NOTFOUND = 12;
export const SQLITE_CONSTRAINT = 19;

const rxUnique = /UNIQUE\s*constraint\s*failed:\s*([a-zA-Z]\w*)\.([a-zA-Z]\w*)/;

export class SqlError extends Error {
  code: number;
  table: string | undefined;
  column: string | undefined;
  constructor(err: SQLiteErr, table = '') {
    super(err.toString());

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SqlError);
    }
    this.name = 'SqlError';
    this.code = err.errno;
    this.table = table;
    if (this.code === SQLITE_CONSTRAINT) {
      const m = rxUnique.exec(err.toString());
      if (m) {
        this.table = m[1];
        this.column = m[2];
        return;
      }
    }
  }
}

export const isApiError = (
  error:
    | Error
    | {
        name: 'FetchError' | 'SqlError' | 'MyError';
        code: number;
      },
  name: string,
  code: number
) => {
  if (error instanceof Error) return false;
  return error.name === name && error.code === code;
};
