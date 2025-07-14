import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ConsultationPage() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');

    const fetchConsultations = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/consultations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data);
                if (data.length > 0) {
                    // Cập nhật lại request đang được chọn sau khi fetch
                    const currentSelected = data.find(r => r.id === selectedRequest?.id) || data[0];
                    setSelectedRequest(currentSelected);
                    setReplyMessage(currentSelected.phan_hoi || '');
                }
            }
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedRequest?.id]);


    useEffect(() => {
        fetchConsultations();
    }, []);

    const handleSelectRequest = (req) => {
        setSelectedRequest(req);
        // Nếu đã có phản hồi cũ, hiển thị nó. Nếu không, để trống.
        setReplyMessage(req.phan_hoi || '');
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!selectedRequest || !replyMessage) {
            alert('Vui lòng chọn yêu cầu và nhập nội dung phản hồi.');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3000/api/consultations/${selectedRequest.id}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ phanHoi: replyMessage })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchConsultations(); // Tải lại danh sách để cập nhật trạng thái
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error) {
            alert('Lỗi kết nối.');
        }
    };

    if (isLoading) return <div className="p-8">Đang tải danh sách yêu cầu...</div>;

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Hộp thư tư vấn</h1>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-2xl shadow-lg p-6">
                {/* Left Pane: Request List */}
                <div className="lg:col-span-1 border-r border-gray-200 pr-6 flex flex-col">
                    <div className="flex-grow overflow-y-auto">
                        {requests.map(req => (
                            <div
                                key={req.id}
                                className={`p-4 border-b cursor-pointer rounded-lg mb-2 ${selectedRequest?.id === req.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                                onClick={() => handleSelectRequest(req)}
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-gray-800">{req.ten_nguoi_gui}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${req.trang_thai === 'Mới' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{req.trang_thai}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 truncate">{req.tieu_de}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Conversation Detail */}
                <div className="lg:col-span-2 flex flex-col">
                    {selectedRequest ? (
                        <form onSubmit={handleReplySubmit} className="flex flex-col h-full">
                            <div className="flex-grow mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRequest.tieu_de}</h2>
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-800">{selectedRequest.ten_nguoi_gui}</p>
                                    <p className="text-gray-700 mt-2">{selectedRequest.noi_dung}</p>
                                </div>

                                {/* === PHẦN MỚI: HIỂN THỊ PHẢN HỒI CŨ (NẾU CÓ) === */}
                                {selectedRequest.trang_thai === 'Đã trả lời' && (
                                    <div className="mb-6">
                                        <h3 className="font-bold text-green-600 mb-2">✓ Bạn đã phản hồi:</h3>
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-gray-800 whitespace-pre-wrap">
                                            {selectedRequest.phan_hoi}
                                        </div>
                                    </div>
                                )}

                                {/* Form phản hồi */}
                                <h3 className="font-bold text-gray-800 mb-2">
                                    {selectedRequest.trang_thai === 'Mới' ? 'Nội dung phản hồi:' : 'Chỉnh sửa phản hồi:'}
                                </h3>
                                <textarea
                                    rows="6"
                                    className="w-full p-4 border rounded-lg"
                                    placeholder="Nhập nội dung tư vấn..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg"><FontAwesomeIcon icon={faPaperPlane} className="mr-2" />Gửi phản hồi</button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">Chưa có yêu cầu nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConsultationPage;