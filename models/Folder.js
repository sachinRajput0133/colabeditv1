import mongoose from 'mongoose';

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a folder name'],
    trim: true,
    maxlength: [50, 'Folder name cannot be more than 50 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Prevents modification of the creation timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema);

export default Folder;