import { withIronSessionApiRoute } from 'iron-session/next';
import sessionOptions from 'lib/auth';
import { checkValidUser } from 'data/user';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'data/types';

export type LoginFormInfo = {
  email: string;
  password: string;
};

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse<User | undefined>) => {
    const { email, password } = JSON.parse(req.body) as LoginFormInfo;
    const user = await checkValidUser(email, password);
    if (user) {
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } else {
      res.status(401).end();
    }
  },
  sessionOptions
);