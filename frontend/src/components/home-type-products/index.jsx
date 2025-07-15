import React, { useState } from "react";
import { products } from "./fakeData";
import ProductCard from "../hot-products/productCard";
import { dataOptions } from "./homeTypeProducts.interface"; // Giữ lại nếu dataOptions không cần types
import { useNavigate } from "react-router";

const HomeTypeProducts = () => {
  const navigate = useNavigate();

  const [optionSelected, setOptionSelected] = useState(dataOptions[0]);

  const [data, setData] = useState(
    products.filter((x) => x.category === optionSelected.value)
  );

  console.log("data: ", data);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sản Phẩm Theo Danh Mục</h2>
      <div className="flex justify-center w-full">
        <div className="flex gap-2 shadow-md rounded-full p-1 w-fit border-red-100 border">
          {dataOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setOptionSelected(item);
                setData(products.filter((x) => x.category === item.value));
              }}
              className={`px-4 py-3 text-md font-semibold rounded-full cursor-pointer ${
                optionSelected.id === item.id
                  ? "bg-blue-600 text-white"
                  : "text-black bg-white"
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 my-8">
        {data.map((item, index) => (
          <ProductCard key={index} item={item} />
        ))}
      </div>
      <div
        onClick={() => {
          navigate("/product");
        }}
        className="m-auto mb-6 px-6 py-2 bg-white hover:bg-blue-100 border-blue-600 cursor-pointer border rounded-full text-blue-600 w-fit"
      >
        Xem thêm sản phẩm
      </div>
    </div>
  );
};

export default HomeTypeProducts;
