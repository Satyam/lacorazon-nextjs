import { withIronSessionApiRoute } from 'iron-session/next';
import sessionOptions from 'lib/auth';
import { checkValidUser } from 'data/user';
import { API_REQ, API_REPLY, OP, ERR_CODE, FetchError } from 'lib/fetch';

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
    const { op, data } = req.body as API_REQ<LoginFormInfo>;
    const badRequest = (msg: string) => ({
      error: new FetchError(
        ERR_CODE.BAD_REQUEST,
        `${msg} in ${JSON.stringify(req.body)}`,
        req.url
      ),
    });
    switch (op) {
      case OP.GET: {
        if (req.session.user) {
          return res.json({ data: req.session.user });
        } else {
          return res.json({
            error: new FetchError(
              ERR_CODE.UNAUTHORIZED,
              'Unauthorized',
              req.url
            ),
          });
        }
      }
      case OP.CREATE: {
        if (data) {
          const { email, password } = data;

          if (typeof email !== 'string') {
            return res.json(badRequest('missing [email]'));
          }
          if (typeof password !== 'string') {
            return res.json(badRequest('missing [email]'));
          }
          const user = await checkValidUser(email, password);
          if (user) {
            req.session.user = user;
            await req.session.save();
            return res.json({ data: user });
          } else {
            return res.json({
              error: new FetchError(
                ERR_CODE.UNAUTHORIZED,
                'Unauthorized',
                req.url
              ),
            });
          }
        }
      }
      case OP.DELETE:
        req.session.destroy();
        return res.json({});
      default:
        return res.json(badRequest('unknown op'));
    }
  },
  sessionOptions
);
