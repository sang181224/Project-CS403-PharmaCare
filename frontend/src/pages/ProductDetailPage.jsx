import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Giả lập dữ liệu sản phẩm (sau này sẽ lấy từ API)
const productsData = [
    { id: '1', name: 'Paracetamol 500mg', category: 'Thuốc giảm đau', price: '15.000đ / Hộp', manufacturer: 'Traphaco', description: 'Paracetamol là thuốc giảm đau, hạ sốt hiệu quả và an toàn...', imageUrl: 'https://via.placeholder.com/600x600.png/EBF4FF/76A9FA?text=PharmaCare' },
    { id: '2', name: 'Vitamin C 1000mg', category: 'Vitamin', price: '45.000đ / Tuýp', manufacturer: 'DHG Pharma', description: 'Vitamin C giúp tăng cường sức đề kháng cho cơ thể...', imageUrl: 'https://via.placeholder.com/600x600.png/ECFDF5/6EE7B7?text=PharmaCare' },
    // Thêm các sản phẩm khác nếu cần
];


function ProductDetailPage() {
    const { id } = useParams(); // Lấy `id` từ URL, ví dụ: /san-pham/1 -> id = "1"
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        // Tìm sản phẩm trong dữ liệu mẫu dựa trên id từ URL
        const foundProduct = productsData.find(p => p.id === id);
        setProduct(foundProduct);
    }, [id]); // Chạy lại mỗi khi id thay đổi

    if (!product) {
        return <div className="p-8 text-center">Đang tải thông tin sản phẩm...</div>;
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="text-sm mb-6"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/" className="text-gray-500 hover:text-blue-600">Trang chủ</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">{product.name}</span></li></ol></nav>

                {/* Product Main Info */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div> {/* Image Gallery */}
                            <div className="w-full h-96 bg-gray-100 rounded-xl mb-4"><img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" /></div>
                        </div>
                        <div> {/* Product Details & Actions */}
                            <p className="text-blue-600 font-semibold mb-2">{product.category}</p>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-gray-500 mb-4">Nhà sản xuất: <span className="font-medium text-gray-700">{product.manufacturer}</span></p>
                            <p className="text-4xl font-bold text-green-600 mb-6">{product.price}</p>
                            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                            <button className="w-full flex items-center justify-center py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"><i className="fas fa-shopping-cart mr-2"></i> Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Tabs */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="border-b border-gray-200 mb-6"><nav className="flex space-x-8 -mb-px">
                        <button onClick={() => setActiveTab('description')} className={`py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Mô tả chi tiết</button>
                        <button onClick={() => setActiveTab('usage')} className={`py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'usage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Cách dùng</button>
                    </nav></div>
                    <div>
                        {activeTab === 'description' && <div>Nội dung chi tiết về sản phẩm {product.name}...</div>}
                        {activeTab === 'usage' && <div>Hướng dẫn cách dùng và liều lượng cho sản phẩm {product.name}...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;