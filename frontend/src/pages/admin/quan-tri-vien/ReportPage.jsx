import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ReportPage() {
    const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchRevenueData = async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/api/reports/revenue-by-month`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            console.log('Dữ liệu doanh thu từ API:', data); 
            if (response.ok) {
                const labels = data.map(d => `Tháng ${d.month}`);
                const revenues = data.map(d => d.totalRevenue);

                setRevenueData({
                    labels,
                    datasets: [{
                        label: 'Doanh thu (VNĐ)',
                        data: revenues,
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(167, 139, 250, 0.5)',
                    }]
                });
            }
        };
        fetchRevenueData();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Phân tích & Báo cáo</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-4">Doanh thu theo tháng</h3>
                {/* Thay thế thẻ <img> bằng component biểu đồ */}
                <Line data={revenueData} />
            </div>
        </>
    );
}

export default ReportPage;