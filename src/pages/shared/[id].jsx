import React, { useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// // export async function getServerSideProps(context) {
// //   const { token } = context.params;
// //   const session = await getSession(context);
// //   console.log("🚀 ~ getServerSideProps ~ session:", session)
  
// // //   await dbConnect();
  
// //   try {
// //     // Find the document with the matching share link
// //     // const document = await Document.findOne({
// //     //   'shareLink.url': `${CONFIG.FETCH_URL || `https://${context.req.headers.host}`}/shared/${token}`,
// //     //   'shareLink.isActive': true,
// //     //   'shareLink.expiresAt': { $gt: new Date() }
// //     // }).populate('owner', 'name email');
// //     // console.log("linkkkk",document)
// //     // if (!document) {
// //     //   return {
// //     //     notFound: true
// //     //   };
// //     // }
    
// //     // // If user is logged in, check if they're already a collaborator
// //     // let isCollaborator = false;
// //     // if (session?.user) {
// //     //   isCollaborator = document.collaborators.some(
// //     //     c => c.user.toString() === session.user.id
// //     //   );
// //     // }
    
// //     return {
// //       props: {
// //         // documentData: JSON.parse(JSON.stringify({
// //         //   _id: document._id.toString(),
// //         //   title: document.title,
// //         //   content: document.content,
// //         //   owner: {
// //         //     _id: document.owner._id.toString(),
// //         //     name: document.owner.name,
// //         //     email: document.owner.email
// //         //   },
// //         //   isSharedLink: true
// //         // })),
// //         // isCollaborator
// //       }
// //     };
// //   } catch (error) {
// //     console.error('Error fetching shared document:', error);
// //     return {
// //       notFound: true
// //     };
// //   }
// // }

// const SharedDocument = () => {
// //   const { data: session } = useSession();
// //   const router = useRouter();
// //   const [showLoginPrompt, setShowLoginPrompt] = useState(!session);
  
//   // If the user is logged in and is a collaborator, take them to the regular document page
// //   useEffect(() => {
// //     if (session && isCollaborator) {
// //       router.replace(`/documents/${documentData._id}`);
// //     }
// //   }, [session, isCollaborator, documentData._id, router]);
  
// //   // Handle signing in to access the document
// //   const handleSignIn = () => {
// //     console.log("🚀 ~ getServerSideProps ~ document:", document)
// //     router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
// //   };
  
//   return (
//     <>
   
      
//       {/* {showLoginPrompt && !session && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-4">Sign in to edit</h2>
//             <p className="mb-6 text-gray-600">
//               You're viewing a shared document. Sign in to collaborate and make changes.
//             </p>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowLoginPrompt(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 View only
//               </button>
//               <button
//                 onClick={handleSignIn}
//                 className="flex-1 px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700"
//               >
//                 Sign in
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
      
//       {/* <DocumentEditor
//         documentId={documentData._id}
//         initialDocument={{
//           ...documentData,
//           collaborators: [], // Since this is a shared link, we don't expose collaborators
//           // Set default permission to view-only for shared links
//           // The actual document editor component will enforce permissions
//           permission: 'can_view'
//         }}
//       /> */}
//     </>
//   );
// };

// export default SharedDocument;


const SharedDocument = () => {
  return (
    <div>sharedID</div>
  )
}

export default SharedDocument