import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../../components/Pagination'; // Import component phân trang

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

function InvoiceManagementPage() {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    const debouncedSearchTerm = useDebounce(filters.search, 500);

    const fetchInvoices = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams({
                search: debouncedSearchTerm,
                status: filters.status,
                page: page,
                limit: 10
            }).toString();

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setInvoices(result.data);
                setPagination(result.pagination);
            }
        } catch (error) { console.error("Lỗi:", error); }
        finally { setIsLoading(false); }
    }, [debouncedSearchTerm, filters.status]);

    useEffect(() => {
        fetchInvoices(pagination.currentPage);
    }, [fetchInvoices, pagination.currentPage]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setPagination(p => ({ ...p, currentPage: 1 }));
    };

    const handlePageChange = (pageNumber) => {
        setPagination(prev => ({ ...prev, currentPage: pageNumber }));
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Hóa đơn</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="search" placeholder="Tìm theo Số HĐ, Tên KH..." value={filters.search} onChange={handleFilterChange} className="w-full p-2 border rounded-lg" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded-lg">
                        <option value="">Tất cả trạng thái TT</option>
                        <option value="Đã thanh toán">Đã thanh toán</option>
                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm"><tr><th className="px-6 py-3">Số HĐ</th><th className="px-6 py-3">Đơn hàng gốc</th><th className="px-6 py-3">Khách hàng</th><th className="px-6 py-3">Ngày xuất</th><th className="px-6 py-3">Tổng tiền</th><th className="px-6 py-3">Trạng thái TT</th></tr></thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center p-8">Đang tải...</td></tr>
                            ) : invoices.map(invoice => (
                                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium"><Link to={`/admin/hoa-don/${invoice.id}`} className="text-blue-600 hover:underline">{invoice.so_hoa_don}</Link></td>
                                    <td className="px-6 py-4">{invoice.ma_don_hang}</td>
                                    <td className="px-6 py-4">{invoice.ten_khach_hang}</td>
                                    <td className="px-6 py-4">{new Date(invoice.ngay_xuat_hoa_don).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4 font-semibold">{Number(invoice.tong_tien).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${invoice.trang_thai === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{invoice.trang_thai}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                    <span className="text-sm">Hiển thị <span className="font-semibold">{invoices.length}</span> trên <span className="font-semibold">{pagination.totalItems}</span> kết quả</span>
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </>
    );
}

export default InvoiceManagementPage;