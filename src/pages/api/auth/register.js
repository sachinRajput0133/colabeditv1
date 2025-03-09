import dbConnect from '@lib/db';
import User from '@models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  await dbConnect();
  
  const { name, email, password } = req.body;
  
  try {
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: 'editor', // Default role
    });
    console.log("🚀 ~ handler ~ user:", user)
    
    // Remove password from response
    // const userObject = user.toObject();
    // delete userObject.password;
    
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering' });
  }
}