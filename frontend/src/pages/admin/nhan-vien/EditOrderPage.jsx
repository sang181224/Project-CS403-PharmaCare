import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Dữ liệu mẫu
const sampleOrder = {
    id: '#PC1258',
    status: 'Đang xử lý',
    customerName: 'Nguyễn Thị Cẩm Tú',
    address: '456 Lê Duẩn, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng',
};

function EditOrderPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Giả lập fetch dữ liệu
        setOrder(sampleOrder);
        setStatus(sampleOrder.status);
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Đã cập nhật trạng thái đơn hàng ${id} thành "${status}"`);
        navigate(`/admin/don-hang/${id}`); // Quay về trang chi tiết
    };

    if (!order) return <div>Đang tải...</div>;

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/don-hang" className="text-gray-500 hover:text-blue-600">Quản lý Đơn hàng</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Sửa đơn hàng {order.id}</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Sửa đơn hàng {order.id}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
                        <input type="text" value={order.customerName} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-200" readOnly />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Cập nhật trạng thái</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg">
                            <option>Đang xử lý</option>
                            <option>Đã xác nhận</option>
                            <option>Đang giao</option>
                            <option>Đã giao</option>
                            <option>Đã hủy</option>
                        </select>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to={`/admin/don-hang/${id}`} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy bỏ</Link>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditOrderPage;