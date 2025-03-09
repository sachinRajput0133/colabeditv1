import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format, addDays } from 'date-fns';

const ShareModal = ({ documentId, onClose }) => {
  const { data: session } = useSession();
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('can_view');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [linkExpiration, setLinkExpiration] = useState(7); // 7 days by default
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch document collaborators
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const res = await fetch(`/api/documents/${documentId}/collaborators`);
        
        if (res.ok) {
          const data = await res.json();
          setCollaborators(data.collaborators);
          setShareLink(data.shareLink?.url || '');
        }
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      }
    };

    fetchCollaborators();
  }, [documentId]);

  // Handle adding a collaborator
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/documents/${documentId}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email, permission }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data.collaborators);
        setEmail('');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to add collaborator');
      }
    } catch (error) {
      setError('An error occurred while adding the collaborator');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle changing a collaborator's permission
  const handlePermissionChange = async (collaboratorId, newPermission) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/collaborators/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: newPermission ,collaboratorId}),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("🚀 ~ handlePermissionChange ~ data:", data)
        setCollaborators(data.collaborators);
      }
    } catch (error) {
      console.error('Error updating collaborator permission:', error);
    }
  };

  // Handle removing a collaborator
  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/collaborators/${collaboratorId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setCollaborators(
          collaborators.filter((c) => c.user._id !== collaboratorId)
        );
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  // Generate or update share link
  const handleGenerateShareLink = async () => {
    try {
      const expiresAt = addDays(new Date(), linkExpiration);
      
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiresAt,
          active: true,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setShareLink(data.shareLink.url);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
    }
  };

  // Copy share link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Add collaborator form */}
        <form onSubmit={handleAddCollaborator} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add people by email
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="can_view">Can view</option>
                <option value="can_edit">Can edit</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600  py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {/* Collaborators list */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">People with access</h3>
          <ul className="divide-y divide-gray-200">
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <li key={collaborator.user._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {collaborator.user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{collaborator.user.name}</p>
                      <p className="text-xs text-gray-500">{collaborator.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={collaborator.permission}
                      onChange={(e) => handlePermissionChange(collaborator.user._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      disabled={collaborator.user._id === session?.user?.id}
                    >
                      <option value="owner">Owner</option>
                      <option value="can_edit">Can edit</option>
                      <option value="can_view">Can view</option>
                    </select>
                    
                    {collaborator.user._id !== session?.user?.id && (
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.user._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="py-3 text-sm text-gray-500">No collaborators yet</li>
            )}
          </ul>
        </div>

        {/* Share link */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Share via link</h3>
          <div className="mb-2 flex items-center space-x-2">
            <select
              value={linkExpiration}
              onChange={(e) => setLinkExpiration(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={365}>1 year</option>
            </select>
            <button
              onClick={handleGenerateShareLink}
              className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
            >
              {shareLink ? 'Update link' : 'Generate link'}
            </button>
          </div>
          
          {shareLink && (
            <div className="flex items-center space-x-2 mt-3">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;