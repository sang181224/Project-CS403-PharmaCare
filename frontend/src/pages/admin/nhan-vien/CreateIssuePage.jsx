import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

function CreateIssuePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm để chọn
    const [items, setItems] = useState([]); // Danh sách các dòng trong phiếu xuất
    const [issueInfo, setIssueInfo] = useState({
        ly_do_xuat: 'Xuất bán cho khách',
        id_don_hang: ''
    });

    // Tải danh sách tất cả sản phẩm khi trang được mở
    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch('http://localhost:3000/api/products');
            const data = await res.json();
            if (res.ok) setProducts(data.filter(p => p.so_luong_ton > 0));
        };
        fetchProducts();
    }, []);

    const handleAddItem = () => {
        setItems([...items, {
            tempId: Date.now(),
            productId: '',
            productName: '',
            batchId: '',
            quantity: 1,
            availableBatches: [], // Mảng chứa các lô của sản phẩm được chọn
        }]);
    };

    // --- HÀM QUAN TRỌNG ĐỂ TẢI LÔ THUỐC ---
    const handleProductSelect = async (index, productId) => {
        const newItems = [...items];
        const currentItem = newItems[index];
        const product = products.find(p => p.id === parseInt(productId));

        currentItem.productId = productId;
        currentItem.productName = product?.ten_thuoc || '';
        currentItem.availableBatches = []; // Xóa danh sách lô cũ
        currentItem.batchId = ''; // Reset lựa chọn lô

        if (productId) {
            try {
                // Khi chọn sản phẩm, gọi API để lấy chi tiết và các lô của nó
                const res = await fetch(`http://localhost:3000/api/products/${productId}`);
                const data = await res.json();
                if (res.ok) {
                    currentItem.availableBatches = data.batches.filter(b => b.so_luong_con > 0);
                }
            } catch (error) {
                console.error("Lỗi tải lô thuốc:", error);
            }
        }
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedItems = items.map(item => ({
            id_san_pham: item.productId,
            id_lo_thuoc: item.batchId,
            so_luong_xuat: item.quantity,
        }));

        try {
            const response = await fetch('http://localhost:3000/api/issues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ issueInfo, items: formattedItems })
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tạo Phiếu Xuất Kho</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                {/* ... Phần thông tin chung ... */}

                <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Chi tiết hàng hóa xuất</h3>
                        <button type="button" onClick={handleAddItem} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />Thêm sản phẩm
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr><th className="p-2 w-[30%]">Sản phẩm</th><th className="p-2 w-[40%]">Chọn Lô (Tồn kho, HSD)</th><th className="p-2">SL Xuất</th><th></th></tr></thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.tempId} className="border-b">
                                        <td className="p-2">
                                            <select value={item.productId} onChange={(e) => handleProductSelect(index, e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                                                <option value="">-- Chọn sản phẩm --</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.ten_thuoc}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <select value={item.batchId} onChange={(e) => handleItemChange(index, 'batchId', e.target.value)} className="w-full p-2 border rounded-lg bg-white" required disabled={item.availableBatches.length === 0}>
                                                <option value="">-- Chọn lô --</option>
                                                {item.availableBatches.map(b => <option key={b.id} value={b.id}>
                                                    {b.ma_lo_thuoc} (Tồn: {b.so_luong_con}, HSD: {new Date(b.han_su_dung).toLocaleDateString('vi-VN')})
                                                </option>)}
                                            </select>
                                        </td>
                                        <td className="p-2"><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-24 p-2 border rounded" required /></td>
                                        <td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700" title="Xóa dòng"><FontAwesomeIcon icon={faTrash} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="pt-8 mt-8 border-t flex justify-end">
                    <button type="submit" className="bg-green-600 text-white font-bold py-3 px-5 rounded-lg">Hoàn tất & Xuất kho</button>
                </div>
            </form>
        </>
    );
}

export default CreateIssuePage;