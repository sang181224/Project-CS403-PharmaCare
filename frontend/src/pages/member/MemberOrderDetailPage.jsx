import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MemberOrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`http://localhost:3000/api/my/orders/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center">Đang tải...</div>;
    if (!order) return <div className="p-8 text-center">Không tìm thấy đơn hàng.</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Chi tiết Đơn hàng {order.ma_don_hang}</h2>
            <div className="space-y-4 text-sm">
                <p><span className="font-semibold">Ngày đặt:</span> {new Date(order.ngay_dat).toLocaleString('vi-VN')}</p>
                <p><span className="font-semibold">Địa chỉ giao:</span> {order.dia_chi_giao}</p>
                <p><span className="font-semibold">Trạng thái:</span> {order.trang_thai}</p>
            </div>
            <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Các sản phẩm đã mua:</h3>
                <ul className="divide-y divide-gray-200">
                    {order.items.map(item => (
                        <li key={item.id} className="flex items-center py-4">
                            <img src={item.hinh_anh} alt={item.ten_thuoc} className="w-16 h-16 rounded object-cover mr-4" />
                            <div className="flex-grow">
                                <p className="font-semibold">{item.ten_thuoc}</p>
                                <p className="text-sm text-gray-500">Số lượng: {item.so_luong}</p>
                            </div>
                            <p className="font-semibold">{Number(item.thanh_tien).toLocaleString('vi-VN')}đ</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-right font-bold text-xl mt-6">
                Tổng cộng: <span className="text-blue-600">{Number(order.tong_tien).toLocaleString('vi-VN')}đ</span>
            </div>
        </div>
    );
}

export default MemberOrderDetailPage;