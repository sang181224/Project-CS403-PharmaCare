import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu
const initialRequests = [
    { id: 1, name: 'Lê Minh Anh', subject: 'Tư vấn về Paracetamol', status: 'Mới', date: '11/07/2025', content: 'Tôi bị đau đầu và sốt nhẹ, có nên dùng Paracetamol không? Tôi không có tiền sử bệnh gan hay dị ứng gì với thuốc.' },
    { id: 2, name: 'Khách vãng lai', subject: 'Hỏi về Berberin', status: 'Đã trả lời', date: '10/07/2025', content: 'Thuốc Berberin có dùng được cho trẻ em dưới 3 tuổi không?' },
    { id: 3, name: 'Trần Ngọc Mai', subject: 'Cần tư vấn vitamin', status: 'Đã trả lời', date: '10/07/2025', content: 'Xin chào, tôi cần tư vấn về một số loại vitamin tổng hợp dành cho phụ nữ.' },
];

function ConsultationPage() {
    const [requests, setRequests] = useState(initialRequests);
    const [selectedRequest, setSelectedRequest] = useState(requests[0]); // Chọn yêu cầu đầu tiên làm mặc định

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Hộp thư tư vấn</h1>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-2xl shadow-lg p-6">

                {/* Left Pane: Request List */}
                <div className="lg:col-span-1 border-r border-gray-200 pr-6 flex flex-col">
                    <input type="text" placeholder="Tìm kiếm yêu cầu..." className="w-full px-4 py-2 border rounded-lg mb-4" />
                    <div className="flex-grow overflow-y-auto">
                        {requests.map(req => (
                            <div
                                key={req.id}
                                className={`p-4 border-b cursor-pointer rounded-lg mb-2 ${selectedRequest?.id === req.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                                onClick={() => setSelectedRequest(req)}
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-gray-800">{req.name}</p>
                                    {req.status === 'Mới' && <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-semibold">{req.status}</span>}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 truncate">{req.subject}</p>
                                <p className="text-xs text-gray-400 mt-2">{req.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Conversation Detail */}
                <div className="lg:col-span-2 flex flex-col">
                    {selectedRequest ? (
                        <>
                            <div className="flex-grow mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRequest.subject}</h2>
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-800">{selectedRequest.name}</p>
                                    <p className="text-gray-700 mt-2">{selectedRequest.content}</p>
                                </div>
                                <textarea rows="8" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập nội dung phản hồi..."></textarea>
                            </div>
                            <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                                <FontAwesomeIcon icon={faPaperPlane} />
                                <span>Gửi phản hồi</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">Chọn một yêu cầu để xem chi tiết</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConsultationPage;