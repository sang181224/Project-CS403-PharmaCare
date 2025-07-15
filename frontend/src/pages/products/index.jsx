import React, { useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Checkbox, Select } from "antd";
import { brands, categories } from "./products.interface"; // Vẫn có thể giữ file interface chứa dữ liệu tĩnh JS
import ProductCard from "./productCard";
import { products } from "../../components/home-type-products/fakeData";

const items = [
  {
    href: "/",
    title: <HomeOutlined />,
  },
  {
    title: "Sản phẩm",
  },
];

const Products = () => {
  const [categorySelected, setCategorySelected] = useState("");
  const [productData, setProductData] = useState(products);

  const onChangeBrand = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  const handleFilterCategory = (val) => {
    setCategorySelected(val);
    if (val === "") {
      setProductData(products);
    } else {
      const newProductsByBrand = products.filter((x) => x.category === val);
      setProductData(newProductsByBrand);
    }
  };

  return (
    <div className="mt-4 m-8">
      <Breadcrumb items={items} />
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-800">Thuốc</h1>
        <p className="text-gray-600 mt-2">
          Tìm kiếm và mua Thuốc phù hợp với nhu cầu của bạn
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleFilterCategory(category.value)}
                      className={`flex items-center w-full text-left py-1 px-2 rounded-md cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-50`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Thương hiệu</h3>
              <Checkbox.Group
                className="flex flex-col gap-2"
                options={brands}
                defaultValue={[""]}
                onChange={onChangeBrand}
              />
            </div>
          </div>
        </div>
        {/* Product List */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productData.map((product, index) => (
              <ProductCard item={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
