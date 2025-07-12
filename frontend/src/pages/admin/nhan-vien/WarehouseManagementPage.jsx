import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu ban đầu
const initialProducts = [
  { id: 'PARA500', name: 'Paracetamol 500mg', manufacturer: 'Traphaco', category: 'Thuốc giảm đau', stock: 250, status: 'Còn hàng', statusColor: 'bg-green-100 text-green-800', imageUrl: 'https://via.placeholder.com/100x100.png/EBF4FF/76A9FA?text=P' },
  { id: 'BER10', name: 'Berberin 10mg', manufacturer: 'DHG Pharma', category: 'Thuốc tiêu hóa', stock: 15, status: 'Sắp hết hàng', statusColor: 'bg-orange-100 text-orange-800', imageUrl: 'https://via.placeholder.com/100x100.png/FEF3C7/FBBF24?text=B' },
  { id: 'VITC1000', name: 'Vitamin C 1000mg', manufacturer: 'DHG Pharma', category: 'Vitamin', stock: 0, status: 'Hết hàng', statusColor: 'bg-red-100 text-red-800', imageUrl: 'https://via.placeholder.com/100x100.png/ECFDF5/6EE7B7?text=V' },
];

function WarehouseManagementPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleDelete = (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" không?`)) {
      setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => statusFilter ? p.status === statusFilter : true)
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, searchTerm, statusFilter]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Kho</h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý số lượng tồn kho của các sản phẩm.</p>
        </div>
        <Link to="/admin/kho/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <FontAwesomeIcon icon={faPlus} />
          <span>Thêm sản phẩm mới</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input 
            type="text" 
            placeholder="Tìm theo Mã, Tên thuốc..." 
            className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Còn hàng">Còn hàng</option>
            <option value="Sắp hết hàng">Sắp hết hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.manufacturer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-semibold">{product.stock}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${product.statusColor}`}>{product.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-4 text-gray-500">
                      <Link to={`/admin/kho/${product.id}`} className="hover:text-blue-600" title="Xem chi tiết lô hàng"><FontAwesomeIcon icon={faEye} /></Link>
                      <Link to={`/admin/kho/sua/${product.id}`} className="hover:text-green-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                      <button onClick={() => handleDelete(product.id, product.name)} className="hover:text-red-600" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
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