import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

// Custom hook để trì hoãn việc tìm kiếm (Debouncing)
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: ''
    });

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSearch = useDebounce(filters.search, 500);

    // Tải danh sách danh mục một lần
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/categories`);
                if (res.ok) {
                    setCategories(await res.json());
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // --- BƯỚC SỬA LỖI ---
    // useEffect này sẽ lắng nghe sự thay đổi trên URL
    useEffect(() => {
        const searchFromUrl = searchParams.get('search') || '';
        // Cập nhật lại state của bộ lọc nếu URL thay đổi
        if (searchFromUrl !== filters.search) {
            setFilters(prev => ({ ...prev, search: searchFromUrl }));
        }
    }, [searchParams]); // Chạy lại mỗi khi searchParams thay đổi

    // Tải sản phẩm mỗi khi bộ lọc hoặc trang thay đổi
    const fetchProducts = useCallback(async (page) => {
        setIsLoading(true);
        const activeFilters = {
            search: debouncedSearch,
            category: filters.category,
            page: page,
            limit: 12
        };
        const queryParams = new URLSearchParams(activeFilters).toString();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/products?${queryParams}`);
            const result = await res.json();
            if (res.ok) {
                setProducts(result.data);
                setPagination(result.pagination);
            }
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, filters.category]);

    useEffect(() => {
        fetchProducts(pagination.currentPage);
    }, [fetchProducts, pagination.currentPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));

        if (name === 'search') {
            if (value) {
                searchParams.set('search', value);
            } else {
                searchParams.delete('search');
            }
            setSearchParams(searchParams, { replace: true }); // Dùng replace để không tạo thêm lịch sử trình duyệt
        }

        setPagination(p => ({ ...p, currentPage: 1 }));
    };

    const handlePageChange = (pageNumber) => {
        setPagination(p => ({ ...p, currentPage: pageNumber }));
    };

    const clearFilters = () => {
        setFilters({ category: '', search: '' });
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        Sản phẩm dược phẩm
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Khám phá bộ sưu tập thuốc và dược phẩm chất lượng cao được tuyển chọn kỹ lưỡng
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                    Bộ lọc
                                </h2>
                                <button onClick={clearFilters} className="text-white/80 hover:text-white text-sm font-medium bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full">Xóa tất cả</button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="search" className="block text-sm font-semibold text-gray-700">Tìm kiếm sản phẩm</label>
                                    <div className="relative">
                                        <input type="text" id="search" name="search" value={filters.search} onChange={handleFilterChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" placeholder="Nhập tên thuốc..." />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Danh mục</label>
                                    <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white">
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div><p className="text-gray-600 font-medium">Đang tải sản phẩm...</p></div></div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map(product => (<ProductCard key={product.id} product={product} />))}
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-600 mb-6">Không có sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                                <button onClick={clearFilters} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700">Xóa bộ lọc</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;
