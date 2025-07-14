import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Notifications from '../common/Notifications';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <Outlet />
        </div>
      </main>
      <Notifications />
    </div>
  );
};

export default Layout;