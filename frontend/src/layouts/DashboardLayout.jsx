import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b0f19' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
