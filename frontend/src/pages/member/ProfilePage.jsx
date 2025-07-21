import React, { useState, useEffect } from 'react';

function ProfilePage() {
    const [profile, setProfile] = useState({ hoTen: '', email: '', soDienThoai: '', diaChi: '' });
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setProfile(data);
            setIsLoading(false);
        };
        fetchProfile();
    }, [token]);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(profile)
        });
        const result = await response.json();
        if (response.ok) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    };

    if (isLoading) return <div>Đang tải...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
            <div className="space-y-4">
                <div><label className="block text-sm font-medium">Họ và tên</label><input type="text" name="hoTen" value={profile.hoTen} onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-medium">Email</label><input type="email" name="email" value={profile.email} className="w-full p-2 border rounded-lg mt-1 bg-gray-100" readOnly /></div>
                <div><label className="block text-sm font-medium">Số điện thoại</label><input type="text" name="soDienThoai" value={profile.soDienThoai || ''} onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-medium">Địa chỉ</label><textarea name="diaChi" value={profile.diaChi || ''} onChange={handleChange} rows="3" className="w-full p-2 border rounded-lg mt-1"></textarea></div>
            </div>
            <div className="mt-6 text-right">
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg">Lưu thay đổi</button>
            </div>
        </form>
    );
}

export default ProfilePage;