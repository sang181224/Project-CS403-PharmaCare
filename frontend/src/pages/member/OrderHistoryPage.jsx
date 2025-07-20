import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const res = await fetch('http://localhost:3000/api/my/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setOrders(await res.json());
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    if (isLoading) {
        return <h2 className="text-2xl font-bold mb-4">Đang tải lịch sử đơn hàng...</h2>;
    }

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3">Mã ĐH</th>
                            <th className="p-3">Ngày đặt</th>
                            <th className="p-3">Tổng tiền</th>
                            <th className="p-3">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id} className="border-b">
                                    {/* 2. Sửa lại cột này */}
                                    <td className="p-3 font-medium">
                                        <Link to={`/tai-khoan/don-hang/${order.id}`} className="text-blue-600 hover:underline">
                                            {order.ma_don_hang}
                                        </Link>
                                    </td>
                                    <td className="p-3">{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</td>
                                    <td className="p-3 font-semibold">{Number(order.tong_tien).toLocaleString('vi-VN')}đ</td>
                                    <td className="p-3">{order.trang_thai}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-8 text-gray-500">Bạn chưa có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default OrderHistoryPage;