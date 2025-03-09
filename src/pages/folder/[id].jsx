import React from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import DocumentList from '@components/documents/DocumentList';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CONFIG } from '../../../config';

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

  const { id } = context.params;
  const serverUrl = CONFIG.FETCH_URL || `https://${context.req.headers.host}`;

  
  try {
    // Create an axios instance with default config
    const axiosInstance = axios.create({
      baseURL: serverUrl,
      headers: {
        Cookie: context.req.headers.cookie || '',
      },
    });

    // Fetch folder details
    const folderRes = await axiosInstance.get(`/api/folders/${id}`);

    console.log("🚀 ~ getServerSideProps ~ folderRes:", folderRes)
    // Fetch documents and subfolders in this folder
    const [documentsRes, foldersRes] = await Promise.all([
      axiosInstance.get(`/api/documents?folderId=${id}`),
      axiosInstance.get(`/api/folders?parent=${id}`)
    ]);

    return {
      props: {
        session,
        folder: folderRes.data,
        documents: documentsRes.data,
        folders: foldersRes.data,
      },
    };
  } catch (error) {
    console.error('Error fetching folder data:', error);

    // Handle different types of errors
    const errorStatus = error.response ? error.response.status : 500;
    const errorMessage = error.response 
      ? error.response.data.message || 'Failed to fetch folder data'
      : 'Failed to fetch folder data';

    return {
      props: {
        error: errorStatus,
        errorMessage: errorMessage,
      },
    };
  }
}

const FolderPage = ({ folder, documents, folders, error, errorMessage }) => {
  console.log("🚀 ~ FolderPage ~ folder:", folder);
  console.log("🚀 ~ FolderPage ~ documents:", documents);
  
  const router = useRouter();

  if (error) {
    return <Error statusCode={error} title={errorMessage} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{folder.name}</h1>
      
      <DocumentList
         folder={folder}
        documents={documents}
        folders={folders}
        currentFolder={router?.query?.id}
      />
    </div>
  );
};

export default FolderPage;