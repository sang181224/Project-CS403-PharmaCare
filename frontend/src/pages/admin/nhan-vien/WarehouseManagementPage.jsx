import React, { useState, useEffect } from 'react'; // <-- Thêm useEffect
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';


function WarehouseManagementPage() {
  // Xóa dữ liệu mẫu, khởi tạo state là một mảng rỗng
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state cho trạng thái tải

  // Dùng useEffect để gọi API khi component được render lần đầu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        setProducts(data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        alert("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false); // Dừng trạng thái tải
      }
    };

    fetchProducts();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần
  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" không?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          // Cập nhật lại danh sách sản phẩm trên giao diện
          setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
        } else {
          alert('Lỗi: ' + result.error);
        }
      } catch (error) {
        alert('Lỗi kết nối đến server.');
      }
    }
  };
  if (loading) {
    return <div className="p-8">Đang tải dữ liệu kho...</div>;
  }

  // Hàm get màu cho status
  const getStatusColor = (status) => {
    if (status === 'Còn hàng') return 'bg-green-100 text-green-800';
    if (status === 'Sắp hết hàng') return 'bg-orange-100 text-orange-800';
    if (status === 'Hết hàng') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Kho</h1>
        <Link to="/admin/kho/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />Thêm sản phẩm mới
        </Link>
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
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={product.hinh_anh} alt={product.ten_thuoc} className="w-12 h-12 rounded-md object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{product.ten_thuoc}</p>
                        <p className="text-xs text-gray-500">{product.nha_san_xuat}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.danh_muc}</td>
                  <td className="px-6 py-4 font-semibold">{product.so_luong_ton}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.trang_thai)}`}>{product.trang_thai}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-4 text-gray-500">
                      <Link to={`/admin/kho/${product.id}`} className="hover:text-blue-600"><FontAwesomeIcon icon={faEye} /></Link>
                      <Link to={`/admin/kho/sua/${product.id}`} className="hover:text-green-600"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                      <button
                        onClick={() => handleDelete(product.id, product.ten_thuoc)}
                        className="hover:text-red-600"
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default WarehouseManagementPage;