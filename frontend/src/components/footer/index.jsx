import React from 'react';
import {
  PhoneOutlined,
  HomeOutlined,
  MailOutlined,
} from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Về Pharmacy</h3>
              <p className="text-gray-400 mb-4">
                Chuyên cung cấp các dược phẩm thuốc uy tín với giá tốt nhất thị trường, đi kèm chế độ hậu mãi uy tín.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Thông Tin</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Giới thiệu công ty</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Tuyển dụng</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Điều khoản sử dụng</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Chính sách bảo mật</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Tin tức</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Hỗ Trợ Khách Hàng</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Hướng dẫn mua hàng</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Chính sách </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Chính sách y tế</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Vận chuyển & Thanh toán</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Trung tâm dươc phẩm</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <HomeOutlined className='mt-2'/>
                  <span className="text-gray-400 ml-2">123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng</span>
                </li>
                <li className="flex items-center">
                  <PhoneOutlined />
                  <span className="text-gray-400 ml-2">1800 1234 (Miễn phí)</span>
                </li>
                <li className="flex items-center">
                  <MailOutlined />
                  <span className="text-gray-400 ml-2">info@pharmacy.com</span>
                </li>
              </ul>
              
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Pharmacy. Tất cả quyền được bảo lưu.
              </div>
              
              <div className="flex space-x-6">
                <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
                <i className="fab fa-cc-jcb text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer;