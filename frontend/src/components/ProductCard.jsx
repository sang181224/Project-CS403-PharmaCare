import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 hover:border-blue-200 will-change-transform">

            {/* Ảnh và Tên sản phẩm là link dẫn đến trang chi tiết */}
            <Link to={`/san-pham/${product.id}`} className="block">
                <div className="relative w-full h-56 overflow-hidden bg-white flex items-center justify-center">
                    <img
                        src={product.hinh_anh}
                        alt={product.ten_thuoc}
                        className="max-w-full max-h-full w-auto h-auto object-contain p-2 group-hover:scale-105 transition-transform duration-500 will-change-transform"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/path/to/default-product-image.jpg'; // Thay bằng đường dẫn ảnh mặc định
                            e.target.className = 'max-w-full max-h-full w-auto h-auto object-contain p-2 opacity-50 will-change-transform';
                        }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 min-h-[48px] leading-6 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {product.ten_thuoc}
                    </h3>
                </div>
            </Link>

            {/* Phần giá và nút bấm */}
            <div className="p-6 pt-0 flex flex-col flex-grow justify-end">
                <div className="mb-6">
                    <p className="text-2xl font-bold text-blue-600 mb-1">
                        {Number(product.gia_ban).toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-sm text-gray-500">Giá đã bao gồm VAT</p>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                    <span className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-2" />
                        Thêm vào giỏ
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;