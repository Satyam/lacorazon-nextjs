import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { options } from './login';

export default withIronSessionApiRoute(function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) {
  req.session.destroy();
  res.end();
},
options);
