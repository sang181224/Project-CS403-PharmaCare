import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Dùng lại context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function CartPage() {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

            {cart.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-lg shadow-md">
                    <p className="text-gray-600 text-lg">Giỏ hàng của bạn đang trống.</p>
                    <Link to="/product" className="mt-6 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột danh sách sản phẩm */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <ul className="divide-y divide-gray-200">
                            {cart.map(item => (
                                <li key={item.id} className="flex items-center py-4">
                                    <img src={item.hinh_anh} alt={item.ten_thuoc} className="w-20 h-20 rounded object-cover mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{item.ten_thuoc}</p>
                                        <p className="text-sm text-gray-500">{Number(item.gia_ban).toLocaleString('vi-VN')}đ</p>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="w-16 p-1 border rounded text-center mx-4"
                                            min="1"
                                        />
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột tóm tắt đơn hàng */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Tạm tính:</span>
                                <span>{cartTotal.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="border-t my-4"></div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng cộng:</span>
                                <span className="text-blue-600">{cartTotal.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <button
                                onClick={() => navigate('/payment')}
                                className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
                            >
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;