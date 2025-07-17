import React, { useState, useEffect } from 'react';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchMyOrders = async () => {
            const res = await fetch('http://localhost:3000/api/my/orders', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            if (res.ok) setOrders(await res.json());
        };
        fetchMyOrders();
    }, []);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
            <table className="w-full text-left">
                <thead className="bg-gray-50"><tr><th className="p-3">Mã ĐH</th><th className="p-3">Ngày đặt</th><th className="p-3">Tổng tiền</th><th className="p-3">Trạng thái</th></tr></thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="border-b">
                            <td className="p-3 font-medium text-blue-600">{order.ma_don_hang}</td>
                            <td className="p-3">{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</td>
                            <td className="p-3 font-semibold">{Number(order.tong_tien).toLocaleString('vi-VN')}đ</td>
                            <td className="p-3">{order.trang_thai}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
export default OrderHistoryPage;