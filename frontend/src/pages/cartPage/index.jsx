import React from "react";
import { useCart } from "../../components/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, getTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Sản phẩm</th>
              <th>SL</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded mr-2"
                  />
                  <span>{item.name}</span>
                </td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-blue-600 font-bold">{item.price}₫</td>
              </tr>
            ))}
          </tbody>
          <div className="flex justify-between items-center mt-3">
            <span className="font-semibold">Tổng tiền:</span>
            <span className="font-bold text-blue-600 ">
              {getTotal().toLocaleString()}₫
            </span>
          </div>
        </table>
      )}
      <button
        className="mt-3 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600"
        onClick={() => navigate("/payment")}
      >
        Thanh toán
      </button>
    </div>
  );
};

export default CartPage;
