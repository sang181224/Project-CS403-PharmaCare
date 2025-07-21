import React, { useState, useEffect } from 'react';

function MyConsultationsPage() {
    const [consultations, setConsultations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConsultations = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my/consultations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setConsultations(data);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConsultations();
    }, []);

    if (isLoading) return <div>Đang tải...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Lịch sử tư vấn</h2>
            <div className="space-y-4">
                {consultations.length > 0 ? (
                    consultations.map(item => (
                        <details key={item.id} className="bg-gray-50 p-4 rounded-lg border">
                            <summary className="font-semibold cursor-pointer">
                                {item.tieu_de || '(Không có tiêu đề)'} - <span className="text-sm text-gray-500">{new Date(item.ngay_gui).toLocaleDateString('vi-VN')}</span>
                            </summary>
                            <div className="mt-4 border-t pt-4">
                                <p className="font-semibold">Câu hỏi của bạn:</p>
                                <p className="text-gray-700 whitespace-pre-wrap">{item.noi_dung}</p>

                                {item.phan_hoi ? (
                                    <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200">
                                        <p className="font-semibold text-green-700">Phản hồi từ dược sĩ:</p>
                                        <p className="text-gray-800 whitespace-pre-wrap">{item.phan_hoi}</p>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-orange-600 text-sm">Chưa có phản hồi.</p>
                                )}
                            </div>
                        </details>
                    ))
                ) : (
                    <p>Bạn chưa có yêu cầu tư vấn nào.</p>
                )}
            </div>
        </div>
    );
}

export default MyConsultationsPage;