import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            CollabDocs
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User profile dropdown */}
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {session.user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {session.user.name || session.user.email}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Role: {session.user.role}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut({ callbackUrl: '/login' });
                    }}
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;