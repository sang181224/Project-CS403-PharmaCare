import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function InvoiceDetailPage() {
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchInvoiceDetail = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`http://localhost:3000/api/invoices/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setInvoice(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoiceDetail();
    }, [id]);

    if (isLoading) return <div className="p-8">Đang tải chi tiết hóa đơn...</div>;
    if (!invoice) return <div className="p-8">Không tìm thấy hóa đơn.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hóa đơn bán hàng</h1>
                        <p className="text-gray-500">Số HĐ: {invoice.so_hoa_don}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Ngày xuất: {new Date(invoice.ngay_xuat_hoa_don).toLocaleDateString('vi-VN')}</p>
                        <p className="text-sm text-gray-600">Đơn hàng gốc: {invoice.ma_don_hang}</p>
                    </div>
                </div>
                <div className="border-t border-b py-4 my-4">
                    <h2 className="font-bold">Khách hàng: {invoice.ten_khach_hang}</h2>
                </div>
                <table className="w-full text-left mb-6">
                    <thead><tr className="border-b"><th className="py-2">Sản phẩm</th><th className="py-2 text-center">Số lượng</th><th className="py-2 text-right">Đơn giá</th><th className="py-2 text-right">Thành tiền</th></tr></thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id}><td className="py-2">{item.ten_san_pham}</td><td className="py-2 text-center">{item.so_luong}</td><td className="py-2 text-right">{Number(item.don_gia).toLocaleString('vi-VN')}đ</td><td className="py-2 text-right">{Number(item.thanh_tien).toLocaleString('vi-VN')}đ</td></tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-right">
                    <p className="text-lg font-bold">Tổng cộng: <span className="text-blue-600">{Number(invoice.tong_tien).toLocaleString('vi-VN')}đ</span></p>
                    <p className="text-sm text-green-600 font-semibold mt-2">Trạng thái: {invoice.trang_thai}</p>
                </div>
                <div className="mt-8 text-center">
                    <Link to="/admin/hoa-don" className="text-blue-600 hover:underline">&larr; Quay lại danh sách hóa đơn</Link>
                </div>
            </div>
        </div>
    );
}
export default InvoiceDetailPage;