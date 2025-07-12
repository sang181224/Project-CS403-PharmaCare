import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu ban đầu
const initialOrders = [
    { id: '#PC1258', customer: 'Nguyễn Thị Cẩm Tú', date: '10/07/2025', total: '85.000đ', status: 'Đang xử lý', statusColor: 'bg-yellow-100 text-yellow-800' },
    { id: '#PC1257', customer: 'Lê Minh Anh', date: '09/07/2025', total: '210.000đ', status: 'Đang giao', statusColor: 'bg-blue-100 text-blue-800' },
    { id: '#PC1256', customer: 'Phạm Hoàng Khang', date: '09/07/2025', total: '45.000đ', status: 'Đã giao', statusColor: 'bg-green-100 text-green-800' },
    { id: '#PC1255', customer: 'Vũ Ngọc Mai', date: '08/07/2025', total: '320.000đ', status: 'Đã hủy', statusColor: 'bg-red-100 text-red-800' },
];

function OrderManagementPage() {
    // State để lưu danh sách đơn hàng
    const [orders, setOrders] = useState(initialOrders);

    // State cho các bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Hàm xử lý khi bấm nút xóa
    const handleDelete = (orderId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderId} không?`)) {
            // Lọc ra các đơn hàng không bị xóa và cập nhật lại state
            setOrders(currentOrders => currentOrders.filter(order => order.id !== orderId));
        }
    };

    // Lọc danh sách đơn hàng dựa trên các state của bộ lọc
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                // Lọc theo status
                return statusFilter ? order.status === statusFilter : true;
            })
            .filter(order => {
                // Lọc theo search term (tìm kiếm trong ID và tên khách hàng)
                const term = searchTerm.toLowerCase();
                return order.id.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term);
            });
    }, [orders, searchTerm, statusFilter]);

    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
                    <p className="text-gray-600 mt-1">Xem, tìm kiếm và cập nhật trạng thái các đơn hàng.</p>
                </div>
                {/* Sửa lại link cho đúng */}
                <Link to="/admin/don-hang/tao-moi" className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Tạo đơn hàng mới</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <input
                        type="text"
                        placeholder="Tìm theo Mã ĐH, Tên KH..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã giao">Đã giao</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
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
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium"><Link to={`/admin/don-hang/${order.id.replace('#', '')}`} className="text-blue-600 hover:underline">{order.id}</Link></td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4 font-semibold">{order.total}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}>{order.status}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                                            <Link to={`/admin/don-hang/${order.id.replace('#', '')}`} className="hover:text-blue-600" title="Xem chi tiết"><FontAwesomeIcon icon={faEye} /></Link>
                                            <Link to={`/admin/don-hang/sua/${order.id.replace('#', '')}`} className="hover:text-green-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                                            <button onClick={() => handleDelete(order.id)} className="hover:text-red-600" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
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