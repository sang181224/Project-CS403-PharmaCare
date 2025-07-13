import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu
const initialSuppliers = [
    { id: 1, name: 'Công ty Cổ phần Traphaco', contactPerson: 'Nguyễn Minh Tuấn', phone: '0987 654 321', email: 'tuan.nm@traphaco.com' },
    { id: 2, name: 'Công ty Cổ phần Dược Hậu Giang', contactPerson: 'Trần Lan Anh', phone: '0912 345 678', email: 'anh.tl@dhgpharma.com.vn' },
    { id: 3, name: 'Stada Việt Nam', contactPerson: 'Lê Hoàng Nam', phone: '0935 111 222', email: 'nam.lh@stada.vn' },
];

function SupplierManagementPage() {
    const [suppliers, setSuppliers] = useState(initialSuppliers);

    const handleDelete = (supplierId, supplierName) => {
        if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplierName}" không?`)) {
            setSuppliers(currentSuppliers => currentSuppliers.filter(s => s.id !== supplierId));
        }
    };

    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhà cung cấp</h1>
                    <p className="text-gray-600 mt-1">Thêm, sửa và quản lý thông tin các nhà cung cấp.</p>
                </div>
                <Link to="/admin/nha-cung-cap/them" className="w-full sm:w-auto mt-4 sm:mt-0 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Thêm nhà cung cấp</span>
                </Link>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Tên Nhà cung cấp</th>
                                <th className="px-6 py-3">Người liên lạc</th>
                                <th className="px-6 py-3">Số điện thoại</th>
                                <th className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                                    <td className="px-6 py-4">{supplier.contactPerson}</td>
                                    <td className="px-6 py-4">{supplier.phone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                                            <Link to={`/admin/nha-cung-cap/sua/${supplier.id}`} className="hover:text-purple-600" title="Sửa">
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </Link>
                                            <button onClick={() => handleDelete(supplier.id, supplier.name)} className="hover:text-red-600" title="Xóa">
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

export default SupplierManagementPage;