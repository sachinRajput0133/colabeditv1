import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { CONFIG } from '../../../config';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  // Fetch documents shared with the user
  const serverUrl = CONFIG.FETCH_URL || `https://${context.req.headers.host}`;
  
  try {
    const response = await fetch(`${serverUrl}/api/documents/shared`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch shared documents');
    }
    
    const sharedDocuments = await response.json();
    console.log("🚀 ~ getServerSideProps ~ sharedDocuments:", sharedDocuments)
    
    return {
      props: {
        session,
        sharedDocuments,
      },
    };
  } catch (error) {
    console.error('Error fetching shared documents:', error);
    return {
      props: {
        session,
        sharedDocuments: [],
        error: 'Failed to load shared documents'
      },
    };
  }
}

const SharedDocumentsPage = ({ sharedDocuments, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter documents based on search query
  const filteredDocuments = searchQuery
    ? sharedDocuments.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sharedDocuments;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Shared with me</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search documents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      {/* Document grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <Link 
              key={doc._id} 
              href={`/documents/${doc._id}`}
              className="border rounded-lg p-4 hover:border-blue-500 transition cursor-pointer flex flex-col"
            >
              <div className="flex items-center mb-3">
                <svg
                  className="w-8 h-8 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-xs text-gray-500">
                    Last modified {format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                      {doc.owner.name.charAt(0)}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">
                      Owned by {doc.owner.name}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {doc.myPermission === 'can_edit' ? 'Can edit' : 'Can view'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          {searchQuery 
            ? 'No shared documents match your search.' 
            : 'No documents have been shared with you yet.'}
        </div>
      )}
    </div>
  );
};

export default SharedDocumentsPage;