import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [recentDocs, setRecentDocs] = useState([]);
  
  // Fetch recent documents
  useEffect(() => {
    const fetchRecentDocs = async () => {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = await res.json();
          setRecentDocs(data);
        }
      } catch (error) {
        console.error('Error fetching recent documents:', error);
      }
    };
    
    if (session) {
      fetchRecentDocs();
    }
  }, [session]);
  
  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:block flex-shrink-0">
      <div className="p-4">
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400">
            Main
          </div>
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-2 mt-2 rounded-md ${
              router.pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
          
          <Link
            href="/documents/shared"
            className={`flex items-center px-4 py-2 mt-2 rounded-md ${
              router.pathname === '/documents/shared' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Shared with me
          </Link>
          
          {/* Create new document button */}
          {session?.user?.role !== 'viewer' && (
            <Link
              href="/documents/new"
              className="flex items-center px-4 py-2 mt-6 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Document
            </Link>
          )}
          
          {/* Recent documents */}
          {recentDocs.length > 0 && (
            <>
              <div className="px-4 py-2 mt-6 text-xs uppercase tracking-wider text-gray-400">
                Recent Documents
              </div>
              <div className="mt-2">
                {recentDocs.map((doc) => (
                  <Link
                    key={doc._id}
                    href={`/documents/${doc._id}`}
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="truncate">{doc.title}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;