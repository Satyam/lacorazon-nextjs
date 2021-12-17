import { withIronSessionApiRoute } from 'iron-session/next';
import sessionOptions from 'lib/auth';
import { checkValidUser } from 'data/user';
import { API_REQ, API_REPLY, OP, ERR_CODE } from 'lib/fetch';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'data/types';

export type LoginFormInfo = {
  email: string;
  password: string;
};

export default withIronSessionApiRoute(
  async (
    req: NextApiRequest,
    res: NextApiResponse<API_REPLY<Partial<User>>>
  ) => {
    const { op, id, data } = req.body as API_REQ<LoginFormInfo>;
    switch (op) {
      case OP.GET: {
        if (req.session.user) {
          return res.json({ data: req.session.user });
        } else {
          return res.json({ error: ERR_CODE.UNAUTHORIZED });
        }
      }
      case OP.CREATE: {
        if (data) {
          const { email, password } = data;

          if (typeof email === 'string' && typeof password === 'string') {
            const user = await checkValidUser(email, password);
            if (user) {
              req.session.user = user;
              await req.session.save();
              return res.json({ data: user });
            } else {
              return res.json({ error: ERR_CODE.UNAUTHORIZED });
            }
          }
        }
        return res.json({ error: ERR_CODE.BAD_REQUEST });
      }
      case OP.DELETE:
        req.session.destroy();
        return res.json({});
      default:
        return res.json({ error: ERR_CODE.BAD_REQUEST });
    }
  },
  sessionOptions
);
