import { createBrowserRouter } from 'react-router-dom';
// --- Layouts ---
import App from './App.jsx'; // Layout chính
import AdminLayout from './components/admin/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- Public Pages ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import DebugLoginPage from './pages/DebugLoginPage.jsx';

// --- Admin Pages (Nhân viên) ---
import DashboardPage from './pages/admin/nhan-vien/DashboardPage.jsx';
import OrderManagementPage from './pages/admin/nhan-vien/OrderManagementPage.jsx';
import OrderDetailPage from './pages/admin/nhan-vien/OrderDetailPage.jsx';
import EditOrderPage from './pages/admin/nhan-vien/EditOrderPage.jsx';
import CreateOrderPage from './pages/admin/nhan-vien/CreateOrderPage.jsx';
import WarehouseManagementPage from './pages/admin/nhan-vien/WarehouseManagementPage.jsx';
import AddProductPage from './pages/admin/nhan-vien/AddProductPage.jsx';
import ProductDetailAdminPage from './pages/admin/nhan-vien/ProductDetailAdminPage.jsx';
import EditProductPage from './pages/admin/nhan-vien/EditProductPage.jsx';
import ConsultationPage from './pages/admin/nhan-vien/ConsultationPage.jsx';
import GoodsReceiptIssuePage from './pages/admin/nhan-vien/GoodsReceiptIssuePage.jsx';
import CreateReceiptPage from './pages/admin/nhan-vien/CreateReceiptPage.jsx';
import CreateIssuePage from './pages/admin/nhan-vien/CreateIssuePage.jsx';

// --- Admin Pages (Quản trị viên) ---
import AdminDashboardPage from './pages/admin/quan-tri-vien/AdminDashboardPage.jsx';
import EmployeeManagementPage from './pages/admin/quan-tri-vien/EmployeeManagementPage.jsx';
import AddEmployeePage from './pages/admin/quan-tri-vien/AddEmployeePage.jsx';
import EditEmployeePage from './pages/admin/quan-tri-vien/EditEmployeePage.jsx';
import SupplierManagementPage from './pages/admin/quan-tri-vien/SupplierManagementPage.jsx';
import AddSupplierPage from './pages/admin/quan-tri-vien/AddSupplierPage.jsx';
import EditSupplierPage from './pages/admin/quan-tri-vien/EditSupplierPage.jsx';
import Products from './pages/products/index.jsx';
import CartPage from './pages/cartPage/index.jsx';
import PaymentPage from './pages/paymentPage/index.jsx';
import ReportPage from './pages/admin/quan-tri-vien/ReportPage.jsx';
import InvoiceManagementPage from './pages/admin/nhan-vien/InvoiceManagementPage.jsx';
import InvoiceDetailPage from './pages/admin/nhan-vien/InvoiceDetailPage.jsx';
import AccountLayout from './pages/member/AccountLayout.jsx';
import OrderHistoryPage from './pages/member/OrderHistoryPage.jsx';
import ProfilePage from './pages/member/ProfilePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/dang-nhap', element: <LoginPage /> },
      { path: '/dang-ky', element: <RegisterPage /> },
      { path: '/tim-kiem', element: <SearchPage /> },
      { path: '/san-pham/:id', element: <ProductDetailPage /> },
      { path: '/debug-login', element: <DebugLoginPage /> },
      { path: '/product', element: <Products /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/payment', element: <PaymentPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'tai-khoan',
            element: <AccountLayout />,
            children: [
              { path: 'don-hang', element: <OrderHistoryPage /> },
              { path: "thong-tin", element: <ProfilePage /> },
            ]
          }
        ]
      }
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'dashboard-admin', element: <AdminDashboardPage /> },

          //Báo cáo
          { path: "bao-cao", element: <ReportPage /> },
          // Đơn hàng
          { path: 'don-hang', element: <OrderManagementPage /> },
          { path: 'don-hang/:id', element: <OrderDetailPage /> },
          { path: 'don-hang/sua/:id', element: <EditOrderPage /> },
          { path: 'don-hang/tao-moi', element: <CreateOrderPage /> },
          //Hoá đơn
          { path: "hoa-don", element: <InvoiceManagementPage /> },
          { path: "hoa-don/:id", element: <InvoiceDetailPage /> },
          // Kho
          { path: 'kho', element: <WarehouseManagementPage /> },
          { path: 'kho/them', element: <AddProductPage /> },
          { path: 'kho/:id', element: <ProductDetailAdminPage /> },
          { path: 'kho/sua/:id', element: <EditProductPage /> },

          // Tư vấn & Phiếu nhập xuất
          { path: 'tu-van', element: <ConsultationPage /> },
          { path: 'phieu-nhap-xuat', element: <GoodsReceiptIssuePage /> },
          { path: 'phieu-nhap/them', element: <CreateReceiptPage /> },
          { path: 'phieu-xuat/them', element: <CreateIssuePage /> },

          // Nhân viên
          { path: 'nhan-vien', element: <EmployeeManagementPage /> },
          { path: 'nhan-vien/them', element: <AddEmployeePage /> },
          { path: 'nhan-vien/sua/:id', element: <EditEmployeePage /> },

          // Nhà cung cấp
          { path: 'nha-cung-cap', element: <SupplierManagementPage /> },
          { path: 'nha-cung-cap/them', element: <AddSupplierPage /> },
          { path: 'nha-cung-cap/sua/:id', element: <EditSupplierPage /> },


        ],
      },
    ],
  },
]);
export default router;