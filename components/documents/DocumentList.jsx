import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import CreateDocumentModal from './CreateDocumentModal';
import CreateFolderModal from './CreateFolderModal';

const DocumentList = ({ documents, folders, currentFolder ,folder}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showCreateDoc, setShowCreateDoc] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  // Filter documents and folders based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle document creation
  const handleCreateDocument = async (data) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          folderId: currentFolder|| null
        }),
      });

      if (response.ok) {
        router.reload()
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  // Handle folder creation
  const handleCreateFolder = async (data) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          parent: currentFolder || null
        }),
      });

      if (response.ok) {
        router.reload();
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // Handle item selection
  const toggleItemSelection = (itemId, itemType) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      
      if (existingItem) {
        return prev.filter(item => item.id !== itemId);
      } else {
        return [...prev, { id: itemId, type: itemType }];
      }
    });
  };

  // Handle bulk delete
  const handleDelete = async () => {
    if (!selectedItems.length) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const documentsToDelete = selectedItems
        .filter(item => item.type === 'document')
        .map(item => item.id);
        
      const foldersToDelete = selectedItems
        .filter(item => item.type === 'folder')
        .map(item => item.id);
      
      // Delete documents
      if (documentsToDelete.length) {
        await fetch('/api/documents/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: documentsToDelete }),
        });
      }
      
      // Delete folders
      if (foldersToDelete.length) {
        await fetch('/api/folders/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: foldersToDelete }),
        });
      }
      
      // Refresh the page
      // router.reload();
    } catch (error) {
      console.error('Error deleting items:', error);
    } finally {
      setIsDeleting(false);
      setSelectedItems([]);
    }
  };

  // Determine if user has create permissions
  const canCreate = session?.user?.role === 'admin' || session?.user?.role === 'editor';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header with breadcrumbs and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              My Documents
            </Link>
            
            {/* Breadcrumb navigation for nested folders */}
            {currentFolder && (
              <>
                <span>/</span>
                <span className="text-gray-700">{folder?.name}</span>
              </>
            )}
          </div>
          
          <h1 className="text-2xl font-bold">{currentFolder ? 'Folder Contents' : 'My Documents'}</h1>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Folder/Documents"
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
          
          {/* New Document Button */}
          {canCreate && (
            <button
              onClick={() => setShowCreateDoc(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              New Document
            </button>
          )}
          
          {/* New Folder Button */}
          {canCreate && (
            <button
              onClick={() => setShowCreateFolder(true)}
              className="bg-green-600px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              New Folder
            </button>
          )}
        </div>
      </div>

      {/* Selection actions */}
      {/* {selectedItems.length > 0 && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
          <div>
            <span className="font-medium">{selectedItems.length} items selected</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Selected'}
            </button>
            <button
              onClick={() => setSelectedItems([])}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

      {/* Folders grid */}
      {filteredFolders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                className={`border rounded-lg p-4 hover:border-blue-500 transition cursor-pointer flex justify-between ${
                  selectedItems.some(item => item.id === folder._id)
                    ? 'border-blue-500 bg-blue-50'
                    : ''
                }`}
                // onClick={() => toggleItemSelection(folder._id, 'folder')}
                onClick={() => router.push(`/folder/${folder._id}`)}
              >
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-yellow-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-medium">{folder.name}</h3>
                    <p className="text-xs text-gray-500">
                      Created {format(new Date(folder.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Documents</h2>
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className={`border rounded-lg p-4 hover:border-blue-500 transition cursor-pointer flex flex-col ${
                  selectedItems.some(item => item.id === doc._id)
                    ? 'border-blue-500 bg-blue-50'
                    : ''
                }`}
                // onClick={() => toggleItemSelection(doc._id, 'document')}
                onClick={() => router.push(`/documents/${doc._id}`)}
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
                  {doc.collaborators.length > 0 && (
                    <div className="flex -space-x-2 mt-2">
                      {doc.collaborators.slice(0, 3).map((collab) => (
                        <div
                          key={collab.user._id}
                          className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs border border-white"
                          title={collab.user.name}
                        >
                          {collab.user.name.charAt(0)}
                        </div>
                      ))}
                      {doc.collaborators.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-white">
                          +{doc.collaborators.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {searchQuery ? 'No documents match your search.' : 'No documents yet.'}
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateDoc && (
        <CreateDocumentModal
          onClose={() => setShowCreateDoc(false)}
          onCreate={handleCreateDocument}
        />
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  );
}

export default DocumentList;
