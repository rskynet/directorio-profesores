/* eslint-disable no-empty-pattern */
import { supabase } from '@directorio/supabase-js';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useDebounceValue } from './hooks/useDebounceValue';

type TPeople = {
  first_name: string;
  last_name: string;
  id: string;
  public_email: string;
};

type TDirectoryProps = {
  session: Session;
};

export default function Directory({}: TDirectoryProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [people, setPeople] = useState<TPeople[]>();
  const [search, setSearch] = useDebounceValue('', 500);

  useEffect(() => {
    async function getPeople() {
      const { data } = await supabase
        .from('profiles')
        .select()
        .ilike('public_email', `%${search}%`);

      setPeople(data as TPeople[]);

      if (data) setIsLoading(false);
    }

    getPeople();
  }, [search]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
      </div>
      <input
        onChange={(e) => {
          setSearch(e.currentTarget.value);
        }}
        defaultValue={search}
        id="search"
        name="search"
        placeholder="Search by email..."
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {isLoading ? (
        <div>LOADING....</div>
      ) : (
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {people?.map((person) => (
                      <tr key={person.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {person.first_name}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {person.last_name}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {person.public_email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
