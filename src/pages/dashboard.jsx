import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import DocumentList from '@components/documents/DocumentList';
import axios from 'axios';
import { CONFIG } from '../../config';
import getConfig from 'next/config';
// import FolderTree from '../components/documents/FolderTree';
const { publicRuntimeConfig } = getConfig();


const Dashboard = ({ initialDocuments, initialFolders }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      
      {/* Document List Component */}
      <DocumentList 
        documents={initialDocuments} 
        folders={initialFolders} 
        currentFolder={null}
      />
    </div>
  );
};

export default Dashboard;
// export async function getServerSideProps(context) {
//     const session = await getSession(context);
    
//     if (!session) {
//       return {
//         redirect: {
//           destination: '/login',
//           permanent: false,
//         },
//       };
//     }
    
//     // Fetch root-level documents and folders
//     const serverUrl = CONFIG.FETCH_URL || `http://localhost:3000`;
    
//     const [documentsRes, foldersRes] = await Promise.all([
//       fetch(`${serverUrl}/api/documents?folderId=null`, {
//         headers: {
//           cookie: context.req.headers.cookie || '',
//         },
//       }),
//       fetch(`${serverUrl}/api/folders?parent=null`, {
//         headers: {
//           cookie: context.req.headers.cookie || '',
//         },
//       })
//     ]);
//     console.log("🚀 ~ getServerSideProps ~ foldersRes:", foldersRes)
    
//     const documents = await documentsRes.json();
//     const folders = await foldersRes.json();
    
//     return {
//       props: {
//         session,
//         initialDocuments: documents,
//         initialFolders: folders,
//       },
//     };
//   }


export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  // Define the server URL
  const serverUrl = CONFIG.FETCH_URL || `https://${context.req.headers.host}`;

  try {
    // Concurrently fetch documents and folders using Axios
    const [documentsRes, foldersRes] = await Promise.all([
      axios.get(`${serverUrl}/api/documents?folderId=null`, {
        headers: {
          cookie: context.req.headers.cookie || '',
        },
      }),
      axios.get(`${serverUrl}/api/folders?parent=null`, {
        headers: {
          cookie: context.req.headers.cookie || '',
        },
      }),
    ]);

    // Extract data from the responses
    const documents = documentsRes.data;
    const folders = foldersRes.data;

    return {
      props: {
        session,
        initialDocuments: documents,
        initialFolders: folders,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        session,
        initialDocuments: [],
        initialFolders: [],
      },
    };
  }
}