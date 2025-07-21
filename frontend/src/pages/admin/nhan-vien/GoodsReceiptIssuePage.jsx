import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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

function GoodsReceiptIssuePage() {
    const [activeTab, setActiveTab] = useState('nhap');

    // Quản lý state riêng cho từng tab
    const [receipts, setReceipts] = useState({ data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } });
    const [receiptsSearch, setReceiptsSearch] = useState('');

    const [issues, setIssues] = useState({ data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } });
    const [issuesSearch, setIssuesSearch] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    const debouncedReceiptsSearch = useDebounce(receiptsSearch, 500);
    const debouncedIssuesSearch = useDebounce(issuesSearch, 500);

    const fetchDataForTab = useCallback(async (tab, page = 1) => {
        setIsLoading(true);
        const endpoint = tab === 'nhap' ? 'receipts' : 'issues';
        const searchTerm = tab === 'nhap' ? debouncedReceiptsSearch : debouncedIssuesSearch;

        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams({ search: searchTerm, page: page, limit: 10 }).toString();

            const response = await fetch(`/api/api/${endpoint}?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                if (tab === 'nhap') setReceipts(result);
                else setIssues(result);
            } else {
                throw new Error(result.error || 'Lỗi không xác định');
            }
        } catch (error) {
            console.error(`Lỗi tải dữ liệu cho tab ${tab}:`, error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedReceiptsSearch, debouncedIssuesSearch]);

    // Tải dữ liệu khi component được mở hoặc khi chuyển tab hoặc khi tìm kiếm
    useEffect(() => {
        fetchDataForTab(activeTab, 1);
    }, [activeTab, fetchDataForTab]);

    const handlePageChange = (tab, page) => {
        fetchDataForTab(tab, page);
    };

    const renderTableContent = (data, type) => {
        if (isLoading) {
            return <tr><td colSpan="6" className="text-center p-8 text-gray-500">Đang tải...</td></tr>;
        }
        if (data.length === 0) {
            return <tr><td colSpan="6" className="text-center p-8 text-gray-500">Không tìm thấy dữ liệu.</td></tr>;
        }
        if (type === 'receipt') {
            return data.map(r => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium"><Link to={`/admin/phieu-nhap/${r.id}`} className="text-blue-600 hover:underline">{r.ma_phieu_nhap}</Link></td>
                    <td className="px-6 py-4">{r.ten_nha_cung_cap}</td>
                    <td className="px-6 py-4">{new Date(r.ngay_nhap).toLocaleString('vi-VN')}</td>
                    <td className="px-6 py-4 font-semibold">{Number(r.tong_tien).toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{r.trang_thai}</span></td>
                </tr>
            ));
        }
        if (type === 'issue') {
            return data.map(i => (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium"><Link to={`/admin/phieu-xuat/${i.id}`} className="text-blue-600 hover:underline">{i.ma_phieu_xuat}</Link></td>
                    <td className="px-6 py-4">{new Date(i.ngay_xuat).toLocaleString('vi-VN')}</td>
                    <td className="px-6 py-4">{i.ten_nhan_vien}</td>
                    <td className="px-6 py-4">{i.ly_do_xuat}</td>
                    <td className="px-6 py-4"><Link to={`/admin/don-hang/${i.id_don_hang}`} className="text-blue-600 hover:underline">{i.ma_don_hang || 'N/A'}</Link></td>
                </tr>
            ));
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Phiếu Nhập / Xuất Kho</h1>

            <div className="mb-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('nhap')} className={`shrink-0 border-b-2 font-semibold p-4 text-sm ${activeTab === 'nhap' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Phiếu Nhập Kho</button>
                    <button onClick={() => setActiveTab('xuat')} className={`shrink-0 border-b-2 font-semibold p-4 text-sm ${activeTab === 'xuat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Phiếu Xuất Kho</button>
                </nav>
            </div>

            {activeTab === 'nhap' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <input type="text" placeholder="Tìm theo Mã phiếu, NCC..." value={receiptsSearch} onChange={(e) => setReceiptsSearch(e.target.value)} className="p-2 border rounded-lg w-full max-w-xs" />
                        <Link to="/admin/phieu-nhap/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"><FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo Phiếu Nhập</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3">Mã Phiếu</th><th className="px-6 py-3">Nhà Cung Cấp</th><th className="px-6 py-3">Ngày Nhập</th><th className="px-6 py-3">Tổng Tiền</th><th className="px-6 py-3">Trạng thái</th></tr></thead>
                            <tbody>{renderTableContent(receipts.data, 'receipt')}</tbody>
                        </table>
                    </div>
                    <div className="p-4 flex justify-between items-center border-t">
                        <span className="text-sm">Hiển thị <span className="font-semibold">{receipts.data.length}</span> trên <span className="font-semibold">{receipts.pagination.totalItems}</span></span>
                        <Pagination currentPage={receipts.pagination.currentPage} totalPages={receipts.pagination.totalPages} onPageChange={(p) => handlePageChange('nhap', p)} />
                    </div>
                </div>
            )}

            {activeTab === 'xuat' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <input type="text" placeholder="Tìm theo Mã phiếu, Mã ĐH..." value={issuesSearch} onChange={(e) => setIssuesSearch(e.target.value)} className="p-2 border rounded-lg w-full max-w-xs" />
                        <Link to="/admin/phieu-xuat/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"><FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo Phiếu Xuất</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3">Mã Phiếu</th><th className="px-6 py-3">Ngày Xuất</th><th className="px-6 py-3">Người Tạo</th><th className="px-6 py-3">Lý do</th><th className="px-6 py-3">Đơn hàng liên quan</th></tr></thead>
                            <tbody>{renderTableContent(issues.data, 'issue')}</tbody>
                        </table>
                    </div>
                    <div className="p-4 flex justify-between items-center border-t">
                        <span className="text-sm">Hiển thị <span className="font-semibold">{issues.data.length}</span> trên <span className="font-semibold">{issues.pagination.totalItems}</span></span>
                        <Pagination currentPage={issues.pagination.currentPage} totalPages={issues.pagination.totalPages} onPageChange={(p) => handlePageChange('xuat', p)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default GoodsReceiptIssuePage;