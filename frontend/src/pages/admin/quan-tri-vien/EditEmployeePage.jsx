import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EditEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        vaiTro: 'nhan_vien',
        trang_thai: 'hoat_dong'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Dùng useCallback để hàm không bị tạo lại mỗi lần render
    const fetchEmployee = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/api/admin/employees/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Không thể tải dữ liệu nhân viên.');
            }
            const data = await response.json();
            setFormData(data); // Cập nhật form với dữ liệu từ API
        } catch (err) {
            console.error("Lỗi:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/api/admin/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                // Chỉ gửi những trường cần thiết
                body: JSON.stringify({ hoTen: formData.hoTen, vaiTro: formData.vaiTro })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate('/admin/nhan-vien');
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (err) {
            toast.error('Lỗi kết nối đến server.');
        }
    };

    if (isLoading) return <div className="p-8 text-center">Đang tải thông tin nhân viên...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Lỗi: {error}</div>;

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Sửa thông tin: {formData.hoTen}</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="hoTen" className="block text-sm font-medium">Họ và tên</label>
                            <input type="text" name="hoTen" id="hoTen" value={formData.hoTen} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email (Không thể thay đổi)</label>
                            <input type="email" name="email" id="email" value={formData.email} className="w-full mt-1 p-2 border rounded-lg bg-gray-200 cursor-not-allowed" readOnly />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="vaiTro" className="block text-sm font-medium">Vai trò</label>
                        <select name="vaiTro" id="vaiTro" value={formData.vaiTro} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-white">
                            <option value="nhan_vien">Nhân viên</option>
                            <option value="quan_ly_kho">Quản lý kho</option>
                            <option value="quan_tri_vien">Quản trị viên</option>
                        </select>
                    </div>
                    {/* Phần sửa trạng thái đã được chuyển sang nút Khóa/Mở khóa ở trang danh sách */}
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nhan-vien" className="bg-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy bỏ</Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditEmployeePage;