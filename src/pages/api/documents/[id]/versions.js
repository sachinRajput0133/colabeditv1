import { getSession } from 'next-auth/react';
import dbConnect from '@lib/db';
import Document from '@models/Document';
import Version from '@models/Version';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  // const session = await getSession({ req });
    const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  await dbConnect();
  
  const { id } = req.query;
  console.log("🚀 ~ handler ~ id:", id)
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getVersions(req, res, session, id);
    case 'POST':
      return createVersion(req, res, session, id);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// Get all versions of a document
async function getVersions(req, res, session, id) {
  try {
    // Check if user has access to the document
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has access to this document
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner.toString() === userId;
    const isCollaborator = document.collaborators.some(
      c => c.user.toString() === userId
    );
    
    if (!isOwner && !isCollaborator && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Fetch versions
    const versions = await Version.find({ documentId: id })
      .populate('createdBy', 'name email')
      .sort({ versionNumber: -1 });
    
    return res.status(200).json({ versions });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return res.status(500).json({ error: 'Failed to fetch document versions' });
  }
}

// Create a new version manually
async function createVersion(req, res, session, id) {
  try {
    const { content, comment } = req.body;
    
    // Check if user has access to the document
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has edit access
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
      return res.status(403).json({ error: 'Not authorized to create versions' });
    }
    
    // Get the latest version number
    const versionsCount = await Version.countDocuments({ documentId: id });
    
    // Create a new version
    const newVersion = await Version.create({
      documentId: id,
      content: content || document.content,
      createdBy: userId,
      versionNumber: versionsCount + 1,
      comment: comment || 'Manual save',
    });
    
    const populatedVersion = await Version.findById(newVersion._id)
      .populate('createdBy', 'name email');
    
    return res.status(201).json(populatedVersion);
  } catch (error) {
    console.error('Error creating version:', error);
    return res.status(500).json({ error: 'Failed to create document version' });
  }
}