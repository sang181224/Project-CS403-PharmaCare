import React from 'react';

function AdminDashboardPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Chào mừng Quản trị viên!</h1>
                <p className="text-gray-600">Tổng quan tình hình kinh doanh của toàn hệ thống.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg"><p className="text-sm text-gray-500">Tổng Doanh thu (Tháng)</p><p className="text-3xl font-bold text-gray-900 mt-2">1,25 Tỷ</p></div>
                <div className="bg-white p-6 rounded-2xl shadow-lg"><p className="text-sm text-gray-500">Lợi nhuận (Tháng)</p><p className="text-3xl font-bold text-green-600 mt-2">480 Tr</p></div>
                <div className="bg-white p-6 rounded-2xl shadow-lg"><p className="text-sm text-gray-500">Tổng số Người dùng</p><p className="text-3xl font-bold text-gray-900 mt-2">5,430</p></div>
                <div className="bg-white p-6 rounded-2xl shadow-lg"><p className="text-sm text-gray-500">Tổng số Đơn hàng</p><p className="text-3xl font-bold text-gray-900 mt-2">12,890</p></div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Doanh thu 6 tháng gần nhất</h3>
                    <img src="https://quickchart.io/chart?c={type:'line',data:{labels:['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6'],datasets:[{label:'Doanh thu (tỷ VND)',data:[1.1,1.3,1.2,1.5,1.4,1.8],fill:false,borderColor:'rgb(168,85,247)'}]}}" alt="Biểu đồ doanh thu" />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Top danh mục bán chạy</h3>
                    <img src="https://quickchart.io/chart?c={type:'doughnut',data:{labels:['Giảm đau','Vitamin','Tiêu hóa','Kháng sinh','Khác'],datasets:[{data:[35,25,18,15,7]}]}}" alt="Biểu đồ danh mục" />
                </div>
            </div>
        </>
    );
}

export default AdminDashboardPage;