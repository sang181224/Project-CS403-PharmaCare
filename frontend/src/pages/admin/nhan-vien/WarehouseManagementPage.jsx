import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// --- Custom hook để trì hoãn việc tìm kiếm (Debouncing) ---
// Giúp tránh gửi yêu cầu đến server mỗi khi người dùng gõ một ký tự
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Hủy bỏ timeout nếu value thay đổi (người dùng tiếp tục gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function WarehouseManagementPage() {
  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Sử dụng custom hook để tạo giá trị debounce cho searchTerm
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Trì hoãn 500ms

  // Hàm để lấy danh sách sản phẩm từ API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      // Thêm từ khóa tìm kiếm vào URL
      const response = await fetch(`http://localhost:3000/api/products?search=${debouncedSearchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error("Lỗi khi tải sản phẩm:", data.error);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]); // Hàm này sẽ được tạo lại khi debouncedSearchTerm thay đổi

  // Gọi hàm fetchProducts mỗi khi debouncedSearchTerm thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Hàm xử lý việc xóa sản phẩm
  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" không? Thao tác này không thể hoàn tác.`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchProducts(); // Tải lại danh sách sản phẩm sau khi xóa thành công
        } else {
          alert('Lỗi: ' + result.error);
        }
      } catch (error) {
        alert('Lỗi kết nối đến server.');
      }
    }
  };

  // Hàm để lấy màu cho trạng thái sản phẩm
  const getStatusColor = (status) => {
    if (status === 'Sắp hết hàng') return 'bg-orange-100 text-orange-800';
    if (status === 'Hết hàng') return 'bg-red-100 text-red-800';
    // Mặc định là 'Còn hàng'
    return 'bg-green-100 text-green-800';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Kho</h1>
          <p className="text-gray-600 mt-1">Theo dõi, tìm kiếm và quản lý tất cả sản phẩm.</p>
        </div>
        <Link to="/admin/kho/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <input
          type="text"
          placeholder="Tìm sản phẩm theo Tên hoặc Mã..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default WarehouseManagementPage;