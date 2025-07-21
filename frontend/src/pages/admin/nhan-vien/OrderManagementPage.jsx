import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination'; // Đảm bảo đường dẫn này đúng
import toast from 'react-hot-toast';

// Custom hook để trì hoãn việc tìm kiếm
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

function OrderManagementPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        date_from: '',
        date_to: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    const searchInputRef = useRef(null);
    const debouncedSearchTerm = useDebounce(filters.search, 500);

    // Tự động focus vào ô input khi trang tải
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const fetchOrders = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams({
                search: debouncedSearchTerm,
                status: filters.status,
                date_from: filters.date_from,
                date_to: filters.date_to,
                page: page,
                limit: 10
            }).toString();

            const response = await fetch(`/api/api/orders?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setOrders(result.data);
                setPagination(result.pagination);
            } else {
                throw new Error(result.error || 'Lỗi không xác định');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, filters.status, filters.date_from, filters.date_to]);

    // Gọi API khi trang hoặc bộ lọc thay đổi
    useEffect(() => {
        fetchOrders(pagination.currentPage);
    }, [fetchOrders, pagination.currentPage]);

    // Reset về trang 1 khi người dùng thay đổi bộ lọc
    useEffect(() => {
        setPagination(p => ({ ...p, currentPage: 1 }));
    }, [debouncedSearchTerm, filters.status, filters.date_from, filters.date_to]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePageChange = (pageNumber) => {
        setPagination(prev => ({ ...prev, currentPage: pageNumber }));
    };

    const handleDelete = async (orderId, orderCode) => {
        if (window.confirm(`Bạn có chắc muốn xóa đơn hàng ${orderCode}?`)) {
            // Logic xóa đơn hàng...
            toast.success(`Đã xóa đơn hàng ${orderCode}`);
            fetchOrders(pagination.currentPage);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Đã giao') return 'bg-green-100 text-green-800';
        if (status === 'Đang xử lý') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Đang giao') return 'bg-blue-100 text-blue-800';
        if (status === 'Đã hủy') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
                <Link to="/admin/don-hang/tao-moi" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />Tạo đơn hàng mới
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input ref={searchInputRef} type="text" name="search" placeholder="Tìm theo Mã ĐH, Tên KH..." value={filters.search} onChange={handleFilterChange} className="w-full p-2 border rounded-lg" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded-lg">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã giao">Đã giao</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                    <input type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} className="w-full p-2 border rounded-lg text-gray-500" />
                    <input type="date" name="date_to" value={filters.date_to} onChange={handleFilterChange} className="w-full p-2 border rounded-lg text-gray-500" />
                </div>
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
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Đang tải...</td></tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
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
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                    <span className="text-sm text-gray-700">
                        Hiển thị <span className="font-semibold">{orders.length}</span> trên tổng số <span className="font-semibold">{pagination.totalItems}</span> đơn hàng
                    </span>
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
}

export default OrderManagementPage;