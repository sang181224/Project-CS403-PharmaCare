import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import ProductSearchInput from '../../../components/admin/ProductSearchInput';
import toast from 'react-hot-toast'; // <-- DÒNG QUAN TRỌNG BỊ THIẾU

function CreateReceiptPage() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [receiptInfo, setReceiptInfo] = useState({ id_nha_cung_cap: '', ngay_nhap: new Date().toISOString().slice(0, 10) });
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:3000/api/admin/suppliers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                const suppliersData = result.data || result;
                if (response.ok && suppliersData.length > 0) {
                    setSuppliers(suppliersData);
                    setReceiptInfo(prev => ({ ...prev, id_nha_cung_cap: suppliersData[0].id }));
                }
            } catch (err) {
                console.error("Lỗi tải nhà cung cấp:", err);
            }
        };
        fetchSuppliers();
    }, []);

    const handleProductSelect = (product) => {
        const newItem = {
            tempId: Date.now(),
            id_san_pham: product.id,
            ten_thuoc: product.ten_thuoc,
            ma_lo_thuoc: '', so_luong_nhap: 1, don_gia_nhap: 0, thanh_tien: 0,
            ngay_san_xuat: '', han_su_dung: '', vi_tri_kho: ''
        };
        setItems(prevItems => [...prevItems, newItem]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        const item = newItems[index];
        item[field] = value;
        if (field === 'so_luong_nhap' || field === 'don_gia_nhap') {
            item.thanh_tien = (Number(item.so_luong_nhap) || 0) * (Number(item.don_gia_nhap) || 0);
        }
        setItems(newItems);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.thanh_tien, 0), [items]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/receipts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ receiptInfo: { ...receiptInfo, tong_tien: totalAmount }, items })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate('/admin/phieu-nhap-xuat');
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối.');
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tạo Phiếu Nhập Kho</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
                        <select value={receiptInfo.id_nha_cung_cap} onChange={e => setReceiptInfo({ ...receiptInfo, id_nha_cung_cap: e.target.value })} className="w-full p-2 border rounded-lg bg-white">
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.ten_nha_cung_cap}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày nhập</label>
                        <input type="date" value={receiptInfo.ngay_nhap} onChange={e => setReceiptInfo({ ...receiptInfo, ngay_nhap: e.target.value })} className="w-full p-2 border rounded-lg" />
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Tìm và thêm sản phẩm</label>
                        <ProductSearchInput onProductSelect={handleProductSelect} />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr><th className="p-2 text-left">Sản phẩm</th><th className="p-2">Mã Lô</th><th className="p-2">Số lượng</th><th className="p-2">Đơn giá</th><th className="p-2">Ngày SX</th><th className="p-2">Hạn dùng</th><th className="p-2">Vị trí</th><th className="p-2 text-right">Thành tiền</th><th></th></tr></thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan="9" className="text-center p-8 text-gray-500">Chưa có sản phẩm nào.</td></tr>
                                ) : (
                                    items.map((item, index) => (
                                        <tr key={item.tempId} className="border-b">
                                            <td className="p-2 font-semibold">{item.ten_thuoc}</td>
                                            <td className="p-2"><input type="text" value={item.ma_lo_thuoc} onChange={e => handleItemChange(index, 'ma_lo_thuoc', e.target.value)} className="w-28 p-1 border rounded" required /></td>
                                            <td className="p-2"><input type="number" value={item.so_luong_nhap} onChange={e => handleItemChange(index, 'so_luong_nhap', e.target.value)} className="w-20 p-1 border rounded" required /></td>
                                            <td className="p-2"><input type="number" value={item.don_gia_nhap} onChange={e => handleItemChange(index, 'don_gia_nhap', e.target.value)} className="w-28 p-1 border rounded" required /></td>
                                            <td className="p-2"><input type="date" value={item.ngay_san_xuat} onChange={e => handleItemChange(index, 'ngay_san_xuat', e.target.value)} className="w-full p-1 border rounded text-gray-500" /></td>
                                            <td className="p-2"><input type="date" value={item.han_su_dung} onChange={e => handleItemChange(index, 'han_su_dung', e.target.value)} className="w-full p-1 border rounded text-gray-500" /></td>
                                            <td className="p-2"><input type="text" value={item.vi_tri_kho} onChange={e => handleItemChange(index, 'vi_tri_kho', e.target.value)} className="w-24 p-1 border rounded" /></td>
                                            <td className="p-2 text-right font-medium">{item.thanh_tien.toLocaleString('vi-VN')}đ</td>
                                            <td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700" title="Xóa dòng"><FontAwesomeIcon icon={faTrash} /></button></td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pt-8 mt-8 border-t">
                    <div className="flex justify-end mb-4"><p className="text-xl font-bold">Tổng cộng: <span className="text-blue-600">{totalAmount.toLocaleString('vi-VN')}đ</span></p></div>
                    <div className="flex justify-end space-x-4"><Link to="/admin/phieu-nhap-xuat" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link><button type="submit" className="bg-green-600 text-white font-bold py-3 px-5 rounded-lg">Hoàn tất & Lưu Phiếu</button></div>
                </div>
            </form>
        </>
    );
}

export default CreateReceiptPage;