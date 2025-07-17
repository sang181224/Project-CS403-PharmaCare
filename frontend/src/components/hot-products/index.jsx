import React from "react";
import ProductCard from "./productCard";
import { dataHotProducts } from "./hotProduct.interface";
import { useNavigate } from "react-router-dom";

const HotProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12 pb-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Sản Phẩm Nổi Bật</h1>
        <p
          onClick={() => {
            navigate("/product");
          }}
          className="text-blue-700 hover:text-blue-400 cursor-pointer text-sm font-semibold"
        >
          Xem thêm
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {dataHotProducts.map((item, index) => (
          <ProductCard key={index} item={item} isHot={true} />
        ))}
      </div>
    </div>
  );
};

export default HotProducts;
