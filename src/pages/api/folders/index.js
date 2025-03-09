import { getSession } from 'next-auth/react';
import dbConnect from '@lib/db';
import Folder from '@models/Folder';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  await dbConnect();
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getFolders(req, res, session);
    case 'POST':
      return createFolder(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// Get folders
async function getFolders(req, res, session) {
  try {
    const { parent } = req.query;
    
    let query = { isDeleted: false };
    
    // Filter by parent folder if provided
    if (parent !== undefined) {
      query.parent = parent === 'null' || parent === '' ? null : parent;
    }
    
    // If not admin, only show user's folders
    if (session.user.role !== 'admin') {
      query.owner = session.user.id;
    }
    
    const folders = await Folder.find(query)
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 });
    
    return res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return res.status(500).json({ error: 'Failed to fetch folders' });
  }
}

// Create a new folder
async function createFolder(req, res, session) {
  try {
    const { name, parent } = req.body;
    
    // Check if user can create folders
    if (session.user.role === 'viewer') {
      return res.status(403).json({ error: 'Not authorized to create folders' });
    }
    
    // Create the folder
    const folder = await Folder.create({
      name,
      owner: session.user.id,
      parent: parent || null,
    });
    
    const populatedFolder = await Folder.findById(folder._id)
      .populate('owner', 'name email');
    
    return res.status(201).json(populatedFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    return res.status(500).json({ error: 'Failed to create folder' });
  }
}