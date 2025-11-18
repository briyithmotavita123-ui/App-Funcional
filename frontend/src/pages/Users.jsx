import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { Users as UsersIcon } from 'lucide-react';

const KAWAIICLASSES = {
  font: "font-['Caveat', 'cursive']",
  bg: "bg-gradient-to-br from-yellow-50 to-pink-50",
  card: "p-6 rounded-3xl shadow-xl border-4 border-purple-200 transition duration-300",
};

const Users = () => {
  const { registeredUsers } = useAuth();

  return (
    <div className={`p-8 min-h-screen ${KAWAIICLASSES.bg} ${KAWAIICLASSES.font}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-purple-600 mb-10 text-center flex items-center justify-center space-x-3">
          <UsersIcon size={40} />
          <span>Nuestros Amiguitos (Usuarios Registrados)</span>
        </h1>
        
        <div className={`bg-white ${KAWAIICLASSES.card}`}>
          <ul className="divide-y divide-purple-100">
            {registeredUsers.map((u, index) => (
              <li key={u.uid} className="flex items-center justify-between p-4 hover:bg-purple-50 transition duration-150 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {index % 3 === 0 ? '🐻' : index % 3 === 1 ? '🦊' : '🐼'}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">{u.displayName}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400 mt-1">UID: {u.uid}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${u.role === 'Manager' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;