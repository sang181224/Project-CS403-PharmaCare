import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

function SupplierManagementPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSuppliers = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/admin/suppliers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setSuppliers(data);
            } else {
                throw new Error(data.error || 'Không thể tải danh sách nhà cung cấp.');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    // TODO: Thêm hàm handleDelete sau khi có API xóa

    if (isLoading) return <div className="p-8">Đang tải...</div>;
    const handleDelete = async (supplierId, supplierName) => {
        if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplierName}"?`)) {
            const res = await fetch(`http://localhost:3000/api/admin/suppliers/${supplierId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            const result = await res.json();
            alert(result.message || result.error);
            if (res.ok) fetchSuppliers(); // Tải lại danh sách
        }
    };
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhà cung cấp</h1>
                <Link to="/admin/nha-cung-cap/them" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Thêm nhà cung cấp
                </Link>
            </div>

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
                                    <td className="px-6 py-4 font-medium text-gray-900">{supplier.ten_nha_cung_cap}</td>
                                    <td className="px-6 py-4">{supplier.nguoi_lien_lac}</td>
                                    <td className="px-6 py-4">{supplier.so_dien_thoai}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                                            <Link to={`/admin/nha-cung-cap/sua/${supplier.id}`} className="hover:text-purple-600" title="Sửa">
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </Link>
                                            <button onClick={() => handleDelete(supplier.id, supplier.ten_nha_cung_cap)} className="hover:text-red-600" title="Xóa">
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