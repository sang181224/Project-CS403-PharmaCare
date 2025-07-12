import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

// --- Layouts ---
import App from './App.jsx' // Layout chính cho trang public
import AdminLayout from './components/admin/AdminLayout.jsx'; // Layout cho trang admin
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Component "gác cổng"

// --- Public Pages ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';

// --- Admin Pages ---
import DashboardPage from './pages/admin/nhan-vien/DashboardPage.jsx';
import OrderManagementPage from './pages/admin/nhan-vien/OrderManagementPage.jsx';
import OrderDetailPage from './pages/admin/nhan-vien/OrderDetailPage.jsx';
import WarehouseManagementPage from './pages/admin/nhan-vien/WarehouseManagementPage.jsx';
import AddProductPage from './pages/admin/nhan-vien/AddProductPage.jsx';
import ProductDetailAdminPage from './pages/admin/nhan-vien/ProductDetailAdminPage.jsx';
import EditOrderPage from './pages/admin/nhan-vien/EditOrderPage.jsx';
import EditProductPage from './pages/admin/nhan-vien/EditProductPage.jsx';
// (Chúng ta sẽ import các trang admin khác ở đây khi tạo chúng)


// --- Định nghĩa cấu trúc route ---
const router = createBrowserRouter([
  // Nhóm 1: Các route công khai, sử dụng Layout <App />
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/dang-nhap",
        element: <LoginPage />,
      },
      {
        path: "/dang-ky",
        element: <RegisterPage />,
      },
      {
        path: "/tim-kiem",
        element: <SearchPage />,
      },
      {
        path: "/san-pham/:id", // Route động cho chi tiết sản phẩm
        element: <ProductDetailPage />,
      },
    ],
  },

  // Nhóm 2: Các route quản trị, được "bảo vệ" bởi ProtectedRoute
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin", // Các route con bên trong sẽ có dạng /admin/...
        element: <AdminLayout />,
        children: [
          // Route mặc định cho nhân viên
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "don-hang", // <-- Thêm route mới
            element: <OrderManagementPage />,
          },
          {
            path: "don-hang/:id",
            element: <OrderDetailPage />,
          },
          { 
            path: "don-hang/sua/:id", // <-- Thêm route mới
            element: <EditOrderPage /> 
          }, 
          {
            path: "kho",
            element: <WarehouseManagementPage />
          },
          {
            path: "kho/them", // <-- Thêm route mới
            element: <AddProductPage />
          },
          {
            path: "kho/:id", // <-- Thêm route động mới
            element: <ProductDetailAdminPage />
          },
          { 
            path: "kho/sua/:id", // <-- Thêm route mới
            element: <EditProductPage /> 
          }
          // TODO: Thêm các route cho các trang quản trị khác ở đây
          // Ví dụ:
          // {
          //   path: "don-hang",
          //   element: <QuanLyDonHangPage />,
          // },
        ],
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)