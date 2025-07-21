import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeBanner from '../components/HomeBanner';
import ProductCard from '../components/ProductCard';
import CategoryProducts from '../components/CategoryProducts';

function HomePage() {
    const navigate = useNavigate();
    const [hotProducts, setHotProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                // Gọi đến API mới của trang chủ
                const response = await fetch(`/api/api/public/homepage-products?limit=8`);
                const result = await response.json(); // API này trả về mảng trực tiếp
                if (response.ok) {
                    setHotProducts(result);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm nổi bật:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHotProducts();
    }, []);

    return (
        <>
            <HomeBanner />
            <div className="max-w-7xl mx-auto p-8">
                {/* Phần Sản phẩm nổi bật */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Sản Phẩm Nổi Bật</h1>
                        <p onClick={() => navigate("/product")} className="text-blue-600 hover:underline cursor-pointer font-semibold">
                            Xem tất cả &rarr;
                        </p>
                    </div>
                    {isLoading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {hotProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Phần Sản phẩm theo danh mục */}
                <CategoryProducts />
            </div>
        </>
    );
}

export default HomePage;