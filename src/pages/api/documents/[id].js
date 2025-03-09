import dbConnect from '@lib/db';
import Document from '@models/Document';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
   const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  await dbConnect();
  
  const {id } = req.query;
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getDocument(req, res, session, id);
    case 'PUT':
      return updateDocument(req, res, session, id);
    case 'PATCH':
      return updateDocumentPartial(req, res, session, id);
    case 'DELETE':
      case 'POST':
        return updateDocumentPartial(req, res, session, id);
      case 'DELETE':
      return deleteDocument(req, res, session, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// Get a single document
async function getDocument(req, res, session, id) {
  try {
    const document = await Document.findById(id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has access to this document
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner._id.toString() === userId;
    const isCollaborator = document.collaborators.some(
      c => c.user._id.toString() === userId
    );
    
    if (!isOwner && !isCollaborator && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    return res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({ error: 'Failed to fetch document' });
  }
}

// Update the entire document
async function updateDocument(req, res, session, id) {
  try {
    const { title, content } = req.body;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check user permissions
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner.toString() === userId;
    const collaborator = document.collaborators.find(
      c => c.user.toString() === userId
    );
    const canEdit = isOwner || 
                   (collaborator && collaborator.permission === 'can_edit') || 
                   userRole === 'admin';
    
    if (!canEdit) {
      return res.status(403).json({ error: 'Not authorized to update this document' });
    }
    
    // Update the document
    document.title = title;
    document.content = content;
    document.lastModifiedBy = userId;
    
    await document.save();
    
    return res.status(200).json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ error: 'Failed to update document' });
  }
}

// Update part of a document (e.g., just the title)
async function updateDocumentPartial(req, res, session, id) {
  try {
    const updateData = req.body;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check user permissions
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner.toString() === userId;
    const collaborator = document.collaborators.find(
      c => c.user.toString() === userId
    );
    const canEdit = isOwner || 
                   (collaborator && collaborator.permission === 'can_edit') || 
                   userRole === 'admin';
    
    if (!canEdit) {
      return res.status(403).json({ error: 'Not authorized to update this document' });
    }
    
    // Update only the fields provided
    Object.keys(updateData).forEach(key => {
      if (key !== 'owner' && key !== '_id' && key !== 'createdAt') {
        document[key] = updateData[key];
      }
    });
    
    document.lastModifiedBy = userId;
    
    await document.save();
    
    return res.status(200).json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ error: 'Failed to update document' });
  }
}

// Delete a document (soft delete)
async function deleteDocument(req, res, session, id) {
  try {
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check user permissions
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner.toString() === userId;
    const canDelete = isOwner || userRole === 'admin';
    
    if (!canDelete) {
      return res.status(403).json({ error: 'Not authorized to delete this document' });
    }
    
    // Soft delete the document
    document.isDeleted = true;
    await document.save();
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ error: 'Failed to delete document' });
  }
}