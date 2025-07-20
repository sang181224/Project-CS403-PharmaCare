import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Hàm để lấy giỏ hàng từ localStorage
const getInitialCart = () => {
    try {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    // Khởi tạo state của giỏ hàng từ localStorage
    const [cart, setCart] = useState(getInitialCart);

    // Dùng useEffect để tự động lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
        } catch (error) {
            console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
        }
    }, [cart]); // Chạy lại mỗi khi state 'cart' thay đổi

    // Thêm sản phẩm vào giỏ
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        toast.success(`Đã thêm "${product.ten_thuoc}" vào giỏ hàng!`);
    };

    // Cập nhật số lượng
    const updateQuantity = (productId, newQuantity) => {
        const quantity = Math.max(0, newQuantity); // Đảm bảo số lượng không âm
        setCart(prevCart => {
            if (quantity === 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity: quantity } : item
            );
        });
    };

    // Xóa sản phẩm
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };
    const clearCart = () => {
        setCart([]);
    };
    // Tính tổng số lượng sản phẩm
    const cartItemCount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    // Tính tổng tiền
    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.quantity * item.gia_ban), 0);
    }, [cart]);

    const value = { 
        cart,
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        cartItemCount, 
        cartTotal 
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);