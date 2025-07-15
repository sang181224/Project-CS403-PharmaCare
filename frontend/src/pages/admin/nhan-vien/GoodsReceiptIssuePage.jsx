import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function GoodsReceiptIssuePage() {
    const [activeTab, setActiveTab] = useState('nhap');
    const [receipts, setReceipts] = useState([]); // State cho phiếu nhập
    const [issues, setIssues] = useState([]); // State cho phiếu xuất
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                setIsLoading(true);
                // Dùng Promise.all để gọi cả 2 API cùng lúc cho hiệu quả
                const [receiptsRes, issuesRes] = await Promise.all([
                    fetch('http://localhost:3000/api/receipts', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:3000/api/issues', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const receiptsData = await receiptsRes.json();
                const issuesData = await issuesRes.json();

                if (receiptsRes.ok) setReceipts(receiptsData);
                if (issuesRes.ok) setIssues(issuesData);

            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="p-8">Đang tải...</div>

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Phiếu Nhập / Xuất Kho</h1>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('nhap')} className={`shrink-0 border-b-2 font-semibold p-4 text-sm ${activeTab === 'nhap' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Phiếu Nhập Kho</button>
                    <button onClick={() => setActiveTab('xuat')} className={`shrink-0 border-b-2 font-semibold p-4 text-sm ${activeTab === 'xuat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Phiếu Xuất Kho</button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'nhap' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Danh sách Phiếu Nhập</h2>
                        <Link to="/admin/phieu-nhap/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"><FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo Phiếu Nhập</Link>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3">Mã Phiếu</th><th className="px-6 py-3">Ngày Nhập</th><th className="px-6 py-3">Người Tạo</th><th className="px-6 py-3">Tổng Tiền</th><th className="px-6 py-3">Trạng thái</th></tr></thead>
                        <tbody>
                            {receipts.map(r => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-blue-600">
                                        <Link to={`/admin/phieu-nhap/${r.id}`} className="text-blue-600 hover:underline">
                                            {r.ma_phieu_nhap}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{new Date(r.ngay_nhap).toLocaleString('vi-VN')}</td>
                                    <td className="px-6 py-4">{r.ten_nhan_vien}</td>
                                    <td className="px-6 py-4 font-semibold">{Number(r.tong_tien).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{r.trang_thai}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'xuat' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Danh sách Phiếu Xuất</h2>
                        <Link to="/admin/phieu-xuat/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"><FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo Phiếu Xuất</Link>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3">Mã Phiếu</th><th className="px-6 py-3">Ngày Xuất</th><th className="px-6 py-3">Người Tạo</th><th className="px-6 py-3">Lý do</th><th className="px-6 py-3">Đơn hàng liên quan</th></tr></thead>
                        <tbody>
                            {issues.map(issue => (
                                <tr key={issue.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">
                                        <Link to={`/admin/phieu-xuat/${issue.id}`} className="text-blue-600 hover:underline">
                                            {issue.ma_phieu_xuat}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{new Date(issue.ngay_xuat).toLocaleString('vi-VN')}</td>
                                    <td className="px-6 py-4">{issue.ten_nhan_vien}</td>
                                    <td className="px-6 py-4">{issue.ly_do_xuat}</td>
                                    <td className="px-6 py-4">{issue.ma_don_hang || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default GoodsReceiptIssuePage;