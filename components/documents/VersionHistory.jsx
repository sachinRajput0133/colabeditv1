import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const VersionHistory = ({ documentId, onClose, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);

  // Fetch document versions
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/${documentId}/versions`);
        
        if (res.ok) {
          const data = await res.json();
          setVersions(data.versions);
        } else {
          setError('Failed to load version history');
        }
      } catch (error) {
        setError('An error occurred while loading version history');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [documentId]);

  // Handle selecting a version
  const handleSelectVersion = (version) => {
    setSelectedVersion(version);
    setPreviewContent(version.content);
  };

  // Handle restoring a version
  const handleRestore = (version) => {
    // if (selectedVersion) {
      onRestore(version);
      onClose();
    // }
  };

  // Get preview text from Quill delta
  const getPreviewText = (content) => {
    if (!content || !content.ops) return '';
    
    return content.ops.map(op => op.insert || '').join('').slice(0, 150) + '...';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Version History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <p>Loading version history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="flex flex-grow overflow-hidden">
            {/* Versions list */}
            <div className="w-1/3 border-r pr-4 overflow-y-auto">
              <h3 className="font-medium mb-3">Versions</h3>
              
              {versions.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved versions yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {versions.map((version) => (
                    <li 
                      key={version._id} 
                      className={`py-3 cursor-pointer hover:bg-gray-50 px-2 ${
                        selectedVersion?._id === version._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectVersion(version)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">
                            Version {version.versionNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            By {version.createdBy.name || 'Unknown'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(version.createdAt), 'MMM d, h:mm a')}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 truncate">
                        {version.comment || 'No comment'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Version preview */}
            <div className="w-2/3 pl-4 flex flex-col">
              {selectedVersion ? (
                <>
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <h4 className="font-medium">
                      Version {selectedVersion.versionNumber} - {format(new Date(selectedVersion.createdAt), 'MMMM d, yyyy h:mm a')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Created by {selectedVersion.createdBy.name || 'Unknown'} 
                    </p>
                    {selectedVersion.comment && (
                      <p className="text-sm mt-2 italic">{selectedVersion.comment}</p>
                    )}
                  </div>
                  
                  <div className="flex-grow overflow-y-auto border rounded p-3">
                    <div className="text-sm">
                      <h5 className="font-medium mb-2">Preview:</h5>
                      <p className="text-gray-600">{getPreviewText(selectedVersion.content)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={()=>handleRestore(selectedVersion)}
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Restore this version
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a version from the list to preview
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistory;