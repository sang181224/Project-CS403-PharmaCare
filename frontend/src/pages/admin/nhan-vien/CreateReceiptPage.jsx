import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CreateReceiptPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([
        { id: 1, name: 'Paracetamol 500mg', quantity: 200, price: 10000, total: 2000000 },
        { id: 2, name: 'Berberin 10mg', quantity: 150, price: 5000, total: 750000 },
    ]);

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Tạo phiếu nhập thành công!');
        navigate('/admin/phieu-nhap-xuat');
    };

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2">
                    <li className="flex items-center"><Link to="/admin/phieu-nhap-xuat" className="text-gray-500 hover:text-blue-600">Phiếu nhập / xuất</Link></li>
                    <li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Tạo Phiếu Nhập Kho</span></li>
                </ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Tạo Phiếu Nhập Kho</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
                    <div><label className="block text-sm font-medium">Nhà cung cấp</label><select className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Dược Hậu Giang</option></select></div>
                    <div><label className="block text-sm font-medium">Mã tham chiếu</label><input type="text" placeholder="Mã đơn hàng từ NCC..." className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium">Ngày nhập</label><input type="date" className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
                </div>

                <div className="mb-8"><h3 className="text-lg font-bold">Thêm sản phẩm vào phiếu</h3><div className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg mt-2"><div className="flex-grow"><label className="text-sm">Tìm sản phẩm</label><input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div><div><label className="text-sm">Số lượng</label><input type="number" value="1" className="w-24 mt-1 px-4 py-2 border rounded-lg" /></div><button type="button" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Thêm</button></div></div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3">Sản phẩm</th><th className="px-6 py-3">Số lượng</th><th className="px-6 py-3">Giá nhập</th><th className="px-6 py-3">Thành tiền</th><th></th></tr></thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-6 py-4 font-medium">{item.name}</td>
                                    <td className="px-6 py-4">{item.quantity}</td>
                                    <td className="px-6 py-4">{item.price.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4 font-semibold">{item.total.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4 text-center"><button type="button" className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot><tr className="font-bold text-lg"><td colSpan="3" className="px-6 py-4 text-right">Tổng cộng:</td><td className="px-6 py-4">{totalAmount.toLocaleString('vi-VN')}đ</td><td></td></tr></tfoot>
                    </table>
                </div>

                <div className="pt-8 mt-8 border-t flex justify-end space-x-4">
                    <Link to="/admin/phieu-nhap-xuat" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                    <button type="submit" className="bg-green-600 text-white font-bold py-3 px-5 rounded-lg">Hoàn tất & Nhập kho</button>
                </div>
            </form>
        </ >
    );
}

export default CreateReceiptPage;