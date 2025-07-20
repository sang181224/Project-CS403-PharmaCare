import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-auto text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{title || 'Xác nhận hành động'}</h3>
                <p className="mt-2 text-gray-600">{message || 'Bạn có chắc chắn muốn thực hiện hành động này không?'}</p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;