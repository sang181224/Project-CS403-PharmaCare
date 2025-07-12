import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Dữ liệu mẫu
const sampleOrder = {
    id: '#PC1258',
    date: '10/07/2025',
    status: 'Đang xử lý',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    customer: {
        name: 'Nguyễn Thị Cẩm Tú',
        email: 'tuntc@email.com',
        phone: '0901 xxx xxx',
        address: '456 Lê Duẩn, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng',
    },
    items: [
        { id: 1, name: 'Paracetamol 500mg', quantity: 2, price: 15000, imageUrl: 'https://via.placeholder.com/100x100.png/EBF4FF/76A9FA?text=P' },
        { id: 2, name: 'Vitamin C 1000mg', quantity: 1, price: 45000, imageUrl: 'https://via.placeholder.com/100x100.png/ECFDF5/6EE7B7?text=V' },
    ],
    subtotal: 75000,
    shipping: 10000,
    total: 85000,
};

function OrderDetailPage() {
    const { id } = useParams(); // Lấy ID đơn hàng từ URL
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Trong thực tế, bạn sẽ fetch dữ liệu từ API dựa trên id
        setOrder(sampleOrder);
        setStatus(sampleOrder.status);
    }, [id]);

    if (!order) {
        return <div>Đang tải...</div>;
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/don-hang" className="text-gray-500 hover:text-blue-600">Quản lý Đơn hàng</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Chi tiết Đơn hàng {order.id}</span></li></ol></nav>
                    <h1 className="text-3xl font-bold text-gray-800">Chi tiết Đơn hàng {order.id}</h1>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50"><i className="fas fa-print mr-2"></i>In hóa đơn</button>
                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"><i className="fas fa-save mr-2"></i>Lưu thay đổi</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Các sản phẩm trong đơn</h2>
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="py-2">Sản phẩm</th><th className="py-2 text-center">Số lượng</th><th className="py-2 text-right">Thành tiền</th></tr></thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-4"><div className="flex items-center space-x-3"><img src={item.imageUrl} className="w-12 h-12 rounded-md" /><p className="font-medium">{item.name}</p></div></td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right font-semibold">{(item.quantity * item.price).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold"><td colSpan="2" className="pt-6 text-right">Tổng cộng:</td><td className="pt-6 text-right text-xl text-blue-600">{order.total.toLocaleString('vi-VN')}đ</td></tr>
                        </tfoot>
                    </table>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin đơn hàng</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Ngày đặt:</span><span className="font-medium">{order.date}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-500">Trạng thái:</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-lg text-sm focus:ring-blue-500 py-1"><option>Đang xử lý</option><option>Đang giao</option><option>Đã giao</option><option>Đã hủy</option></select></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin khách hàng</h2>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-base text-gray-900">{order.customer.name}</p>
                            <p className="text-gray-600">{order.customer.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetailPage;