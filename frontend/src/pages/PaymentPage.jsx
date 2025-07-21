import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

// Component con để hiển thị yêu cầu đăng nhập
const LoginPrompt = () => (
    <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Vui lòng đăng nhập</h2>
        <p className="text-gray-600 mt-2 mb-6">Bạn cần đăng nhập để có thể hoàn tất đơn hàng.</p>
        <div className="flex justify-center gap-4">
            <Link to="/dang-nhap" className="inline-flex items-center bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Đăng nhập
            </Link>
            <Link to="/dang-ky" className="inline-flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Đăng ký
            </Link>
        </div>
    </div>
);


// Component con cho form thanh toán
const CheckoutForm = ({ user, customerInfo, handleInputChange, handleSubmitOrder, cart, cartTotal }) => (
    <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin giao hàng */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input type="text" name="ten_khach_hang" value={customerInfo.ten_khach_hang} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed" required readOnly />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input type="text" name="so_dien_thoai" value={customerInfo.so_dien_thoai} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ nhận hàng</label>
                    <textarea name="dia_chi_giao" value={customerInfo.dia_chi_giao} onChange={handleInputChange} rows="3" className="w-full mt-1 p-2 border rounded-lg" required></textarea>
                </div>
            </div>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.ten_thuoc} x {item.quantity}</span>
                            <span className="font-medium">{(item.quantity * item.gia_ban).toLocaleString('vi-VN')}đ</span>
                        </div>
                    ))}
                </div>
                <div className="border-t my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <button type="submit" className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
                    Xác nhận đặt hàng
                </button>
            </div>
        </div>
    </form>
);


function PaymentPage() {
    const { user } = useAuth();
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState({
        ten_khach_hang: '',
        so_dien_thoai: '',
        dia_chi_giao: ''
    });

    useEffect(() => {
        if (user) {
            setCustomerInfo({
                ten_khach_hang: user.hoTen || '',
                so_dien_thoai: user.soDienThoai || '',
                dia_chi_giao: user.diaChi || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return toast.error('Giỏ hàng của bạn đang trống.');

        const orderData = {
            customerInfo,
            items: cart.map(item => ({
                id_san_pham: item.id,
                so_luong: item.quantity,
                don_gia: item.gia_ban
            }))
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Luôn gửi header này, kể cả khi token là null
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                clearCart();
                navigate('/');
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến server.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Thanh toán</h1>
            {user ? (
                <CheckoutForm
                    user={user}
                    customerInfo={customerInfo}
                    handleInputChange={handleInputChange}
                    handleSubmitOrder={handleSubmitOrder}
                    cart={cart}
                    cartTotal={cartTotal}
                />
            ) : (
                <LoginPrompt />
            )}
        </div>
    );
}

export default PaymentPage;