import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ReceiptDetailPage() {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/receipts/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setReceipt(data);
        };
        fetchReceipt();
    }, [id]);

    if (!receipt) return <div className="p-8">Đang tải...</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Chi tiết Phiếu nhập {receipt.ma_phieu_nhap}</h1>
                <button className="bg-white border py-2 px-4 rounded-lg"><i className="fas fa-print mr-2"></i>In phiếu</button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-2 gap-8 pb-8 border-b">
                    <div>
                        <p className="text-sm text-gray-500">Từ Nhà cung cấp:</p>
                        <p className="font-bold text-lg">{receipt.ten_nha_cung_cap || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Ngày nhập:</p>
                        <p className="font-semibold">{new Date(receipt.ngay_nhap).toLocaleString('vi-VN')}</p>
                        <p className="text-sm text-gray-500 mt-2">Người tạo: <span className="font-semibold">{receipt.ten_nhan_vien}</span></p>
                    </div>
                </div>
                <div className="py-8">
                    <h3 className="text-lg font-bold mb-4">Chi tiết hàng hóa:</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3">Sản phẩm</th><th className="px-6 py-3">Mã Lô</th><th className="px-6 py-3">Số lượng</th><th className="px-6 py-3 text-right">Đơn giá</th><th className="px-6 py-3 text-right">Thành tiền</th></tr></thead>
                        <tbody>
                            {receipt.items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-6 py-4">{item.ten_thuoc}</td>
                                    <td className="px-6 py-4">{item.ma_lo_thuoc}</td>
                                    <td className="px-6 py-4">{item.so_luong_nhap}</td>
                                    <td className="px-6 py-4 text-right">{Number(item.don_gia_nhap).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4 text-right font-semibold">{Number(item.thanh_tien).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot><tr className="font-bold text-xl"><td colSpan="4" className="pt-4 text-right">Tổng cộng:</td><td className="pt-4 text-right">{Number(receipt.tong_tien).toLocaleString('vi-VN')}đ</td></tr></tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ReceiptDetailPage;