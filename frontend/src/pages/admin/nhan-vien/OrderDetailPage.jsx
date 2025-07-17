import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

// Hàm lấy màu cho trạng thái
const getStatusColor = (status) => {
    if (status === 'Đã giao') return 'bg-green-100 text-green-800';
    if (status === 'Đang xử lý') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Đang giao') return 'bg-blue-100 text-blue-800';
    if (status === 'Đã hủy') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
};

function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/orders/${id}`);
                const data = await response.json();
                if (response.ok) setOrder(data);
                else throw new Error(data.error);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);
    const handleCreateInvoice = async () => {
        if (!window.confirm('Bạn có chắc muốn xuất hóa đơn cho đơn hàng này?')) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3000/api/orders/${id}/create-invoice`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Chuyển hướng đến trang chi tiết hóa đơn vừa tạo
                navigate(`/admin/hoa-don/${result.invoiceId}`);
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error) {
            alert('Lỗi kết nối.');
        }
    };
    if (isLoading) return <div className="p-8">Đang tải...</div>;
    if (!order) return <div className="p-8">Không tìm thấy đơn hàng.</div>;

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Chi tiết Đơn hàng {order.ma_don_hang}</h1>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button onClick={handleCreateInvoice} className="bg-white border text-gray-700 font-bold py-2 px-4 rounded-lg">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />Xuất Hóa đơn
                    </button>
                    <Link to={`/admin/don-hang/sua/${order.id}`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                        <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />Sửa đơn hàng
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Các sản phẩm trong đơn</h2>

                    {/* ===== PHẦN HIỂN THỊ SẢN PHẨM BỊ THIẾU NẰM Ở ĐÂY ===== */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-sm">
                                <tr>
                                    <th className="py-2 px-4">Sản phẩm</th>
                                    <th className="py-2 px-4 text-center">Số lượng</th>
                                    <th className="py-2 px-4 text-right">Đơn giá</th>
                                    <th className="py-2 px-4 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map(item => (
                                    <tr key={item.id} className="border-b">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img src={item.hinh_anh || 'https://via.placeholder.com/100'} alt={item.ten_thuoc} className="w-12 h-12 rounded-md object-cover" />
                                                <p className="font-medium">{item.ten_thuoc}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">{item.so_luong}</td>
                                        <td className="py-4 px-4 text-right">{Number(item.don_gia).toLocaleString('vi-VN')}đ</td>
                                        <td className="py-4 px-4 text-right font-semibold">{Number(item.thanh_tien).toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold">
                                    <td colSpan="3" className="pt-4 px-4 text-right">Tổng cộng:</td>
                                    <td className="pt-4 px-4 text-right text-xl text-blue-600">{Number(order.tong_tien).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Ngày đặt:</span><span className="font-medium">{new Date(order.ngay_dat).toLocaleString('vi-VN')}</span></div>
                            <div className="flex justify-between items-center">
                                <span>Trạng thái:</span>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.trang_thai)}`}>
                                    {order.trang_thai}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-base">{order.ten_khach_hang}</p>
                            <p className="text-gray-600">{order.dia_chi_giao}</p>
                            <p className="text-gray-600">{order.so_dien_thoai}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetailPage;