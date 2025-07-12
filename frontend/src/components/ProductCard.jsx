import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function ProductCard({ product }) {
    // Tạo đường dẫn động, ví dụ: /san-pham/1
    const productUrl = `/san-pham/${product.id}`;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link to={productUrl} className="block h-48">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex-grow">{product.name}</h3>
                <p className="text-xl font-bold text-green-600 mb-4">{product.price}</p>
                <Link to={productUrl} className="mt-auto w-full bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-center">
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;