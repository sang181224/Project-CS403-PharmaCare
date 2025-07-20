import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPencilAlt, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination';
import ConfirmModal from '../../../components/ConfirmModal';
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

function EmployeeManagementPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const debouncedSearchTerm = useDebounce(filters.search, 500);

    // State để quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToAction, setEmployeeToAction] = useState(null);

    const fetchEmployees = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams({
                search: debouncedSearchTerm,
                status: filters.status,
                page: page,
                limit: 10
            }).toString();

            const response = await fetch(`http://localhost:3000/api/admin/employees?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setEmployees(result.data);
                setPagination(result.pagination);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error(error.message || "Không thể tải danh sách nhân viên.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, filters.status]);

    useEffect(() => {
        fetchEmployees(pagination.currentPage);
    }, [fetchEmployees, pagination.currentPage]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setPagination(p => ({ ...p, currentPage: 1 }));
    };

    const handlePageChange = (pageNumber) => {
        setPagination(prev => ({ ...prev, currentPage: pageNumber }));
    };

    // Hàm được gọi khi người dùng bấm "Xác nhận" trên Modal
    const handleStatusConfirm = async () => {
        if (!employeeToAction) return;

        const newStatus = employeeToAction.trang_thai === 'hoat_dong' ? 'tam_khoa' : 'hoat_dong';

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3000/api/admin/employees/${employeeToAction.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ trang_thai: newStatus })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchEmployees(pagination.currentPage);
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến server.');
        } finally {
            setIsModalOpen(false);
            setEmployeeToAction(null);
        }
    };

    // Hàm được gọi khi bấm icon Khóa/Mở khóa
    const promptStatusChange = (employee) => {
        setEmployeeToAction(employee);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhân viên</h1>
                    <p className="text-gray-600 mt-1">Thêm, sửa và quản lý tài khoản nhân viên.</p>
                </div>
                <Link to="/admin/nhan-vien/them" className="w-full sm:w-auto mt-4 sm:mt-0 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>Thêm nhân viên mới</span>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="search" placeholder="Tìm theo tên hoặc email..." value={filters.search} onChange={handleFilterChange} className="w-full p-2 border rounded-lg" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded-lg">
                        <option value="">Tất cả trạng thái</option>
                        <option value="hoat_dong">Đang hoạt động</option>
                        <option value="tam_khoa">Tạm khóa</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm uppercase text-gray-700">
                            <tr><th className="px-6 py-3">Nhân viên</th><th className="px-6 py-3">Vai trò</th><th className="px-6 py-3">Ngày tạo</th><th className="px-6 py-3">Trạng thái</th><th className="px-6 py-3 text-center">Hành động</th></tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Đang tải...</td></tr>
                            ) : employees.length > 0 ? (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold uppercase">{employee.hoTen.charAt(0)}</div>
                                                <div><p className="font-medium">{employee.hoTen}</p><p className="text-xs text-gray-500">{employee.email}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{employee.vaiTro.replace('_', ' ')}</td>
                                        <td className="px-6 py-4">{new Date(employee.ngayTao).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.trang_thai === 'hoat_dong' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                                {employee.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Tạm khóa'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-4 text-gray-500">
                                                <Link to={`/admin/nhan-vien/sua/${employee.id}`} className="hover:text-purple-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                                                <button onClick={() => promptStatusChange(employee)} className={employee.trang_thai === 'hoat_dong' ? 'hover:text-red-600' : 'hover:text-green-600'} title={employee.trang_thai === 'hoat_dong' ? 'Khóa tài khoản' : 'Mở khóa'}>
                                                    <FontAwesomeIcon icon={employee.trang_thai === 'hoat_dong' ? faUserLock : faUserCheck} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Không có nhân viên nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                    <span className="text-sm text-gray-700">Hiển thị <span className="font-semibold">{employees.length}</span> trên <span className="font-semibold">{pagination.totalItems}</span> kết quả</span>
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleStatusConfirm}
                title={`Xác nhận ${employeeToAction?.trang_thai === 'hoat_dong' ? 'Khóa' : 'Mở khóa'} tài khoản`}
                message={`Bạn có chắc chắn muốn ${employeeToAction?.trang_thai === 'hoat_dong' ? 'khóa' : 'mở khóa'} tài khoản của "${employeeToAction?.hoTen}" không?`}
            />
        </>
    );
}

export default EmployeeManagementPage;