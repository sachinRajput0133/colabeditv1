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
  
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Find documents where the user is a collaborator, but not the owner
    const userId = session.user.id;
    console.log("🚀 ~ handler ~ userId:", userId)
    
    const documents = await Document.find({
      'collaborators.user': userId,
      owner: { $ne: userId },
      isDeleted: false
    })
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort({ updatedAt: -1 });
    
    // Add the user's permission to each document for easy access in the UI
    const documentsWithPermission = documents.map(doc => {
      const docObject = doc.toObject();
      const collaborator = doc.collaborators.find(
        c => c.user._id.toString() === userId
      );
      
      return {
        ...docObject,
        myPermission: collaborator ? collaborator.permission : 'can_view'
      };
    });
    
    return res.status(200).json(documentsWithPermission);
  } catch (error) {
    console.error('Error fetching shared documents:', error);
    return res.status(500).json({ error: 'Failed to fetch shared documents' });
  }
}