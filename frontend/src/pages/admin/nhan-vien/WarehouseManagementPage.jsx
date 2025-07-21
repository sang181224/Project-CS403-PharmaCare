import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faArchive, faUndo, faPlus } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination';
import ConfirmModal from '../../../components/ConfirmModal';
import toast from 'react-hot-toast';

// Custom hook để trì hoãn việc tìm kiếm
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

function WarehouseManagementPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [categories, setCategories] = useState([]);

  // State để quản lý hành động (lưu trữ hoặc phục hồi)
  const [actionInfo, setActionInfo] = useState({ isOpen: false, product: null, type: '' });

  const searchInputRef = useRef(null);
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Tải danh sách danh mục MỘT LẦN
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/categories`);
        if (response.ok) {
          setCategories(await response.json());
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Hàm gọi API để lấy danh sách sản phẩm
  const fetchProducts = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams({
        search: debouncedSearchTerm,
        status: filters.status,
        category: filters.category,
        page: page,
        limit: 10
      }).toString();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setProducts(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, filters.status, filters.category]);

  useEffect(() => {
    fetchProducts(pagination.currentPage);
  }, [fetchProducts, pagination.currentPage]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPagination(p => ({ ...p, currentPage: 1 }));
  };

  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({ ...prev, currentPage: pageNumber }));
  };

  // Hàm xác nhận chung cho cả hai hành động
  const handleActionConfirm = async () => {
    if (!actionInfo.product) return;

    const { product, type } = actionInfo;
    const endpoint = type === 'archive' ? 'archive' : 'restore';
    const method = 'PUT';

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}/${endpoint}`, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchProducts(pagination.currentPage);
      } else {
        toast.error('Lỗi: ' + result.error);
      }
    } catch (error) {
      toast.error('Lỗi kết nối đến server.');
    } finally {
      setActionInfo({ isOpen: false, product: null, type: '' }); // Đóng modal và reset
    }
  };

  // Hàm mở modal, xác định loại hành động
  const promptAction = (product, type) => {
    setActionInfo({ isOpen: true, product, type });
  };

  const getStatusColor = (status) => {
    if (status === 'Sắp hết hàng') return 'bg-orange-100 text-orange-800';
    if (status === 'Hết hàng' || status === 'Ngừng kinh doanh') return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Kho</h1>
        <Link to="/admin/kho/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input ref={searchInputRef} type="text" name="search" placeholder="Tìm theo Tên hoặc Mã..." value={filters.search} onChange={handleFilterChange} className="w-full p-2 border rounded-lg" />
          <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded-lg">
            <option value="">Tất cả trạng thái</option>
            <option value="Còn hàng">Còn hàng</option>
            <option value="Sắp hết hàng">Sắp hết hàng</option>
            <option value="Hết hàng">Hết hàng</option>
            <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
          </select>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded-lg">
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm uppercase text-gray-700">
              <tr><th className="px-6 py-3">Sản phẩm</th><th className="px-6 py-3">Danh mục</th><th className="px-6 py-3">SL Tồn</th><th className="px-6 py-3">Trạng thái</th><th className="px-6 py-3 text-center">Hành động</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Đang tải...</td></tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="flex items-center space-x-3"><img src={product.hinh_anh} alt={product.ten_thuoc} className="w-12 h-12 rounded-md object-cover flex-shrink-0" /><div><p className="font-medium text-gray-900">{product.ten_thuoc}</p><p className="text-xs text-gray-500">{product.ma_thuoc}</p></div></div></td>
                    <td className="px-6 py-4">{product.danh_muc}</td>
                    <td className="px-6 py-4 font-semibold">{product.so_luong_ton}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.trang_thai)}`}>{product.trang_thai}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-4 text-gray-500">
                        <Link to={`/admin/kho/${product.id}`} className="hover:text-blue-600" title="Xem chi tiết"><FontAwesomeIcon icon={faEye} /></Link>
                        <Link to={`/admin/kho/sua/${product.id}`} className="hover:text-green-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                        {product.trang_thai !== 'Ngừng kinh doanh' ? (
                          <button onClick={() => promptAction(product, 'archive')} className="hover:text-red-600" title="Ngừng kinh doanh"><FontAwesomeIcon icon={faArchive} /></button>
                        ) : (
                          <button onClick={() => promptAction(product, 'restore')} className="hover:text-green-600" title="Kinh doanh trở lại"><FontAwesomeIcon icon={faUndo} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center border-t">
          <span className="text-sm text-gray-700">Hiển thị <span className="font-semibold">{products.length}</span> trên <span className="font-semibold">{pagination.totalItems}</span> kết quả</span>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
      <ConfirmModal
        isOpen={actionInfo.isOpen}
        onClose={() => setActionInfo({ isOpen: false, product: null, type: '' })}
        onConfirm={handleActionConfirm}
        title={actionInfo.type === 'archive' ? "Xác nhận Ngừng kinh doanh" : "Xác nhận Kinh doanh trở lại"}
        message={`Bạn có chắc muốn ${actionInfo.type === 'archive' ? 'ngừng kinh doanh' : 'kinh doanh trở lại'} sản phẩm "${actionInfo.product?.ten_thuoc}" không?`}
      />
    </>
  );
}

export default WarehouseManagementPage;