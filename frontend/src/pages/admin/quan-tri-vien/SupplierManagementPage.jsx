import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination';
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

function SupplierManagementPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchSuppliers = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams({ search: debouncedSearchTerm, page: page, limit: 10 }).toString();
            const response = await fetch(`/api/api/admin/suppliers?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setSuppliers(result.data);
                setPagination(result.pagination);
            }
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchSuppliers(pagination.currentPage);
    }, [fetchSuppliers, pagination.currentPage]);

    const handleDelete = async (supplierId, supplierName) => {
        if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplierName}"?`)) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`/api/api/admin/suppliers/${supplierId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (response.ok) {
                    toast.success(result.message);
                } else {
                    toast.error(result.error);
                }
                if (response.ok) fetchSuppliers(1); // Tải lại danh sách từ trang 1
            } catch (error) {
                toast.error('Lỗi kết nối đến server.');
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setPagination(prev => ({ ...prev, currentPage: pageNumber }));
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhà cung cấp</h1>
                <Link to="/admin/nha-cung-cap/them" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />Thêm mới
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg mb-8">
                <input
                    type="text"
                    placeholder="Tìm theo tên, email, SĐT nhà cung cấp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm">
                            <tr>
                                <th className="px-6 py-3">Tên Nhà cung cấp</th>
                                <th className="px-6 py-3">Người liên lạc</th>
                                <th className="px-6 py-3">Số điện thoại</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Đang tải...</td></tr>
                            ) : suppliers.length > 0 ? (
                                suppliers.map(s => (
                                    <tr key={s.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{s.ten_nha_cung_cap}</td>
                                        <td className="px-6 py-4">{s.nguoi_lien_lac}</td>
                                        <td className="px-6 py-4">{s.so_dien_thoai}</td>
                                        <td className="px-6 py-4">{s.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-4 text-gray-500">
                                                <Link to={`/admin/nha-cung-cap/sua/${s.id}`} className="hover:text-purple-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                                                <button onClick={() => handleDelete(s.id, s.ten_nha_cung_cap)} className="hover:text-red-600" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Không tìm thấy nhà cung cấp nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                    <span className="text-sm text-gray-700">Hiển thị <span className="font-semibold">{suppliers.length}</span> trên <span className="font-semibold">{pagination.totalItems}</span></span>
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </>
    );
}
export default SupplierManagementPage;