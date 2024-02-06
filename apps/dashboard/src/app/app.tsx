import { Authentication } from '@directorio/dashboard/authentication';
import { supabase } from '@directorio/supabase-js';
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Directory from './Directory';
import Layout from './Layout';

const navigation = [
  { name: 'Inicio', href: '#', icon: HomeIcon, current: true },
  { name: 'Perfil', href: '#', icon: UserIcon, current: false },
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

  return !session ? (
    <Authentication />
  ) : (
    <Layout
      navigation={navigation}
      userEmail={session.user.email || 'Anonymous'}
    >
      <Directory key={session.user.id} session={session} />
    </Layout>
  );
}

export default App;
