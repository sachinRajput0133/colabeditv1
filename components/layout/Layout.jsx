import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Check if current page is login or register
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';
  
  // If on auth page or loading session, don't show layout
  if (isAuthPage || status === 'loading') {
    return <>{children}</>;
  }
  
  // If not authenticated and not on auth page, redirect to login
  if (!session && !isAuthPage) {
    router.push('/login');
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>;
  }
  
  // If authenticated, show layout with sidebar and header
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;