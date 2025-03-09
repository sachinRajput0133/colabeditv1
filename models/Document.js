import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: Object,
    default: { ops: [] } // Default Quill Delta format
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['owner', 'can_edit', 'can_view'],
      default: 'can_view'
    }
  }],
  shareLink: {
    url: String,
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create text index for search functionality
DocumentSchema.index({ title: 'text', 'content.ops.insert': 'text' });

const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);

export default Document;