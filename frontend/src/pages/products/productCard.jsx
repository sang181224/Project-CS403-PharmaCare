import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ProductCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-56 object-cover object-top"
        />
        {item.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Giảm {item.discount}%
          </div>
        )}
        {item.isHot && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            HOT
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center mb-1">
            <span className="font-medium mr-1">Thành phần:</span> {item.specs.thanhPhan}
          </div>
          <div className="flex items-center mb-1">
            <span className="font-medium mr-1">Công dụng:</span> {item.specs.congDung}
          </div>
          <div className="flex items-center mb-1">
            <span className="font-medium mr-1">Quy Cách:</span> {item.specs.quyCach}
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-1">Dạng bào chế:</span> {item.specs.dangBaoChe}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">
              {item.price}
            </span>
            {item.oldPrice > item.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {item.oldPrice}
              </span>
            )}
          </div>
          <button className="py-1 px-2 bg-blue-500 rounded-full cursor-pointer hover:opacity-70">
            <ShoppingCartOutlined className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
