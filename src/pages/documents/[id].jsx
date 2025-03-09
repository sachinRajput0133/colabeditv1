import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { CONFIG } from '../../../config';

// Use dynamic import with no SSR for DocumentEditor component
// This ensures that Quill editor is only loaded on the client side
const DocumentEditor = dynamic(
  () => import('@components/documents/DocumentEditor'),
  { ssr: false }
);

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  
  const { id } = context.params;
  console.log("🚀 ~ getServerSideProps ~ id:", id)
  
  // Fetch document data
  const serverUrl = CONFIG.FETCH_URL || `https://${context.req.headers.host}`;
  
  try {
    const res = await fetch(`${serverUrl}/api/documents/${id}`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });
    
    if (!res.ok) {
      // Handle not found or no access
      return {
        props: {
          error: res.status,
          errorMessage: res.statusText,
        },
      };
    }
    
    const document = await res.json();
    
    return {
      props: {
        session,
        document,
      },
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    return {
      props: {
        error: 500,
        errorMessage: 'Failed to fetch document',
      },
    };
  }
}

const DocumentPage = ({ document, error, errorMessage }) => {
  const router = useRouter();
  
  // Handle error states
  if (error) {
    return <Error statusCode={error} title={errorMessage} />;
  }
  
  // Handle loading state
  if (router.isFallback) {
    return <div className="flex h-screen items-center justify-center">Loading document...</div>;
  }
  
  return (
    <div className="h-full">
      <DocumentEditor documentId={document._id} initialDocument={document} />
    </div>
  );
};

export default DocumentPage;