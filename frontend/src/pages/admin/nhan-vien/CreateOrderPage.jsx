import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CreateOrderPage() {
    const navigate = useNavigate();
    // Thêm state cho thông tin khách hàng và các sản phẩm trong giỏ hàng
    const [customerInfo, setCustomerInfo] = useState({ ten_khach_hang: '', so_dien_thoai: '', dia_chi_giao: '' });
    const [items, setItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Hàm xử lý việc thêm sản phẩm (hiện tại chỉ là dữ liệu giả)
    const handleAddItem = () => {
        const newItem = { id_san_pham: 1, ten_thuoc: 'Paracetamol 500mg', so_luong: 1, don_gia: 15000 };
        const newItems = [...items, newItem];
        setItems(newItems);
        calculateTotal(newItems);
    };

    const calculateTotal = (currentItems) => {
        const total = currentItems.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0);
        setTotalAmount(total);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerInfo, items })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                navigate('/admin/don-hang');
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error) {
            alert('Lỗi kết nối.');
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tạo đơn hàng mới</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Tên khách hàng" value={customerInfo.ten_khach_hang} onChange={e => setCustomerInfo({ ...customerInfo, ten_khach_hang: e.target.value })} className="w-full p-2 border rounded-lg" required />
                            <input type="text" placeholder="Số điện thoại" value={customerInfo.so_dien_thoai} onChange={e => setCustomerInfo({ ...customerInfo, so_dien_thoai: e.target.value })} className="w-full p-2 border rounded-lg" />
                            <input type="text" placeholder="Địa chỉ giao hàng" value={customerInfo.dia_chi_giao} onChange={e => setCustomerInfo({ ...customerInfo, dia_chi_giao: e.target.value })} className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thêm sản phẩm</h2>
                        <button type="button" onClick={handleAddItem} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Thêm Paracetamol (Mẫu)</button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
                    {items.map((item, index) => <div key={index} className="mb-2">{item.ten_thuoc} - SL: {item.so_luong}</div>)}
                    <div className="border-t mt-6 pt-6"><div className="flex justify-between font-bold text-xl"><p>Tổng cộng:</p><p>{totalAmount.toLocaleString('vi-VN')}đ</p></div></div>
                    <div className="mt-8"><button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg">Hoàn tất & Tạo đơn hàng</button></div>
                </div>
            </form>
        </>
    );
}

export default CreateOrderPage;