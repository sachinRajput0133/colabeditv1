// components/editor/DocumentEditor.jsx
import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { initSocket, joinDocument, updateCursor, sendTextChange, saveDocument, leaveDocument } from '../../lib/socket';
import debounce from 'lodash/debounce';
import 'quill/dist/quill.snow.css';
import AppContext from '@utils/appContext';

// Dynamically import Quill (no SSR)
const QuillEditor = dynamic(
  () => {
    import('quill-cursors');
    return import('react-quill');
  },
  { ssr: false }
);

const SAVE_INTERVAL_MS = 5000; // 5 seconds
const CURSOR_COLORS = ['#F44336', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4'];

const DocumentEditor = ({ documentId, initialDocument }) => {
  const { data: session } = useSession();
  const {socket} = useContext(AppContext)
  console.log("🚀 ~ DocumentEditor ~ socket:", socket)
  // const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [cursors, setCursors] = useState(null);
  const [content, setContent] = useState(initialDocument?.content || { ops: [] });
  const [lastSaved, setLastSaved] = useState(new Date());
  const [activeUsers, setActiveUsers] = useState([]);
  
  // Initialize socket connection
  // useEffect(() => {
  //   const setupSocket = async () => {
  //     const socketInstance = await initSocket();
  //     setSocket(socketInstance);
      
  //     return () => {
  //       socketInstance.disconnect();
  //     };
  //   };
    
  //   setupSocket();
  // }, []);
  
  // Join document room when socket is ready
  useEffect(() => {
    if (socket && session?.user && documentId) {
      joinDocument(documentId, session.user.id,session.user.name,socket);
      
      // Socket event listeners
      socket.on('receive-changes', ({ delta, userId }) => {
        console.log("recieverrrrr")
        if (quill && userId !== session.user.id) {
          quill.updateContents(delta);
        }
      });
      
      socket.on('cursor-update', ({ userId, range }) => {
        if (cursors) {
          const userIndex = activeUsers.findIndex(u => u.id === userId) % CURSOR_COLORS.length;
          const color = CURSOR_COLORS[userIndex];
          cursors.createCursor(userId, userId, color);
          cursors.moveCursor(userId, range);
        }
      });
      
      socket.on('user-joined', ({ userId }) => {
        // Add user to active users list
        setActiveUsers(prev => {
          if (!prev.find(u => u.id === userId)) {
            return [...prev, { id: userId }];
          }
          return prev;
        });
      });
      
      socket.on('document-saved', ({ lastSaved, lastSavedBy }) => {
        setLastSaved(new Date(lastSaved));
      });
      
      return () => {
        if(socket && documentId){
          leaveDocument(documentId, session?.user?.id, session?.user?.name);
        }
        socket.off('receive-changes');
        socket.off('cursor-update');
        socket.off('user-joined');
        socket.off('document-saved');
      };
    }
      console.log("🚀 ~ useEffect ~ socket:", socket)
  }, [socket, session, documentId, quill, cursors, activeUsers]);
  
  // Initialize Quill editor when component mounts
  const editorRef = useCallback(node => {
    if (node !== null) {
      const quillInstance = node.getEditor();
      setQuill(quillInstance);
      
      // Set up cursors module
      const cursorsModule = quillInstance.getModule('cursors');
      setCursors(cursorsModule);
      
      // Track selection changes for cursor position
      quillInstance.on('selection-change', (range, oldRange, source) => {
        if (range && socket && session?.user) {
          updateCursor(documentId, session.user.id, range);
        }
      });
    }
  }, [documentId, socket, session]);
  
  // Handle editor changes
  const handleChange = useCallback((content, delta, source, editor) => {
    if (source === 'user' && socket && session?.user) {
      sendTextChange(documentId, delta, session.user.id);
      setContent(editor.getContents());
    }
  }, [socket, session, documentId]);
  
  // Auto-save document on interval
  useEffect(() => {
    if (quill && socket && session?.user) {
      const interval = setInterval(() => {
        const currentContent = quill.getContents();
        saveDocument(documentId, currentContent, session.user.id);
        setLastSaved(new Date());
      }, SAVE_INTERVAL_MS);
      
      return () => clearInterval(interval);
    }
  }, [quill, socket, session, documentId]);
  
  // Save document on unmount
  useEffect(() => {
    return () => {
      if (quill && socket && session?.user) {
        saveDocument(documentId, quill.getContents(), session.user.id);
      }
    };
  }, [quill, socket, session, documentId]);
  
  // Check if user has edit permission
  const canEdit = () => {
    if (!session) return false;
    if (session.user.role === 'admin') return true;
    if (initialDocument.owner === session.user.id) return true;
    
    const userCollaborator = initialDocument.collaborators.find(
      c => c.user === session.user.id
    );
    
    return userCollaborator && userCollaborator.permission === 'can_edit';
  };
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ],
    cursors: true,
    history: {
      userOnly: true
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{initialDocument?.title || 'Untitled Document'}</h1>
          <p className="text-sm text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-2 items-center">
          <div>
            <span>Active users: {activeUsers.length}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow">
        {typeof window !== 'undefined' && (
          <QuillEditor
            ref={editorRef}
            theme="snow"
            value={content}
            onChange={handleChange}
            modules={modules}
            readOnly={!canEdit()}
            className="h-full"
          />
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;