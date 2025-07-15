import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPencilAlt, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';

function EmployeeManagementPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/admin/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorResult = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
                throw new Error(errorResult.error || 'Không thể tải danh sách nhân viên.');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Lỗi:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // --- HÀM XỬ LÝ KHÓA/MỞ KHÓA ĐẦY ĐỦ ---
    const handleToggleLockStatus = async (employee) => {
        const newStatus = employee.trang_thai === 'hoat_dong' ? 'tam_khoa' : 'hoat_dong';
        const actionText = newStatus === 'tam_khoa' ? 'khóa' : 'mở khóa';

        if (window.confirm(`Bạn có chắc muốn ${actionText} tài khoản của ${employee.hoTen}?`)) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:3000/api/admin/employees/${employee.id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ trang_thai: newStatus })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    fetchEmployees(); // Tải lại danh sách để cập nhật giao diện
                } else {
                    alert('Lỗi: ' + result.error);
                }
            } catch (error) {
                alert('Lỗi kết nối đến server.');
            }
        }
    };

    if (isLoading) return <div className="p-8">Đang tải...</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhân viên</h1>
                <Link to="/admin/nhan-vien/them" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Thêm nhân viên mới
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm">
                            <tr>
                                <th className="px-6 py-3">Nhân viên</th>
                                <th className="px-6 py-3">Vai trò</th>
                                <th className="px-6 py-3">Ngày tạo</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold uppercase">{employee.hoTen.charAt(0)}</div>
                                            <div>
                                                <p className="font-medium">{employee.hoTen}</p>
                                                <p className="text-xs text-gray-500">{employee.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{employee.vaiTro.replace('_', ' ')}</td>
                                    <td className="px-6 py-4">{new Date(employee.ngayTao).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.trang_thai === 'hoat_dong' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                            {employee.trang_thai === 'hoat_dong' ? 'Đang hoạt động' : 'Tạm khóa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                                            <Link to={`/admin/nhan-vien/sua/${employee.id}`} className="hover:text-purple-600" title="Sửa"><FontAwesomeIcon icon={faPencilAlt} /></Link>
                                            <button onClick={() => handleToggleLockStatus(employee)} className={employee.trang_thai === 'hoat_dong' ? 'hover:text-red-600' : 'hover:text-green-600'} title={employee.trang_thai === 'hoat_dong' ? 'Khóa tài khoản' : 'Mở khóa'}>
                                                <FontAwesomeIcon icon={employee.trang_thai === 'hoat_dong' ? faUserLock : faUserCheck} />
                                            </button>
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

export default EmployeeManagementPage;