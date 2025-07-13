import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState({
        ten_thuoc: '', ma_thuoc: '', danh_muc: '', nha_san_xuat: '', 
        don_vi_tinh: '', gia_ban: '', mo_ta: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Lấy dữ liệu sản phẩm hiện tại để điền vào form
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in product) {
            formData.append(key, product[key]);
        }
        if (imageFile) {
            formData.append('hinh_anh', imageFile);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                navigate(`/admin/kho/${id}`);
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error) {
            alert('Lỗi kết nối.');
        }
    };

    if (isLoading) return <div>Đang tải...</div>;

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/kho" className="text-gray-500 hover:text-blue-600">Quản lý Kho</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Sửa sản phẩm</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Sửa thông tin sản phẩm</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="ten_thuoc" className="block text-sm font-medium">Tên thuốc</label><input type="text" name="ten_thuoc" id="ten_thuoc" value={product.ten_thuoc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div><label htmlFor="ma_thuoc" className="block text-sm font-medium">Mã thuốc (SKU)</label><input type="text" name="ma_thuoc" id="ma_thuoc" value={product.ma_thuoc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div className="md:col-span-2"><label htmlFor="mo_ta" className="block text-sm font-medium">Mô tả ngắn</label><textarea name="mo_ta" id="mo_ta" value={product.mo_ta} onChange={handleChange} rows="3" className="w-full mt-1 px-4 py-2 border rounded-lg"></textarea></div>
                        <div><label htmlFor="danh_muc" className="block text-sm font-medium">Danh mục</label><select name="danh_muc" id="danh_muc" value={product.danh_muc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Thuốc giảm đau</option><option>Thuốc kháng sinh</option></select></div>
                        <div><label htmlFor="nha_san_xuat" className="block text-sm font-medium">Nhà sản xuất</label><select name="nha_san_xuat" id="nha_san_xuat" value={product.nha_san_xuat} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Traphaco</option><option>DHG Pharma</option></select></div>
                        <div><label htmlFor="don_vi_tinh" className="block text-sm font-medium">Đơn vị tính</label><input type="text" name="don_vi_tinh" id="don_vi_tinh" value={product.don_vi_tinh} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="gia_ban" className="block text-sm font-medium">Giá bán (VNĐ)</label><input type="number" name="gia_ban" id="gia_ban" value={product.gia_ban} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium">Đổi hình ảnh (để trống nếu không đổi)</label><input type="file" name="hinh_anh" onChange={handleFileChange} accept="image/*" className="block w-full text-sm mt-1" /></div>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to={`/admin/kho/${id}`} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Lưu thay đổi</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditProductPage;