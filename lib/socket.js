import { io } from 'socket.io-client';
import { CONFIG } from '../config';


export const initSocket = async () => {
  // Make sure socket server is initialized
   const  newSocket = io(CONFIG.FETCH_URL, {
      path: '/api/socket', // Default path unless customized
    });

  
  
  return newSocket;
};

export const joinDocument = (documentId, userId,userName,socket) => {
  console.log("🚀 ~ joinDocument ~ socket:", socket)
  if (socket) {
    socket.emit('join-document', { documentId, userId, userName });
  }
};

export const updateCursor = (documentId, userId, range,socket) => {
  if (socket) {
    socket.emit('cursor-change', { documentId, userId, range });
  }
};

export const sendTextChange = (documentId, delta, userId,socket) => {
  if (socket) {
    socket.emit('text-change', { documentId, delta, userId });
  }
};

export const saveDocument = (documentId, content, userId,socket) => {
  if (socket) {
    console.log("save doc",content)
    socket.emit('save-document', { documentId, content, userId });
  }
};
export const leaveDocument = (documentId,  userId,userName,socket) => {
  if (socket) {
    socket.emit('leave-document', { documentId, userId,userName });
  }
};

export const sendChanges = (documentId, delta, userId, socket) => {
  if (socket) {
    console.log("send changes")
    socket.emit('send-changes', { 
      documentId, 
      delta, 
      userId 
    });
  } else {
    console.warn('Cannot send changes: Socket connection not established');
  }
};

export const updateCursorPosition = (documentId, position, userId, userName, socket) => {
  console.log("🚀 ~ updateCursorPosition ~ position:", position)
  if (socket) {
    socket.emit('cursor-position', {
      documentId,
      position,
      userId,
      userName
    });
  } else {
    console.warn('Cannot update cursor: Socket not connected');
  }
};
export const getPreviousNextVerionDoc = (documentId,isPrevious = false,socket) => {
  if (socket) {
    socket.emit('request-previous-next-version', {
      documentId,  
      isPrevious
    });
  } else {
    console.warn('Cannot update cursor: Socket not connected');
  }
};