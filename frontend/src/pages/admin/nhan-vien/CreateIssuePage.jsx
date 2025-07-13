import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CreateIssuePage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Tạo phiếu xuất thành công!');
        navigate('/admin/phieu-nhap-xuat');
    };

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/phieu-nhap-xuat" className="text-gray-500 hover:text-blue-600">Phiếu nhập / xuất</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Tạo Phiếu Xuất Kho</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Tạo Phiếu Xuất Kho</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
                    <div><label className="block text-sm font-medium">Đơn hàng liên quan</label><input type="text" placeholder="Nhập mã đơn hàng #PC..." className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium">Lý do xuất</label><select className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Xuất bán cho khách</option><option>Trả lại nhà cung cấp</option><option>Xuất hủy</option></select></div>
                    <div><label className="block text-sm font-medium">Ngày xuất</label><input type="date" className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
                </div>

                <div className="mb-8"><h3 className="text-lg font-bold">Thêm sản phẩm vào phiếu xuất</h3><div className="p-4 bg-gray-50 rounded-lg mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"><div className="md:col-span-2"><label className="text-sm">Tìm sản phẩm</label><input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div><div><label className="text-sm">Chọn Lô xuất</label><select className="w-full mt-1 px-4 py-2 border rounded-lg"><option>L250710A (Tồn: 150)</option></select></div><div><label className="text-sm">Số lượng</label><input type="number" defaultValue="1" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div></div></div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3">Sản phẩm</th><th className="px-6 py-3">Mã Lô</th><th className="px-6 py-3">Số lượng xuất</th><th></th></tr></thead>
                        <tbody><tr className="border-b"><td className="px-6 py-4 font-medium">Paracetamol 500mg</td><td className="px-6 py-4">L250710A</td><td className="px-6 py-4">2</td><td className="px-6 py-4 text-center"><button type="button" className="text-red-500"><i className="fas fa-trash"></i></button></td></tr></tbody>
                    </table>
                </div>

                <div className="pt-8 mt-8 border-t flex justify-end space-x-4">
                    <Link to="/admin/phieu-nhap-xuat" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                    <button type="submit" className="bg-green-600 text-white font-bold py-3 px-5 rounded-lg">Hoàn tất & Xuất kho</button>
                </div>
            </form>
        </>
    );
}

export default CreateIssuePage;