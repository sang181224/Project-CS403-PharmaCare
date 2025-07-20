import React, { useState, useEffect, useCallback } from 'react';

// Custom hook để trì hoãn việc tìm kiếm
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

// Component nhận vào một hàm callback 'onProductSelect'
function ProductSearchInput({ onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Trì hoãn 300ms

    useEffect(() => {
        if (debouncedSearchTerm) {
            const fetchProducts = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:3000/api/products?search=${debouncedSearchTerm}&limit=5`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setResults(data.data);
                    }
                } catch (error) {
                    console.error("Lỗi tìm kiếm sản phẩm:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm]);

    const handleSelect = (product) => {
        onProductSelect(product); // Gọi hàm callback để thêm sản phẩm vào phiếu
        setSearchTerm(''); // Xóa ô tìm kiếm sau khi chọn
        setResults([]);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Gõ tên hoặc mã sản phẩm để tìm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg"
            />
            {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading && <div className="p-2 text-gray-500">Đang tìm...</div>}
                    {!isLoading && results.length === 0 && debouncedSearchTerm && (
                        <div className="p-2 text-gray-500">Không tìm thấy sản phẩm.</div>
                    )}
                    {results.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                        >
                            {product.ten_thuoc}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductSearchInput;