import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination';

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
  const searchInputRef = useRef(null);
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Tự động focus vào ô input khi trang tải
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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

      const response = await fetch(`http://localhost:3000/api/products?${queryParams}`, {
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
      alert("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, filters.status, filters.category]);

  // Gọi API khi trang hoặc bộ lọc thay đổi
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

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" không?`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchProducts(pagination.currentPage);
        } else {
          alert('Lỗi: ' + result.error);
        }
      } catch (error) {
        alert('Lỗi kết nối.');
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Sắp hết hàng') return 'bg-orange-100 text-orange-800';
    if (status === 'Hết hàng') return 'bg-red-100 text-red-800';
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
          </select>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded-lg">
            <option value="">Tất cả danh mục</option>
            <option value="Thuốc giảm đau">Thuốc giảm đau</option>
            <option value="Thuốc tiêu hóa">Thuốc tiêu hóa</option>
            <option value="Vitamin">Vitamin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Sản phẩm</th>
                <th className="px-6 py-3">Danh mục</th>
                <th className="px-6 py-3">SL Tồn</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Đang tải...</td></tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={product.hinh_anh} alt={product.ten_thuoc} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{product.ten_thuoc}</p>
                          <p className="text-xs text-gray-500">{product.ma_thuoc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.danh_muc}</td>
                    <td className="px-6 py-4 font-semibold">{product.so_luong_ton}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.trang_thai)}`}>{product.trang_thai}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-4 text-gray-500">
                        <Link to={`/admin/kho/${product.id}`} className="hover:text-blue-600" title="Xem chi tiết"><FontAwesomeIcon icon={faEye} /></Link>
                        <Link to={`/admin/kho/sua/${product.id}`} className="hover:text-green-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                        <button onClick={() => handleDelete(product.id, product.ten_thuoc)} className="hover:text-red-600" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Không tìm thấy sản phẩm nào khớp với bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center border-t">
          <span className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold">{products.length}</span> trên <span className="font-semibold">{pagination.totalItems}</span> kết quả
          </span>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default WarehouseManagementPage;