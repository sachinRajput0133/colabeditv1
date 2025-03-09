import { getSession } from 'next-auth/react';
import crypto from 'crypto';
import dbConnect from '@lib/db';
import Document from '@models/Document';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { CONFIG } from '../../../../../config';

export default async function handler(req, res) {
  // const session = await getSession({ req });
    const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  await dbConnect();
  
  const { id } = req.query;
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'POST':
      return createShareLink(req, res, session, id);
    case 'DELETE':
      return deleteShareLink(req, res, session, id);
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// Create a new share link
async function createShareLink(req, res, session, id) {
  try {
    const { expiresAt, active } = req.body;
    
    // Find the document
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has permission to create share link
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner.toString() === userId;
    const collaborator = document.collaborators.find(
      c => c.user.toString() === userId
    );
    const canShare = isOwner || 
                    (collaborator && collaborator.permission === 'owner') || 
                    userRole === 'admin';
    
    if (!canShare) {
      return res.status(403).json({ error: 'Not authorized to create share link' });
    }
    
    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Create the share link
    document.shareLink = {
      url: `${CONFIG.FETCH_URL}/shared/${token}`,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 1 week
      isActive: active !== undefined ? active : true
    };
    
    await document.save();
    
    return res.status(200).json({ shareLink: document.shareLink });
  } catch (error) {
    console.error('Error creating share link:', error);
    return res.status(500).json({ error: 'Failed to create share link' });
  }
}

// Delete a share link
async function deleteShareLink(req, res, session, id) {
  try {
    // Find the document
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has permission to delete share link
    const userId = session.user.id;
    const userRole = session.user.role;
    
    const isOwner = document.owner.toString() === userId;
    const collaborator = document.collaborators.find(
      c => c.user.toString() === userId
    );
    const canModify = isOwner || 
                     (collaborator && collaborator.permission === 'owner') || 
                     userRole === 'admin';
    
    if (!canModify) {
      return res.status(403).json({ error: 'Not authorized to delete share link' });
    }
    
    // Disable the share link
    document.shareLink = {
      url: '',
      expiresAt: new Date(),
      isActive: false
    };
    
    await document.save();
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting share link:', error);
    return res.status(500).json({ error: 'Failed to delete share link' });
  }
}