import { Authentication } from '@directorio/dashboard/authentication';
import { supabase } from '@directorio/supabase-js';
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Directory from './Directory';
import Layout from './Layout';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Account from './Account';

const navigation = [
  { name: 'Inicio', href: '/', icon: HomeIcon },
  { name: 'Perfil', href: '/perfil', icon: UserIcon },
];

export function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
  }, []);

  if (!session) return <Authentication />;

  const router = createBrowserRouter([
    {
      index: true,
      path: '/',
      element: (
        <Layout
          navigation={navigation}
          userEmail={session.user.email || 'Anonymous'}
        >
          <Directory key={session?.user.id} session={session} />
        </Layout>
      ),
    },
    {
      path: '/perfil',
      element: (
        <Layout
          navigation={navigation}
          userEmail={session.user.email || 'Anonymous'}
        >
          <Account key={session?.user.id} session={session} />
        </Layout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
