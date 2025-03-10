// import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }
import { SessionProvider, useSession } from "next-auth/react";
import { Suspense, lazy, useEffect } from "react";
import "../styles/globals.css";
import AppContext from "@utils/appContext";
import useAppContext from "../../hooks/context/useAppContext";
import { initSocket } from "@lib/socket";
// import Layout from '@components/layout/Layout'
// Use React.lazy for Layout component to optimize performance
const Layout = lazy(() => import("@components/layout/Layout"));

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const value = useAppContext();
  useEffect(() => {
    
    const setupSocket = async () => {
      const socketInstance = await initSocket();
      value.setSocket(socketInstance);
      console.log("🚀 ~ setupSocket ~ socketInstance:", socketInstance)

      return () => {
        // if (socketInstance && documentId) {
        //   leaveDocument(documentId, session?.user?.id, session?.user?.name);
        // }
      };
    };

    if (!value.socket?.connected && session?.user ) {
      setupSocket();
    }

    return () => {
      // if (value.socket && documentId) {
      //   leaveDocument(documentId, session?.user?.id, session?.user?.name);
      // }
    };
  }, [session]);

  return (
    <AppContext.Provider value={value}>
      <SessionProvider session={session} baseUrl="https://sample.doccollab.tech">
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              Loading...
            </div>
          }
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Suspense>
      </SessionProvider>
    </AppContext.Provider>
  );
}

export default MyApp;
