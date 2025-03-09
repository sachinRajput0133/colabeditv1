import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const FolderTree = ({ currentFolderId = null }) => {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});
  
  // Load all folders to build tree
  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        setLoading(true);
        
        const res = await fetch('/api/folders');
        
        if (res.ok) {
          const data = await res.json();
          setFolders(data);
          
          // Auto-expand the current folder and its parents
          if (currentFolderId) {
            const expandedState = {...expandedFolders};
            let folder = data.find(f => f._id === currentFolderId);
            
            while (folder && folder.parent) {
              expandedState[folder.parent] = true;
              folder = data.find(f => f._id === folder.parent);
            }
            
            setExpandedFolders(expandedState);
          }
        } else {
          setError('Failed to load folders');
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
        setError('An error occurred while loading folders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllFolders();
  }, [currentFolderId]);
  
  // Build folder tree from flat list
  const buildFolderTree = (parentId = null) => {
    return folders
      .filter(folder => folder.parent === parentId)
      .map(folder => ({
        ...folder,
        children: buildFolderTree(folder._id)
      }));
  };
  
  const toggleFolder = (folderId) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId]
    });
  };
  
  // Recursive component to render folder tree
  const FolderItem = ({ folder, level = 0 }) => {
    const isExpanded = expandedFolders[folder._id];
    const isActive = folder._id === currentFolderId;
    
    return (
      <div className="mt-1">
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer ${
            isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <button
            onClick={() => toggleFolder(folder._id)}
            className="mr-1 w-5 h-5 flex items-center justify-center focus:outline-none"
          >
            {folder.children.length > 0 && (
              <svg
                className="w-4 h-4 text-gray-500 transform transition-transform duration-150"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          
          <Link href={`/folders/${folder._id}`} className="flex-1 truncate">
            <span>{folder.name}</span>
          </Link>
        </div>
        
        {isExpanded && folder.children.length > 0 && (
          <div className="ml-2">
            {folder.children.map(child => (
              <FolderItem key={child._id} folder={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return <div className="p-4 text-gray-500">Loading folders...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  
  const folderTree = buildFolderTree();
  
  return (
    <div className="p-2">
      <h3 className="font-medium mb-2 text-gray-700">Folders</h3>
      
      <Link 
        href="/dashboard" 
        className={`flex items-center py-1 px-2 rounded mb-1 ${
          !currentFolderId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
        }`}
      >
        <svg
          className="w-5 h-5 mr-2 text-gray-500"
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
        Root
      </Link>
      
      {folderTree.length > 0 ? (
        folderTree.map(folder => (
          <FolderItem key={folder._id} folder={folder} />
        ))
      ) : (
        <div className="p-2 text-gray-500 text-sm">No folders</div>
      )}
    </div>
  );
};

export default FolderTree;