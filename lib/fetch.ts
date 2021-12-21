import useSWR from 'swr';
import { MyError, FetchError } from 'lib/errors';

export enum OP {
  LIST = 'list',
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type API_REQ<T extends AnyRecordOrArray = AnyRecord> = {
  op: OP;
  id?: ID | null;
  data?: T;
  options?: AnyRecord;
};

export type API_REPLY<T extends AnyRecordOrArray = AnyRecord> = {
  data?: T;
  error?: MyError | Error;
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
  pre?: (d: AnyRecord) => AnyRecord,
  post?: (r: AnyRecord) => AnyRecord
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
      } catch (error) {
        return { error } as { error: Error };
      }
    } else {
      throw new FetchError(res);
    }
  });
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
  post?: (r: AnyRecord) => AnyRecord
) => {
  const { data, error, mutate } = useSWR<API_REPLY<RES_TYPE>, Error>(
    req.id === null ? null : [`/api/${url}`, req]
  );
  return {
    error: data?.error || error,
    data: prePostProcess<RES_TYPE>(data?.data, post),
    mutate,
  };
};
