import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import { format } from "date-fns";
// import 'quill/dist/quill.snow.css';
import "react-quill/dist/quill.snow.css";
// If using cursors, add this import
import QuillCursors from "quill-cursors";
import {
  initSocket,
  joinDocument,
  leaveDocument,
  sendChanges,
  updateCursorPosition,
  saveDocument,
  getPreviousNextVerionDoc,
} from "../../lib/socket";
import ShareModal from "./ShareModal";
import VersionHistoryModal from "./VersionHistory";
import AppContext from "@utils/appContext";
import { quillModules } from "@lib/quillConfig";
import { SHARE_PERMISSIONS } from "@utils/constent";
// Import Quill dynamically to avoid SSR issues
// const ReactQuill = dynamic(() => import('react-quill'), {
//   ssr: false,
//   loading: () => <div className="h-screen flex items-center justify-center">Loading editor...</div>,
// });
const ReactQuill = dynamic(
  async () => {
    // First import Quill and register modules
    await import("../../lib/quillConfig");
    // Then import ReactQuill
    const { default: RQ } = await import("react-quill");
    return RQ;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

// Random colors for user cursors
const CURSOR_COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#33A8FF",
  "#A833FF",
  "#FFB533",
  "#33FFE0",
];

const DocumentEditor = ({ documentId, initialDocument }) => {
  console.log("🚀 ~ DocumentEditor ~ initialDocument:", initialDocument);
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState(
    initialDocument?.content || { ops: [] }
  );
  // const [socket, setSocket] = useState(null);
  const { socket } = useContext(AppContext);
  const [activeUsers, setActiveUsers] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const cursorsModule = useRef(null);
  // Initialize editor permissions
  useEffect(() => {
    if (session && initialDocument) {
      // Admin can edit any document
      console.log("🚀 ~ useEffect ~ session.user:", session.user);
      console.log("🚀 ~ useEffect ~ initialDocument:", initialDocument);
      console.log("vsession.user.id", session.user.id);
      const findDocCollabPermission = initialDocument?.collaborators?.find(
        (user) => user.user._id == session.user.id
      );
      console.log(
        "🚀 ~ useEffect ~ findDocCollabPermission:",
        findDocCollabPermission
      );
      if (session.user.role === "admin" || session.user.role === "editor") {
        // if(initialDocument.collaborators?.find((user)=>user._id === session.user.id )){
        if (
          (initialDocument?.collaborators?.length > 1 &&
            findDocCollabPermission?.permission == SHARE_PERMISSIONS.owner) ||
          findDocCollabPermission?.permission == SHARE_PERMISSIONS.canEdit
        ) {
          setCanEdit(true);
        }
        if (initialDocument?.collaborators?.length == 1) {
          setCanEdit(true);
        }
        // }
        // setCanEdit(true);
        return;
      } else {
        setCanEdit(false);
      }

      // Owner can edit their documents
      // if (initialDocument.owner === session.user.id) {
      //   setCanEdit(true);
      //   return;
      // }

      // Check collaborator permissions
      // const collaborator = initialDocument.collaborators.find(
      //   c => c.user._id === session.user.id
      // );
      // console.log("🚀 ~ useEffect ~ collaborator:", collaborator)

      // if (collaborator && collaborator.permission === 'can_edit') {
      //   setCanEdit(true);
      // } else {
      //   setCanEdit(false);
      // }
    }
  }, [session, initialDocument]);

  // Initialize socket connection
  // useEffect(() => {
  //   const setupSocket = async () => {
  //     const socketInstance = await initSocket();
  //     setSocket(socketInstance);

  //     return () => {
  //       if (socketInstance && documentId) {
  //         leaveDocument(documentId, session?.user?.id, session?.user?.name);
  //       }
  //     };
  //   };

  //   if (session?.user) {
  //     setupSocket();
  //   }

  //   return () => {
  //     if (socket && documentId) {
  //       leaveDocument(documentId, session?.user?.id, session?.user?.name);
  //     }
  //   };
  // }, [session]);

  // Join document room when socket is ready
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ socket:", socket);
    if (socket && session?.user && documentId) {
      joinDocument(documentId, session.user.id, session?.user?.name, socket);

      // Load document content
      socket.on("load-document", (docContent) => {
        console.log("🚀 ~ socket.on ~ docContent:", docContent);
        console.log("load dcocument");
        setContent(docContent);
        // if (editorRef.current) {
        //   editorRef.current.setContents(docContent);
        // }
      });
      // socket.on("recieve-previous-version", (docContent) => {
      //   console.log("load dcocument");
      //   setContent(docContent);
      //   // if (editorRef.current) {
      //   //   editorRef.current.setContents(docContent);
      //   // }
      // });

      // Handle receiving changes from other users
      socket.on("receive-changes", ({ delta, userId }) => {
        console.log("receive-changes", delta);
        console.log("🚀 ~ socket.on ~ editorRef.current:", editorRef.current);
        // if (editorRef.current && userId !== session.user.id) {
        //   console.log("recieve,11222")
        //   editorRef.current.updateContents(delta);
        // }
      });

      // Handle cursor updates
      // socket.on('cursor-update', ({ userId, userName, position }) => {
      //   if (cursorsModule.current && userId !== session.user.id) {
      //     // Get a color for this user based on their ID
      //     const colorIndex = userId.charCodeAt(0) % CURSOR_COLORS.length;
      //     const color = CURSOR_COLORS[colorIndex];

      //     cursorsModule.current.createCursor(userId, userName, color);
      //     cursorsModule.current.moveCursor(userId, position);
      //   }
      // });

      // Track users joining
      socket.on("user-joined", ({ userId, userName }) => {
        setActiveUsers((prev) => ({
          ...prev,
          [userId]: { id: userId, name: userName },
        }));
      });

      // Track users leaving
      socket.on("user-left", ({ userId }) => {
        setActiveUsers((prev) => {
          const newUsers = { ...prev };
          delete newUsers[userId];
          return newUsers;
        });

        // // Remove cursor
        // if (cursorsModule.current) {
        //   cursorsModule.current.removeCursor(userId);
        // }
      });

      // Handle document save confirmation
      socket.on("document-saved", ({ savedAt, content }) => {
        console.log("🚀 ~ socket.on ~ content:", content);
        setIsSaving(false);
        setContent(content);
        setLastSaved(new Date(savedAt));
      });

      return () => {
        socket.off("load-document");
        socket.off("receive-changes");
        socket.off("cursor-update");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("document-saved");
      };
    }
  }, [socket, session, documentId]);

  // Setup Quill editor
  // useEffect(() => {
  //   // This function is called when the Quill component mounts
  //   const initializeEditor = () => {
  //     if (quillRef.current) {
  //       // Get the actual editor instance
  //       console.log("🚀 ~ initializeEditor ~  quillRef.current:",  quillRef.current)
  //       const editor = quillRef.current.getEditor();

  //       // Store the editor for later use
  //       editorRef.current = editor;

  //       // Get cursors module
  //       cursorsModule.current = editor.getModule('cursors');

  //       // Set up selection change handler for cursor tracking
  //       editor.on('selection-change', (range, oldRange, source) => {
  //         if (range && socket && session?.user) {
  //           updateCursorPosition(
  //             documentId,
  //             range,
  //             session.user.id,
  //             session.user.name
  //           );
  //         }
  //       });
  //     }
  //   };

  //   // Try to initialize editor when component mounts or Quill ref changes
  //   initializeEditor();
  // }, [quillRef.current, socket, session, documentId]);
  useEffect(() => {
    const initializeEditor = () => {
      if (quillRef.current) {
        console.log("Quill ref current:", quillRef.current);

        // Try different ways to access the editor
        if (quillRef.current.editor) {
          // This is often how the Quill instance is exposed
          editorRef.current = quillRef.current.editor;
          console.log("Got editor from quillRef.current.editor");
        } else if (quillRef.current.getEditor) {
          editorRef.current = quillRef.current.getEditor();
          console.log("Got editor from quillRef.current.getEditor()");
        } else {
          // Last resort - try to find it in props or internal state
          console.log(
            "Could not access editor directly - check ReactQuill version"
          );
        }

        // Only proceed if we successfully got the editor
        console.log("🚀 ~ initializeEditor ~ editorRef:out sideeee");
        if (editorRef.current) {
          console.log("🚀 ~ initializeEditor ~ editorRef:", editorRef);
          try {
            // Setup cursor module if it exists
            if (editorRef.current.getModule) {
              cursorsModule.current = editorRef.current.getModule("cursors");

              editorRef.current.on(
                "selection-change",
                (range, oldRange, source) => {
                  if (range && socket && session?.user) {
                    updateCursorPosition(
                      documentId,
                      range,
                      session.user.id,
                      session.user.name,
                      socket
                    );
                  }
                }
              );
            }
          } catch (error) {
            console.error("Error setting up cursor module:", error);
          }
        }
      }
    };

    // Check if quillRef is ready
    if (quillRef.current) {
      console.log("🚀 ~ useEffect ~ quillRef.current:sasas", quillRef.current);
      // Delay to ensure full mount
      const timer = setTimeout(initializeEditor, 1000);
      return () => clearTimeout(timer);
    }
  }, [quillRef.current, socket, session, documentId]);
  // Handle document changes
  // const handleChange = useCallback((content, delta, source, editor) => {
  //   if (source === 'user' && socket && session?.user) {
  //     sendChanges(documentId, delta, session.user.id,socket);
  //     console.log("🚀 ~ handleChange ~ editor.getContents():", editor.getContents())
  //     debouncedSave(editor.getContents());
  //   }
  // }, [socket, session, documentId]);
  const handleChange = useCallback(
    (content, delta, source, editor) => {
      // Store editor reference when it's available
      if (!editorRef.current && editor) {
        editorRef.current = editor;
        console.log("Got editor reference from onChange callback");

        // Now that we have the editor, try to set up cursor tracking
        try {
          if (editorRef.current.getModule) {
            cursorsModule.current = editorRef.current.getModule("cursors");
            console.log("moduleeee>>>");
            editorRef.current.on(
              "selection-change",
              (range, oldRange, source) => {
                console.log("🚀 ~ editorRef.current.on ~ range:", range);
                if (range && socket && session?.user) {
                  updateCursorPosition(
                    documentId,
                    range,
                    session.user.id,
                    session.user.name,
                    socket
                  );
                }
              }
            );
          }
        } catch (error) {
          console.error("Error setting up cursor module:", error);
        }
      }

      if (source === "user" && socket && session?.user) {
        sendChanges(documentId, delta, session.user.id, socket);
        debouncedSave(editor.getContents());
      }
    },
    [socket, session, documentId]
  );

  // Debounced auto-save (every 5 seconds)
  const debouncedSave = useCallback(
    debounce((content) => {
      if (socket && session?.user && documentId) {
        setIsSaving(true);
        saveDocument(documentId, content, session.user.id, socket);
      }
    }, 5000),
    [socket, session, documentId]
  );

  // Handle title change
  const handleTitleChange = useCallback(async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    try {
      await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (error) {
      console.error("Error updating title:", error);
    }
  }, []);

  // Manual save
  const handleManualSave = useCallback(() => {
    if (socket && session?.user) {
      const content = editorRef.current.getContents();
      console.log("🚀 ~ handleManualSave ~ content:", content);
      setIsSaving(true);
      saveDocument(documentId, content, session.user.id, socket);
    }
  }, []);
  // const handleManualSave = useCallback(() => {
  //   if (socket && session?.user) {
  //     try {
  //       // First try to get content from editor reference
  //       let contentToSave;
  //       if (editorRef.current && typeof editorRef.current.getContents === 'function') {
  //         contentToSave = editorRef.current.getContents();
  //       } else {
  //         // Fallback to using state content
  //         contentToSave = content;
  //         console.warn("Using state content as fallback - editor reference not available");
  //       }

  //       console.log("🚀 ~ handleManualSave ~ contentToSave:", contentToSave);
  //       setIsSaving(true);
  //       saveDocument(documentId, contentToSave, session.user.id, socket);
  //     } catch (error) {
  //       console.error("Error during manual save:", error);
  //     }
  //   }
  // }, [socket, session, documentId, content]);

  const hendlePrevVersion = () => {
    if (socket) {
      console.log("🚀 ~ hhendlePrevVersion");
      getPreviousNextVerionDoc(documentId, true, socket);
    }
  };
  const hendleNext = () => {
    if (socket) {
      console.log("🚀 ~ hhendlePrevVersion");
      getPreviousNextVerionDoc(documentId, false, socket);
    }
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex-1">
          <input
            type="text"
            value={initialDocument.title}
            onChange={handleTitleChange}
            className="text-2xl font-semibold outline-none w-full"
            disabled={!canEdit}
          />
          <div className="text-sm text-gray-500">
            {lastSaved &&
              `Last saved: ${format(
                new Date(lastSaved),
                "MMM d, yyyy h:mm a"
              )}`}
            {isSaving && " • Saving..."}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Active users */}
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">
              {Object.keys(activeUsers).length + 1} active
            </span>
            <div className="flex -space-x-2">
              {/* Current user avatar */}
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm border-2 border-white">
                {session?.user?.name?.[0] || "U"}
              </div>

              {/* Other users avatars */}
              {Object.values(activeUsers).map((user) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center  text-sm border-2 border-white"
                  title={user.name}
                >
                  {user.name || "U"}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {canEdit && (
              <button
                onClick={handleManualSave}
                className="px-3 py-1 bg-blue-600  rounded-md text-sm"
              >
                Save
              </button>
            )}
            <button
              onClick={hendlePrevVersion}
              className="px-3 py-1 bg-blue-600  rounded-md text-sm"
            >
              Undo
            </button>
            <button
              onClick={hendleNext}
              className="px-3 py-1 bg-blue-600  rounded-md text-sm"
            >
              Redo
            </button>
            <button
              onClick={() => setShowVersionHistory(true)}
              className="px-3 py-1 bg-purple-600  rounded-md text-sm"
            >
              History
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1 bg-green-600  rounded-md text-sm"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-grow relative">
        {/* {!canEdit && (
          <div className="absolute top-8 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
            You have read-only access to this document.
          </div>
        )} */}

        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handleChange}
          // modules={modules}
          readOnly={!canEdit}
          className="h-full"
        />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          documentId={documentId}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistoryModal
          documentId={documentId}
          onClose={() => setShowVersionHistory(false)}
          onRestore={(version) => {
            if (canEdit) {
              // editorRef.current.setContents(version.content);
              setIsSaving(true);
              saveDocument(
                documentId,
                version.content,
                session.user.id,
                socket
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default DocumentEditor;
