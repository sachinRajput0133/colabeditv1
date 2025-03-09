// pages/index.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import dbConnect from '@lib/db';
import Document from '@models/Document';
import Folder from '@models/Folder';

export default function Home({ initialDocuments, initialFolders }) {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState(initialDocuments || []);
  const [folders, setFolders] = useState(initialFolders || []);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch documents and folders for current folder
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/documents?folder=${currentFolder || ''}`);
        const data = await res.json();
        setDocuments(data.documents);
        setFolders(data.folders);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    
    fetchItems();
  }, [currentFolder]);
  
  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const search = async () => {
        try {
          const res = await fetch(`/api/documents/search?q=${searchTerm}`);
          const data = await res.json();
          setDocuments(data);
          setFolders([]);
        } catch (error) {
          console.error('Error searching:', error);
        }
      };
      
      const debounce = setTimeout(() => {
        search();
      }, 300);
      
      return () => clearTimeout(debounce);
    }
  }, [searchTerm]);
  
  // Create new document
  const createNewDocument = async () => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Untitled Document',
          folderId: currentFolder
        })
      });
      
      const newDoc = await res.json();
      setDocuments([...documents, newDoc]);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };
  
  // Create new folder
  const createNewFolder = async (name) => {
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          parent: currentFolder
        })
      });
      
      const newFolder = await res.json();
      setFolders([...folders, newFolder]);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };
  
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Collaborative Document Editor</h1>
          <p className="mb-6">Please sign in to access your documents</p>
          <Link href="/auth/signin">
            <h2 className="px-4 py-2 bg-blue-600 rounded">Sign In</h2>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <div className="flex space-x-2">
          <button
            onClick={createNewDocument}
            className="px-4 py-2 bg-blue-600rounded"
          >
            New Document
          </button>
          <button
            onClick={() => {
              const name = prompt('Enter folder name:');
              if (name) createNewFolder(name);
            }}
            className="px-4 py-2 bg-green-600 rounded"
          >
            New Folder
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {currentFolder && (
        <button
          onClick={() => setCurrentFolder(null)}
          className="mb-4 flex items-center text-blue-600"
        >
          ← Back to root
        </button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders?.map(folder => (
          <div
            key={folder._id}
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => setCurrentFolder(folder._id)}
          >
            <div className="flex items-center space-x-2">
              {/* <FolderIcon className="h-6 w-6 text-yellow-500" /> */}
              <span className="font-medium">{folder.name}</span>
            </div>
          </div>
        ))}
        
        {documents?.map(document => (
          <Link key={document._id} href={`/documents/${document._id}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    {/* <DocumentIcon className="h-6 w-6 text-blue-500" /> */}
                    <span className="font-medium">{document.title}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Last modified: {new Date(document.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      props: {
        initialDocuments: [],
        initialFolders: []
      }
    };
  }
  
  await dbConnect();
  
  // Get root level documents and folders
  const documents = await Document.find({
    $or: [
      { owner: session.user.id },
      { 'collaborators.user': session.user.id }
    ],
    folderId: null,
    isDeleted: { $ne: true }
  }).sort({ updatedAt: -1 });
  
  const folders = await Folder.find({
    owner: session.user.id,
    parent: null
  });
  
  return {
    props: {
      initialDocuments: JSON.parse(JSON.stringify(documents)),
      initialFolders: JSON.parse(JSON.stringify(folders))
    }
  };
}