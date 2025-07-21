import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

function CreateOrderPage() {
    const navigate = useNavigate();
    
    // State
    const [customerInfo, setCustomerInfo] = useState({ ten_khach_hang: '', so_dien_thoai: '', dia_chi_giao: '' });
    const [items, setItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');

    // Tải danh sách sản phẩm để người dùng chọn
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setAllProducts(data.filter(p => p.so_luong_ton > 0));
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, []);

    // Hàm xử lý thông tin khách hàng
    const handleCustomerInfoChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    // Hàm thêm sản phẩm vào đơn hàng
    const handleAddItem = () => {
        if (!selectedProductId) {
            toast.error("Vui lòng chọn một sản phẩm.");
            return;
        }
        const productToAdd = allProducts.find(p => p.id === parseInt(selectedProductId));
        if (!productToAdd) return;

        const existingItemIndex = items.findIndex(item => item.id_san_pham === productToAdd.id);

        if (existingItemIndex > -1) {
            const newItems = [...items];
            newItems[existingItemIndex].so_luong += 1;
            setItems(newItems);
        } else {
            const newItem = {
                id_san_pham: productToAdd.id,
                ten_thuoc: productToAdd.ten_thuoc,
                so_luong: 1,
                don_gia: productToAdd.gia_ban,
            };
            setItems([...items, newItem]);
        }
    };

    // Hàm thay đổi số lượng sản phẩm
    const handleQuantityChange = (index, newQuantity) => {
        const newItems = [...items];
        newItems[index].so_luong = Math.max(1, newQuantity);
        setItems(newItems);
    };
    
    // Hàm xóa sản phẩm khỏi đơn hàng
    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Tự động tính tổng tiền
    const totalAmount = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0);
    }, [items]);

    // Hàm gửi đơn hàng lên server
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error("Vui lòng thêm sản phẩm vào đơn hàng.");
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ customerInfo, items })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate('/admin/don-hang');
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối.');
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tạo đơn hàng mới</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột trái: Nhập liệu */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>
                        <div className="space-y-4">
                            <input type="text" name="ten_khach_hang" placeholder="Tên khách hàng" value={customerInfo.ten_khach_hang} onChange={handleCustomerInfoChange} className="w-full p-2 border rounded-lg" required/>
                            <input type="text" name="so_dien_thoai" placeholder="Số điện thoại" value={customerInfo.so_dien_thoai} onChange={handleCustomerInfoChange} className="w-full p-2 border rounded-lg" />
                            <input type="text" name="dia_chi_giao" placeholder="Địa chỉ giao hàng" value={customerInfo.dia_chi_giao} onChange={handleCustomerInfoChange} className="w-full p-2 border rounded-lg" required/>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thêm sản phẩm</h2>
                        <div className="flex items-end gap-4">
                            <div className="flex-grow">
                                <label className="text-sm font-medium">Tìm và chọn sản phẩm</label>
                                <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full mt-1 p-2 border rounded-lg bg-white">
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {allProducts.map(p => <option key={p.id} value={p.id}>{p.ten_thuoc} ({Number(p.gia_ban).toLocaleString('vi-VN')}đ)</option>)}
                                </select>
                            </div>
                            <button type="button" onClick={handleAddItem} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg h-10 shrink-0"><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Tóm tắt */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                    <div className="mb-4 pb-4 border-b">
                        <h3 className="text-md font-semibold text-gray-700">Thông tin giao hàng:</h3>
                        <p className="font-bold mt-2">{customerInfo.ten_khach_hang || '(Chưa có tên)'}</p>
                        <p className="text-sm text-gray-600">{customerInfo.so_dien_thoai}</p>
                        <p className="text-sm text-gray-600">{customerInfo.dia_chi_giao}</p>
                    </div>
                    <div className="flex-grow space-y-3 overflow-y-auto">
                        <h3 className="text-md font-semibold text-gray-700">Các sản phẩm:</h3>
                        {items.length === 0 
                            ? <p className="text-gray-500 text-sm">Chưa có sản phẩm nào.</p> 
                            : items.map((item, index) => (
                                <div key={item.id_san_pham} className="flex items-center">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.ten_thuoc}</p>
                                        <p className="text-sm text-gray-600">{Number(item.don_gia).toLocaleString('vi-VN')}đ</p>
                                    </div>
                                    <input type="number" value={item.so_luong} onChange={e => handleQuantityChange(index, parseInt(e.target.value))} className="w-16 p-1 border rounded mx-4 text-center" />
                                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                            ))
                        }
                    </div>
                    <div className="border-t mt-6 pt-6">
                        <div className="flex justify-between font-bold text-xl"><p>Tổng cộng:</p><p className="text-blue-600">{totalAmount.toLocaleString('vi-VN')}đ</p></div>
                        <div className="mt-8"><button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Hoàn tất & Tạo đơn hàng</button></div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default CreateOrderPage;