import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function CreateReceiptPage() {
    const navigate = useNavigate();

    // State cho dữ liệu tải từ server
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    // State cho thông tin của phiếu nhập
    const [receiptInfo, setReceiptInfo] = useState({
        id_nha_cung_cap: '',
        ghi_chu: '',
        ngay_nhap: new Date().toISOString().slice(0, 10)
    });
    const [items, setItems] = useState([]);

    // State cho việc chọn sản phẩm để thêm vào
    const [selectedProductId, setSelectedProductId] = useState('');

    // Tải danh sách nhà cung cấp và sản phẩm khi component được render
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        const fetchInitialData = async () => {
            try {
                const [suppliersRes, productsRes] = await Promise.all([
                    fetch('http://localhost:3000/api/suppliers', { headers }),
                    fetch('http://localhost:3000/api/products', { headers })
                ]);
                const suppliersData = await suppliersRes.json();
                const productsData = await productsRes.json();

                if (suppliersRes.ok && suppliersData.length > 0) {
                    setSuppliers(suppliersData);
                    setReceiptInfo(prev => ({ ...prev, id_nha_cung_cap: suppliersData[0].id }));
                }
                if (productsRes.ok && productsData.length > 0) {
                    setProducts(productsData);
                    setSelectedProductId(productsData[0].id);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu ban đầu:", error);
            }
        };
        fetchInitialData();
    }, []);

    const handleAddItem = () => {
        if (!selectedProductId) {
            alert("Vui lòng chọn một sản phẩm.");
            return;
        }
        const productToAdd = products.find(p => p.id === parseInt(selectedProductId));
        if (!productToAdd) return;

        const newItem = {
            // Dùng một ID tạm thời duy nhất ở frontend để React có thể render list
            tempId: Date.now(),
            id_san_pham: productToAdd.id,
            ten_thuoc: productToAdd.ten_thuoc,
            ma_lo_thuoc: '',
            so_luong_nhap: 1,
            don_gia_nhap: 0,
            thanh_tien: 0,
            ngay_san_xuat: '',
            han_su_dung: '',
            vi_tri_kho: ''
        };
        setItems([...items, newItem]);
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

    const totalAmount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.thanh_tien, 0);
    }, [items]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/receipts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ receiptInfo: { ...receiptInfo, tong_tien: totalAmount }, items })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                navigate('/admin/phieu-nhap-xuat');
            } else { alert('Lỗi: ' + result.error); }
        } catch (error) { alert('Lỗi kết nối.'); }
    };

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2" aria-label="Breadcrumb"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/phieu-nhap-xuat" className="text-gray-500 hover:text-blue-600">Phiếu nhập / xuất</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Tạo Phiếu Nhập Kho</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Tạo Phiếu Nhập Kho</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
                        <select name="id_nha_cung_cap" value={receiptInfo.id_nha_cung_cap} onChange={e => setReceiptInfo({ ...receiptInfo, id_nha_cung_cap: e.target.value })} className="w-full p-2 border rounded-lg bg-white">
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.ten_nha_cung_cap}</option>)}
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Ngày nhập</label><input type="date" name="ngay_nhap" value={receiptInfo.ngay_nhap} onChange={e => setReceiptInfo({ ...receiptInfo, ngay_nhap: e.target.value })} className="w-full p-2 border rounded-lg" /></div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Chi tiết hàng hóa</h3>
                        <div className="flex items-end gap-4">
                            <div className="flex-grow w-full md:w-64"><label className="text-sm">Chọn sản phẩm</label><select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full mt-1 p-2 border rounded-lg"><option value="">-- Chọn sản phẩm --</option>{products.map(p => <option key={p.id} value={p.id}>{p.ten_thuoc}</option>)}</select></div>
                            <button type="button" onClick={handleAddItem} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg h-10 shrink-0"><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 text-left w-1/4">Sản phẩm</th>
                                    <th className="p-2 text-left">Mã Lô</th>
                                    <th className="p-2 text-left">Số lượng</th>
                                    <th className="p-2 text-left">Đơn giá nhập</th>
                                    <th className="p-2 text-left">Hạn dùng</th>
                                    <th className="p-2 text-left">Vị trí</th>
                                    <th className="p-2 text-right">Thành tiền</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center p-8 text-gray-500">Chưa có sản phẩm nào trong phiếu nhập.</td></tr>
                                ) : (
                                    items.map((item, index) => (
                                        <tr key={item.tempId} className="border-b">
                                            <td className="p-2 font-semibold">{item.ten_thuoc}</td>
                                            <td className="p-2"><input type="text" value={item.ma_lo_thuoc} onChange={e => handleItemChange(index, 'ma_lo_thuoc', e.target.value)} className="w-28 p-1 border rounded" required /></td>
                                            <td className="p-2"><input type="number" value={item.so_luong_nhap} onChange={e => handleItemChange(index, 'so_luong_nhap', e.target.value)} className="w-20 p-1 border rounded" required /></td>
                                            <td className="p-2"><input type="number" value={item.don_gia_nhap} onChange={e => handleItemChange(index, 'don_gia_nhap', e.target.value)} className="w-28 p-1 border rounded" required /></td>
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