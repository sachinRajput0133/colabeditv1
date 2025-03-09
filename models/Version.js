// import mongoose from 'mongoose';

// const VersionSchema = new mongoose.Schema({
//   documentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Document',
//     required: true
//   },
//   content: {
//     type: Object,
//     required: true
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   versionNumber: {
//     type: Number,
//     required: true
//   },
//   isInUse:{
//    type:Boolean,
//   },
//   comment: {
//     type: String,
//     default: 'Auto-saved version'
//   }
// }, { timestamps: true });

// const Version = mongoose.models.Version || mongoose.model('Version', VersionSchema);

// export default Version;

import mongoose from 'mongoose';

const VersionSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  isInUse: {
    type: Boolean,
    default: true // Default to true for new versions
  },
  comment: {
    type: String,
    default: 'Auto-saved version'
  },
}, { timestamps: true });

VersionSchema.pre('save', async function(next) {
    try {
      await mongoose.model('Version').updateMany(
        { 
          documentId: this.documentId, 
          isInUse: true,
          _id: { $ne: this._id } 
        },
        { 
          isInUse: false 
        }
      );
      
      next();
    } catch (error) {
      next(error);
    }
 
});

const Version = mongoose.models.Version || mongoose.model('Version', VersionSchema);

export default Version;