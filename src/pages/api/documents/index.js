import { getSession } from 'next-auth/react';
import dbConnect from '@lib/db';
import Document from '@models/Document';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'; 

export default async function handler(req, res) {
  // const session = await getSession({ req });
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  await dbConnect();
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getDocuments(req, res, session);
    case 'POST':
      return createDocument(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// Get documents (with filtering)
async function getDocuments(req, res, session) {
  try {
    const { folderId, search } = req.query;
    let query = { isDeleted: false };
    
    // Filter by folder if provided
    if (folderId) {
      query.folderId = folderId === 'null' ? null : folderId;
    }
    
    // Search by title if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // If not admin, limit to documents user has access to
    if (session.user.role !== 'admin') {
      query.$or = [
        { owner: session.user.id },
        { 'collaborators.user': session.user.id }
      ];
    }
    
    const documents = await Document.find(query)
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort({ updatedAt: -1 });
    
    return res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ error: 'Failed to fetch documents' });
  }
}

// Create a new document
async function createDocument(req, res, session) {
  try {
    const { title, folderId } = req.body;
    
    // Editor role can create documents
    if (session.user.role === 'viewer') {
      return res.status(403).json({ error: 'Not authorized to create documents' });
    }
    
    const document = await Document.create({
      title,
      content: { ops: [] },
      owner: session.user.id,
      folderId: folderId || null,
      collaborators: [
        { user: session.user.id, permission: 'owner' }
      ],
      lastModifiedBy: session.user.id
    });
    
    return res.status(201).json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ error: 'Failed to create document' });
  }
}