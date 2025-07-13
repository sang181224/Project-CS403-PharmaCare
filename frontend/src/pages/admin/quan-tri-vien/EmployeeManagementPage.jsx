import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPencilAlt, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu
const initialEmployees = [
    { id: 1, name: 'Trần Thị B', email: 'tranb@pharmacare.com', role: 'Nhân viên bán hàng', joinDate: '15/01/2024', status: 'Đang hoạt động', avatar: 'https://via.placeholder.com/100/D1D5DB/4B5563?text=B' },
    { id: 2, name: 'Lê Văn C', email: 'levanc@pharmacare.com', role: 'Quản lý kho', joinDate: '01/11/2023', status: 'Đang hoạt động', avatar: 'https://via.placeholder.com/100/E5E7EB/4B5563?text=C' },
    { id: 3, name: 'Vũ Thị D', email: 'vuthid@pharmacare.com', role: 'Nhân viên bán hàng', joinDate: '01/03/2024', status: 'Tạm khóa', avatar: 'https://via.placeholder.com/100/FECACA/991B1B?text=D' },
];

function EmployeeManagementPage() {
    const [employees, setEmployees] = useState(initialEmployees);

    // Hàm để thay đổi trạng thái khóa/mở khóa
    const toggleLockStatus = (employeeId) => {
        setEmployees(currentEmployees =>
            currentEmployees.map(emp => {
                if (emp.id === employeeId) {
                    return { ...emp, status: emp.status === 'Đang hoạt động' ? 'Tạm khóa' : 'Đang hoạt động' };
                }
                return emp;
            })
        );
    };

    return (
        <>
            {/* Page Header */}
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

            {/* Employee Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Nhân viên</th>
                                <th className="px-6 py-3">Vai trò</th>
                                <th className="px-6 py-3">Ngày vào làm</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-medium text-gray-900">{employee.name}</p>
                                                <p className="text-xs text-gray-500">{employee.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{employee.role}</td>
                                    <td className="px-6 py-4">{employee.joinDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                                            <Link to={`/admin/nhan-vien/sua/${employee.id}`} className="hover:text-purple-600" title="Sửa">
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </Link>
                                            <button onClick={() => toggleLockStatus(employee.id)} className={employee.status === 'Đang hoạt động' ? 'hover:text-red-600' : 'hover:text-green-600'} title={employee.status === 'Đang hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}>
                                                <FontAwesomeIcon icon={employee.status === 'Đang hoạt động' ? faUserLock : faUserCheck} />
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