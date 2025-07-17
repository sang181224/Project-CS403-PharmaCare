// src/components/Header.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import avtar from "../assets/avatar.png";
import { useCart } from "./CartContext";
import { ShoppingCartOutlined } from "@ant-design/icons";

function Header() {
   const { cart } = useCart();
   const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <NavLink to="/">
                <img
                  src="https://tse2.mm.bing.net/th/id/OIP.UIDKgB8sp9ULLJOlpjhHXgHaHa?pid=Api&P=0&h=220"
                  alt=""
                  width={40}
                  height={40}
                />
                {/* <i className="fas fa-pills text-white text-xl"></i> */}
              </NavLink>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
              <p className="text-xs text-gray-500">
                Hệ thống quản lý nhà thuốc
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative mr-2">
              <ShoppingCartOutlined
                className="text-2xl text-blue-600 cursor-pointer"
                onClick={() => setOpenCart((v) => !v)}
              />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
              {/* Popup cart */}
              {openCart && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
                  <h4 className="font-bold mb-2">Giỏ hàng</h4>
                  {cart.length === 0 ? (
                    <p className="text-gray-500">Chưa có sản phẩm</p>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <li key={item.id} className="flex items-center mb-2">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded mr-2" />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">SL: {item.quantity}</div>
                          </div>
                          <div className="font-bold text-blue-600">{item.price}₫</div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="mt-3 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setOpenCart(false);
                      navigate("/cart");
                    }}
                  >
                    Xem chi tiết giỏ hàng
                  </button>
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i id="user-avatar" className="fas fa-user text-blue-600 text-lg">
                <img src={avtar} alt="" />
              </i>
            </div>
            <div>
              <p id="user-name" className="text-sm font-medium text-gray-800">
                Khách vãng lai
              </p>
              <p id="user-role" className="text-xs text-gray-600">
                Chưa đăng nhập
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;