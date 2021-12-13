import useSWR, { Middleware } from 'swr';

export enum ERR_CODE {
  NOT_FOUND = 404,
  DUPLICATE = 409,
  UNAUTHORIZED = 401,
  UNKNOWN = 500,
}

export class FetchError extends Error {
  status: ERR_CODE | number;
  url: string;
  constructor(res: Response) {
    super(res.statusText);
    this.name = 'FetchError';
    this.status = res.status;
    this.url = res.url;
  }
  toString() {
    return `FetchError: ${this.message} Status: ${this.status} on fetch from  ${this.url}`;
  }
}

export enum OP {
  LIST = 'list',
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type FetchOpReply<T> = {
  data?: T;
  error?: FetchError;
};

type AnyRecord = Record<string, any>;
type AnyRecordOrArray = AnyRecord | AnyRecord[];

export type API_REQ<T extends AnyRecordOrArray = AnyRecord> = {
  op: OP;
  id?: ID;
  data?: T;
  options?: AnyRecord;
};

export type API_REPLY<T extends AnyRecordOrArray = AnyRecord> = {
  data?: T;
  error?: ERR_CODE;
};

function prePostProcess<OUT extends AnyRecord = AnyRecord>(
  data?: AnyRecord,
  fn?: (data: AnyRecord) => AnyRecord
): OUT | undefined;
function prePostProcess<OUT extends AnyRecord = AnyRecord>(
  data?: AnyRecord[],
  fn?: (data: AnyRecord) => AnyRecord
): OUT[] | undefined;
function prePostProcess<OUT extends AnyRecord = AnyRecord>(
  data?: AnyRecordOrArray,
  fn?: (data: AnyRecord) => AnyRecord
): OUT | OUT[] | undefined {
  if (fn) {
    if (data) {
      if (Array.isArray(data)) {
        return data.map(fn) as OUT[];
      }
      return fn(data) as OUT;
    }
    return data;
  } else return data as OUT;
}

export const apiService = async <
  REQ_TYPE extends AnyRecordOrArray = AnyRecord,
  RES_TYPE extends AnyRecordOrArray = REQ_TYPE
>(
  url: string,
  req: API_REQ<REQ_TYPE>,
  pre?: (d: AnyRecordOrArray) => AnyRecordOrArray,
  post?: (r: AnyRecordOrArray) => RES_TYPE
): Promise<API_REPLY<RES_TYPE>> => {
  return fetch(`${window.origin}/api/${url}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ ...req, data: prePostProcess(req.data, pre) }),
  }).then(async (res): Promise<API_REPLY<RES_TYPE>> => {
    if (res.ok) {
      try {
        const { error, data } = await res.json();
        console.log('after json', { error, data });
        return {
          error,
          data: prePostProcess<RES_TYPE>(data, post),
        };
      } catch (_) {
        return {};
      }
    } else {
      throw new FetchError(res);
    }
  });
};

const transformMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);

    if (swr.error || !swr.data) return swr;

    // @ts-ignore
    const ventas = swr.data.map<VentaVendedor>((venta) => ({
      ...venta,
      fecha: new Date(venta.fecha),
    }));

    // After hook runs...
    return { ...swr, data: ventas };
  };
};

export const apiFetcher = (url: string, req: API_REQ) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(req),
  }).then((res) => {
    if (res.ok) {
      try {
        return res.json();
      } catch (_) {
        return {};
      }
    } else {
      throw new FetchError(res);
    }
  });
};

export const useApiService = <
  RES_TYPE extends AnyRecordOrArray = AnyRecordOrArray
>(
  url: string,
  req: API_REQ,
  post?: (r: AnyRecordOrArray) => RES_TYPE
) => {
  const { data, error } = useSWR<API_REPLY<RES_TYPE>, ERR_CODE>(
    [`/api/${url}`, req],
    apiFetcher
  );
  return {
    error,
    data: prePostProcess<RES_TYPE>(data, post),
  };
};

export const swrFetcher = (url: string, config?: RequestInit) => {
  return fetch(url, config).then((res) => {
    if (res.ok) {
      try {
        return res.json();
      } catch (_) {
        return {};
      }
    } else {
      throw new FetchError(res);
    }
  });
};

export const localFetch = async <T extends Record<string, any>>(
  url: string,
  config?: RequestInit
): Promise<FetchOpReply<T>> => {
  return fetch(`${window.origin}${url}`, config).then(
    async (res): Promise<FetchOpReply<T>> => {
      if (res.ok) {
        try {
          return { data: await res.json() };
        } catch (_) {
          return {};
        }
      } else {
        return { error: new FetchError(res) };
      }
    }
  );
};
