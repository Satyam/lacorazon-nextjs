// pages/api/login.ts

import { withIronSessionApiRoute } from 'iron-session/next';

import { checkValidUser } from 'data/user';
import type { IronSessionOptions } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'data/types';

export type LoginFormInfo = {
  nombre: string;
  password: string;
};

export const options: IronSessionOptions = {
  cookieName: process.env.SESSION_COOKIE as string,
  password: process.env.SESSION_PASSWORD as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse<User | undefined>) => {
    const { nombre, password } = JSON.parse(req.body) as LoginFormInfo;
    const user = await checkValidUser(nombre, password);
    // get user from database then:
    if (user) {
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } else {
      res.status(401).end();
    }
  },
  options
);
