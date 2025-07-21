import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

function CategoryProducts() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Tải danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`/api/api/public/categories`);
                const data = await response.json();
                if (response.ok && data.length > 0) {
                    setCategories(data);
                    setSelectedCategory(data[0]);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // Tải sản phẩm theo danh mục
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchProductsByCategory = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/api/public/products?category=${selectedCategory}&limit=4`);
                const result = await response.json(); // result là { data: [...], pagination: {...} }

                if (response.ok) {
                    // SỬA LẠI DÒNG NÀY:
                    // Lấy đúng mảng 'data' từ trong kết quả trả về
                    setProducts(result.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm theo danh mục:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductsByCategory();
    }, [selectedCategory]);

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Khám Phá Sản Phẩm Theo Danh Mục</h2>

            <div className="flex justify-center flex-wrap gap-3 mb-8">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${selectedCategory === category
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="text-center py-10">Đang tải...</div>
            ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">Không có sản phẩm trong danh mục này.</div>
            )}

            <div className="text-center mt-12">
                <button
                    onClick={() => navigate("/product")}
                    className="bg-white text-blue-600 font-semibold py-2 px-6 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                >
                    Xem tất cả sản phẩm
                </button>
            </div>
        </div>
    );
}

export default CategoryProducts;