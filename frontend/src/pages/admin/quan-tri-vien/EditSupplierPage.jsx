import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Dữ liệu mẫu
const sampleSupplier = {
    id: 1,
    name: 'Công ty Cổ phần Traphaco',
    address: '75 Yên Ninh, Ba Đình, Hà Nội',
    contactPerson: 'Nguyễn Minh Tuấn',
    phone: '0987 654 321',
    email: 'tuan.nm@traphaco.com',
};

function EditSupplierPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);

    useEffect(() => {
        // Giả lập fetch dữ liệu
        setSupplier(sampleSupplier);
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cập nhật thông tin nhà cung cấp thành công!');
        navigate('/admin/nha-cung-cap');
    };

    if (!supplier) return <div>Đang tải...</div>;

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/nha-cung-cap" className="text-gray-500 hover:text-purple-600">Quản lý Nhà cung cấp</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Sửa thông tin</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Sửa thông tin: {supplier.name}</h1>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div><label htmlFor="ten-ncc" className="block text-sm font-medium">Tên Nhà cung cấp</label><input type="text" id="ten-ncc" className="w-full mt-1 px-4 py-2 border rounded-lg" defaultValue={supplier.name} /></div>
                    <div><label htmlFor="dia-chi" className="block text-sm font-medium">Địa chỉ</label><input type="text" id="dia-chi" className="w-full mt-1 px-4 py-2 border rounded-lg" defaultValue={supplier.address} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="nguoi-lien-lac" className="block text-sm font-medium">Người liên lạc</label><input type="text" id="nguoi-lien-lac" className="w-full mt-1 px-4 py-2 border rounded-lg" defaultValue={supplier.contactPerson} /></div>
                        <div><label htmlFor="so-dien-thoai" className="block text-sm font-medium">Số điện thoại</label><input type="tel" id="so-dien-thoai" className="w-full mt-1 px-4 py-2 border rounded-lg" defaultValue={supplier.phone} /></div>
                    </div>
                    <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" id="email" className="w-full mt-1 px-4 py-2 border rounded-lg" defaultValue={supplier.email} /></div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nha-cung-cap" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditSupplierPage;