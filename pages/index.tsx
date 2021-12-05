import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { withIronSessionSsr } from 'iron-session/next';
import type { User } from 'data/types';
import { sessionOptions } from 'lib/auth';
export const getServerSideProps = withIronSessionSsr<{ user: User | null }>(
  async ({ req }) => {
    const user = req.session.user || null;
    console.log('home req session', req.session);
    return {
      props: {
        user,
      },
    };
  },
  sessionOptions
);

const Home: NextPage<{ user?: User }> = ({ user }) => {
  console.log('Home', user);
  return (
    <Layout heading="Bienvenido a La Corazón" user={user}>
      {}
    </Layout>
  );
};

export default Home;
