import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../CartContext";

const ProductCard = (props) => {
  const { item, isHot } = props;
  const { addToCart } = useCart();

  return (
    <div className="rounded-xl bg-white shadow-md hover:shadow-xl transition-transform cursor-pointer">
      <div className="relative">
        <img className="rounded-xl" src={item.image} alt="" />
        {isHot && (
          <div className="absolute top-3 left-3 bg-red-500 rounded text-white px-2 py-1 text-xs font-bold">
            Giảm {item.discount}%
          </div>
        )}
        {isHot && item.isHot && (
          <div className="absolute top-3 right-3 bg-yellow-500 rounded text-white px-2 py-1 text-xs font-bold">
            HOT
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-lg font-semibold mb-2">{item?.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">
              {item.price}đ
            </span>
            {isHot && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {item.oldPrice}đ
              </span>
            )}
          </div>
          {isHot ? (
            <div
              onClick={() => addToCart(item)}
              className="py-1 px-2 bg-blue-500 rounded-full cursor-pointer hover:opacity-70"
            >
              <ShoppingCartOutlined className="text-white" />
            </div>
          ) : (
            <div>
              <div
                onClick={() => addToCart(item)}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                Thêm Giỏ Hàng
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
