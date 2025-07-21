import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EditSupplierPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Khởi tạo state với các trường rỗng để tránh lỗi
    const [supplier, setSupplier] = useState({
        ten_nha_cung_cap: '',
        dia_chi: '',
        so_dien_thoai: '',
        email: '',
        nguoi_lien_lac: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    // Tải dữ liệu của nhà cung cấp cần sửa
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`/api/api/admin/suppliers/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setSupplier(data);
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error("Lỗi khi tải thông tin nhà cung cấp:", error);
                toast.error("Không thể tải dữ liệu nhà cung cấp.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSupplier();
    }, [id]);

    const handleChange = (e) => {
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/api/admin/suppliers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(supplier)
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate('/admin/nha-cung-cap');
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến server.');
        }
    };

    if (isLoading) {
        return <div className="p-8">Đang tải...</div>;
    }

    if (!supplier) {
        return <div className="p-8">Không tìm thấy nhà cung cấp.</div>;
    }

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex space-x-2">
                        <li className="flex items-center">
                            <Link to="/admin/nha-cung-cap" className="text-gray-500 hover:text-purple-600">Quản lý Nhà cung cấp</Link>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i>
                            <span className="text-gray-800 font-medium">Sửa thông tin</span>
                        </li>
                    </ol>
                </nav>
                <h1 className="text-3xl font-bold text-gray-800">Sửa thông tin: {supplier.ten_nha_cung_cap}</h1>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="ten_nha_cung_cap" className="block text-sm font-medium text-gray-700">Tên Nhà cung cấp</label>
                        <input type="text" name="ten_nha_cung_cap" id="ten_nha_cung_cap" value={supplier.ten_nha_cung_cap} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nguoi_lien_lac" className="block text-sm font-medium text-gray-700">Người liên lạc</label>
                            <input type="text" name="nguoi_lien_lac" id="nguoi_lien_lac" value={supplier.nguoi_lien_lac} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="so_dien_thoai" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input type="tel" name="so_dien_thoai" id="so_dien_thoai" value={supplier.so_dien_thoai} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" value={supplier.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="dia_chi" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <textarea name="dia_chi" id="dia_chi" value={supplier.dia_chi} onChange={handleChange} rows="3" className="w-full mt-1 p-2 border rounded-lg"></textarea>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nha-cung-cap" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Hủy bỏ
                        </Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditSupplierPage;