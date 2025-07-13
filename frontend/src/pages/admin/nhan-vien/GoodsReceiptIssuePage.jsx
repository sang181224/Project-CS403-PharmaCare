import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu
const sampleReceipts = [
    { id: '#PN102', supplier: 'Dược Hậu Giang', date: '10/07/2025', createdBy: 'Trần Thị B', total: '15.500.000đ', status: 'Hoàn thành', statusColor: 'bg-green-100 text-green-800' },
    { id: '#PN101', supplier: 'Traphaco', date: '05/07/2025', createdBy: 'Trần Thị B', total: '8.200.000đ', status: 'Hoàn thành', statusColor: 'bg-green-100 text-green-800' },
];

const sampleIssues = [
    { id: '#PX305', orderId: '#PC1258', date: '11/07/2025', createdBy: 'Trần Thị B', reason: 'Xuất bán cho khách' },
];

function GoodsReceiptIssuePage() {
    const [activeTab, setActiveTab] = useState('nhap'); // 'nhap' hoặc 'xuat'

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Phiếu Nhập / Xuất Kho</h1>
                <p className="text-gray-600 mt-1">Tạo và theo dõi các chứng từ nhập, xuất hàng hóa.</p>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('nhap')} className={`shrink-0 border-b-2 font-semibold p-4 rounded-t-lg text-sm ${activeTab === 'nhap' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
                        Phiếu Nhập Kho
                    </button>
                    <button onClick={() => setActiveTab('xuat')} className={`shrink-0 border-b-2 font-semibold p-4 rounded-t-lg text-sm ${activeTab === 'xuat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
                        Phiếu Xuất Kho
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'nhap' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Danh sách Phiếu Nhập</h2>
                        <Link to="/admin/phieu-nhap/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo Phiếu Nhập
                        </Link>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Mã Phiếu</th>
                                <th className="px-6 py-3">Nhà Cung Cấp</th>
                                <th className="px-6 py-3">Ngày Nhập</th>
                                <th className="px-6 py-3">Tổng Tiền</th>
                                <th className="px-6 py-3">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleReceipts.map(r =>
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{r.id}</td>
                                    <td className="px-6 py-4">{r.supplier}</td>
                                    <td className="px-6 py-4">{r.date}</td>
                                    <td className="px-6 py-4 font-semibold">{r.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${r.statusColor}`}>{r.status}</span>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'xuat' && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Danh sách Phiếu Xuất</h2>
                        <Link to="/admin/phieu-xuat/them" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo Phiếu Xuất
                        </Link>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Mã Phiếu</th>
                                <th className="px-6 py-3">Đơn hàng liên quan</th>
                                <th className="px-6 py-3">Ngày Xuất</th>
                                <th className="px-6 py-3">Lý do</th>
                            </tr>
                        </thead>
                        <tbody>{sampleIssues.map(i =>
                            <tr key={i.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{i.id}</td>
                                <td className="px-6 py-4">
                                    <Link to={`/admin/don-hang/${i.orderId.replace('#', '')}`} className="text-blue-600 hover:underline">{i.orderId}</Link>
                                </td>
                                <td className="px-6 py-4">{i.date}</td>
                                <td className="px-6 py-4">{i.reason}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default GoodsReceiptIssuePage;