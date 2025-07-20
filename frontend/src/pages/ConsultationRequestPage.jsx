import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

// Component con để hiển thị yêu cầu đăng nhập
const LoginPrompt = () => (
    <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Vui lòng đăng nhập</h2>
        <p className="text-gray-600 mt-2 mb-6">Bạn cần đăng nhập để có thể gửi yêu cầu tư vấn và theo dõi câu trả lời.</p>
        <div className="flex justify-center gap-4">
            <Link to="/dang-nhap" className="inline-flex items-center bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Đăng nhập
            </Link>
            <Link to="/dang-ky" className="inline-flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Đăng ký
            </Link>
        </div>
    </div>
);

// Component con cho form gửi yêu cầu
const ConsultationForm = ({ user, formData, handleChange, handleSubmit }) => (
    <>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gửi Yêu Cầu Tư Vấn</h1>
        <p className="text-gray-600 mb-8">Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input type="text" name="ten_nguoi_gui" value={formData.ten_nguoi_gui} readOnly className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email_nguoi_gui" value={formData.email_nguoi_gui} readOnly className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
                </div>
            </div>
            <div>
                <label htmlFor="tieu_de" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (tùy chọn)</label>
                <input type="text" name="tieu_de" id="tieu_de" value={formData.tieu_de} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label htmlFor="noi_dung" className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi</label>
                <textarea name="noi_dung" id="noi_dung" value={formData.noi_dung} onChange={handleChange} rows="5" className="w-full p-2 border rounded-lg" required></textarea>
            </div>
            <div className="pt-4 text-right">
                <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">
                    Gửi yêu cầu
                </button>
            </div>
        </form>
    </>
);

function ConsultationRequestPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ tieu_de: '', noi_dung: '' });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                ten_nguoi_gui: user.hoTen,
                email_nguoi_gui: user.email
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/public/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate('/tai-khoan/tu-van'); // Chuyển đến trang lịch sử tư vấn
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến server.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white p-10 rounded-2xl shadow-lg">
                {user ? (
                    <ConsultationForm user={user} formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
                ) : (
                    <LoginPrompt />
                )}
            </div>
        </div>
    );
}

export default ConsultationRequestPage;