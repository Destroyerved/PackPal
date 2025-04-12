
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className={`flex-1 p-4 ${isMobile ? 'pt-16' : 'pl-4'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
