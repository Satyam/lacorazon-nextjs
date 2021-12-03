import { withIronSessionApiRoute } from 'iron-session/next';
import { options } from './login';
import { NextApiRequest, NextApiResponse } from 'next';

import type { User } from 'data/types';

declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}

export default withIronSessionApiRoute(userRoute, options);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json(req.session.user);
  } else {
    res.status(401).end();
  }
}
