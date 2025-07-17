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
            <HomeBanner/>
            {/* Featured Products */}
            <div className="p-8">
                <HotProducts/>
                <HomeTypeProducts/>
            </div>
        </>
    );
}

export default HomePage;