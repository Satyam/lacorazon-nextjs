import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import sessionOptions from 'lib/auth';

export default withIronSessionApiRoute(function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) {
  req.session.destroy();
  res.end('logged off');
},
sessionOptions);
