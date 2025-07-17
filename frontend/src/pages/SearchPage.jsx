import React from 'react';
import ProductCard from '../components/ProductCard'; // Import component dùng chung

// Dữ liệu mẫu
const searchResults = [
    { id: 1, name: 'Paracetamol 500mg', price: '15.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=PharmaCare' },
    { id: 2, name: 'Panadol Extra', price: '25.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=PharmaCare' },
    { id: 3, name: 'Paracetamol 500mg', price: '15.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=PharmaCare' },
    { id: 4, name: 'Panadol Extra', price: '25.000đ', imageUrl: 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=PharmaCare' },
];


function SearchPage() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Kết Quả Tìm Kiếm</h1>
                {/* Filters Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                        <div className="lg:col-span-2">
                            <label htmlFor="search-name" className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc</label>
                            <input type="text" id="search-name" defaultValue="Paracetamol" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="search-category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <select id="search-category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Tất cả</option>
                                <option selected>Thuốc giảm đau</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="search-manufacturer" className="block text-sm font-medium text-gray-700 mb-1">Nhà sản xuất</label>
                            <select id="search-manufacturer" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Tất cả</option>
                            </select>
                        </div>
                        <div>
                            <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                <i className="fas fa-filter mr-2"></i> Lọc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-700">Tìm thấy <span className="font-bold text-gray-900">{searchResults.length}</span> sản phẩm</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;