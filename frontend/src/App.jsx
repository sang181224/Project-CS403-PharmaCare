import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Import Outlet
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* <-- Thay thế HomePage bằng Outlet */}
        </main>
      </div>
      <Footer/>
    </div>
  );
}

export default App;