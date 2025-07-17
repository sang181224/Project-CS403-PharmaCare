import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { CartProvider } from './components/CartContext/index.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './router.jsx';

// --- Render ứng dụng ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);