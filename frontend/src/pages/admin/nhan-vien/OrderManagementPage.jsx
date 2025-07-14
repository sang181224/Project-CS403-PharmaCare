import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

function OrderManagementPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/orders');
            const data = await response.json();
            if (response.ok) setOrders(data);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Hàm xử lý xóa đơn hàng
    const handleDelete = async (orderId, orderCode) => {
        if (window.confirm(`Bạn có chắc muốn xóa đơn hàng ${orderCode} không?`)) {
            try {
                const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    // Tải lại danh sách đơn hàng sau khi xóa thành công
                    fetchOrders();
                } else {
                    alert('Lỗi: ' + result.error);
                }
            } catch (error) {
                alert('Lỗi kết nối đến server.');
            }
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Đã giao') return 'bg-green-100 text-green-800';
        if (status === 'Đang xử lý') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Đang giao') return 'bg-blue-100 text-blue-800';
        if (status === 'Đã hủy') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    if (isLoading) {
        return <div className="p-8">Đang tải danh sách đơn hàng...</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
                <Link to="/admin/don-hang/tao-moi" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo đơn hàng mới
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Mã ĐH</th>
                                <th className="px-6 py-3">Khách hàng</th>
                                <th className="px-6 py-3">Ngày đặt</th>
                                <th className="px-6 py-3">Tổng tiền</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium"><Link to={`/admin/don-hang/${order.id}`} className="text-blue-600 hover:underline">{order.ma_don_hang}</Link></td>
                                    <td className="px-6 py-4">{order.ten_khach_hang}</td>
                                    <td className="px-6 py-4">{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4 font-semibold">{Number(order.tong_tien).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.trang_thai)}`}>{order.trang_thai}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                                            <Link to={`/admin/don-hang/${order.id}`} className="hover:text-blue-600" title="Xem chi tiết"><FontAwesomeIcon icon={faEye} /></Link>
                                            <Link to={`/admin/don-hang/sua/${order.id}`} className="hover:text-green-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                                            <button onClick={() => handleDelete(order.id, order.ma_don_hang)} className="hover:text-red-600" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default OrderManagementPage;