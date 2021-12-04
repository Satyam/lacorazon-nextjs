import type { IronSessionOptions } from 'iron-session';

import type { User } from 'data/types';

declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}

export const sessionOptions: IronSessionOptions = {
  cookieName: process.env.SESSION_COOKIE as string,
  password: process.env.SESSION_PASSWORD as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default sessionOptions;
