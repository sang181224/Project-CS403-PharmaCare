import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EditOrderPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/api/orders/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                    setStatus(data.trang_thai); // Set trạng thái ban đầu cho dropdown
                }
            } catch (error) {
                console.error("Lỗi khi tải đơn hàng:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: status }) // Chỉ gửi trạng thái mới
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate(`/admin/don-hang`); // Quay về trang danh sách
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối server.');
        }
    };

    if (isLoading) return <div className="p-8">Đang tải...</div>;
    if (!order) return <div className="p-8">Không tìm thấy đơn hàng.</div>;

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Sửa đơn hàng {order.ma_don_hang}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Khách hàng</label>
                        <p className="font-semibold text-lg mt-1">{order.ten_khach_hang}</p>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Cập nhật trạng thái</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
                            <option>Đang xử lý</option>
                            <option>Đã xác nhận</option>
                            <option>Đang giao</option>
                            <option>Đã giao</option>
                            <option>Đã hủy</option>
                        </select>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/don-hang" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Hủy bỏ
                        </Link>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditOrderPage;