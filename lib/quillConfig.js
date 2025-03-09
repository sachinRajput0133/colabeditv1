// lib/quillConfig.js
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

// Register QuillCursors module
Quill.register('modules/cursors', QuillCursors);

// Export configured modules
export const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
  cursors: {
    transformOnTextChange: true,
    hideDelayMs: 5000,  // Hide cursors after 5 seconds of inactivity
    hideSpeedMs: 500,   // Animation speed when hiding
  },
  history: {
    userOnly: true
  }
};
