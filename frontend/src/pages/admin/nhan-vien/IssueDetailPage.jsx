import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function IssueDetailPage() {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);

    useEffect(() => {
        const fetchIssue = async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3000/api/issues/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setIssue(data);
        };
        fetchIssue();
    }, [id]);

    if (!issue) return <div className="p-8">Đang tải chi tiết phiếu xuất...</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Chi tiết Phiếu xuất {issue.ma_phieu_xuat}</h1>
                <button className="bg-white border py-2 px-4 rounded-lg"><i className="fas fa-print mr-2"></i>In phiếu</button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-2 gap-8 pb-8 border-b">
                    <div>
                        <p className="text-sm text-gray-500">Lý do xuất:</p>
                        <p className="font-bold text-lg">{issue.ly_do_xuat}</p>
                        {issue.ma_don_hang && (
                            <p className="text-sm text-gray-500 mt-2">Đơn hàng liên quan: <span className="font-semibold text-blue-600">{issue.ma_don_hang}</span></p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Ngày xuất:</p>
                        <p className="font-semibold">{new Date(issue.ngay_xuat).toLocaleString('vi-VN')}</p>
                        <p className="text-sm text-gray-500 mt-2">Người tạo: <span className="font-semibold">{issue.ten_nhan_vien}</span></p>
                    </div>
                </div>
                <div className="py-8">
                    <h3 className="text-lg font-bold mb-4">Chi tiết hàng hóa đã xuất:</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3">Sản phẩm</th><th className="px-6 py-3">Mã Lô</th><th className="px-6 py-3">Số lượng xuất</th></tr></thead>
                        <tbody>
                            {issue.items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-6 py-4">{item.ten_thuoc}</td>
                                    <td className="px-6 py-4">{item.ma_lo_thuoc}</td>
                                    <td className="px-6 py-4">{item.so_luong_xuat}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default IssueDetailPage;