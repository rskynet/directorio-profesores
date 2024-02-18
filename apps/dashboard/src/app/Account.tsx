import { supabase } from '@directorio/supabase-js';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function Account({ session }: { session: Session }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const changePassword = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert(error.message);
    } else {
      alert('UPDATED');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsLoading(false);
  };

  const updateProfile = async () => {
    setIsLoading(true);

    const { user } = session;

    const updates = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      public_email: publicEmail,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      alert('UPDATED');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    async function getProfile() {
      setIsLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`first_name, last_name, public_email`)
        .eq('id', user.id)
        .single();

      console.log(data);

      if (error) {
        console.warn(error);
      } else if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPublicEmail(data.public_email);
      }
      setIsLoading(false);
    }

    getProfile();
  }, [session]);

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>
        </div>

        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile();
          }}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="first-name"
                    id="first-name"
                    value={firstName}
                    disabled={isLoading}
                    onChange={(e) => {
                      setFirstName(e.currentTarget.value);
                    }}
                    className={
                      'disabled:text-gray-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:animate-pulse'
                    }
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="last-name"
                    id="last-name"
                    value={lastName}
                    disabled={isLoading}
                    onChange={(e) => {
                      setLastName(e.currentTarget.value);
                    }}
                    className="disabled:text-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:animate-pulse block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={session.user.email}
                    disabled
                    className="disabled:text-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="public-email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Public email address
                </label>
                <div className="mt-2">
                  <input
                    id="public-email"
                    name="public-email"
                    type="email"
                    value={publicEmail}
                    disabled={isLoading}
                    onChange={(e) => {
                      setPublicEmail(e.currentTarget.value);
                    }}
                    className="disabled:text-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:animate-pulse block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              disabled={isLoading}
              type="submit"
              className="disabled:bg-indigo-500 disabled:cursor-not-allowed rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Change password
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Update your password associated with your account.
          </p>
        </div>

        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newPassword || !confirmPassword) return;

            if (newPassword === confirmPassword) {
              changePassword();
            } else {
              alert('Passwords do not match');
            }
          }}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New password
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => {
                      setNewPassword(e.currentTarget.value);
                    }}
                    required
                    disabled={isLoading}
                    value={newPassword}
                    id="new-password"
                    name="new-password"
                    type="password"
                    className="disabled:text-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:animate-pulse block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => {
                      setConfirmPassword(e.currentTarget.value);
                    }}
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    className="disabled:text-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:animate-pulse block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              disabled={isLoading}
              type="submit"
              className="disabled:bg-indigo-500 disabled:cursor-not-allowed rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
