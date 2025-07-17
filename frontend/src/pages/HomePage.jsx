import React from 'react';
import ProductCard from '../components/ProductCard'; // Import component ProductCard
import HotProducts from '../components/hot-products';
import HomeTypeProducts from '../components/home-type-products';
import HomeBanner from '../components/home-banner';

// Dữ liệu mẫu cho các sản phẩm
const featuredProducts = [
    { id: 1, name: 'Paracetamol 500mg', price: '15.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=PharmaCare' },
    { id: 2, name: 'Vitamin C 1000mg', price: '45.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/ECFDF5/6EE7B7?text=PharmaCare' },
    { id: 3, name: 'Ibuprofen 400mg', price: '35.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/FFF7ED/FDBA74?text=PharmaCare' },
    { id: 4, name: 'Omeprazole 20mg', price: '125.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/F0FDFA/5EEAD4?text=PharmaCare' },
];

function HomePage() {
    return (
        <>
            {/* Hero Section */}
            {/* <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Chào mừng đến với PharmaCare</h2>
                    <p className="text-xl text-gray-200">Hệ thống quản lý nhà thuốc hiện đại và đáng tin cậy.</p>
                </div>
            </section> */}
            <HomeBanner/>

            {/* Featured Products */}
            <div className="p-8">
                {/* <section className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Sản phẩm nổi bật</h3>
                        <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                            Xem tất cả <i className="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        Dùng hàm map để hiển thị danh sách sản phẩm, tái sử dụng component ProductCard
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section> */}
                <HotProducts/>
                <HomeTypeProducts/>
            </div>
        </>
    );
}

export default HomePage;