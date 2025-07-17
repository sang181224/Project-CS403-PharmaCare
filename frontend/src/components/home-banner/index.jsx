import React from "react";
import { Carousel } from "antd";

const HomeBanner = () => {
  return (
    <Carousel autoplay arrows={true}>
      {/* Banner 1: Thuốc giảm đau */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Top_Banner1440x414_2_82a10f6f68.png"
          className="w-full h-full object-cover object-top"
          alt="Thuốc giảm đau"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg text-white">
              <h2 className="text-4xl font-bold mb-4">
                Thuốc Giảm Đau Hiệu Quả
              </h2>
              <p className="text-lg mb-6">
                Giảm nhanh các cơn đau đầu, đau cơ, đau bụng... với sản phẩm chất lượng cao
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner 2: Thuốc cảm cúm, hạ sốt */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DD_Desktop_Main_Banner_1440x414_63406c9ae8.jpg"
          alt="Thuốc cảm cúm"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg text-white">
              <h2 className="text-4xl font-bold mb-4">
                Hạ Sốt & Cảm Cúm Nhanh Chóng
              </h2>
              <p className="text-lg mb-6">
                Dứt điểm cảm lạnh, sổ mũi và sốt với thuốc đặc trị từ thương hiệu uy tín
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                  Khám phá ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner 3: Vitamin tăng đề kháng */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://cdn.nhathuoclongchau.com.vn/unsafe/2560x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/banner_web_tach_nen_2_ae3de34a16.png"
          alt="Vitamin tăng đề kháng"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg text-white">
              <h2 className="text-4xl font-bold mb-4">
                Bổ Sung Vitamin Mỗi Ngày
              </h2>
              <p className="text-lg mb-6">
                Nâng cao sức đề kháng và cải thiện sức khỏe với các sản phẩm vitamin chất lượng cao
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                  Xem sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
};

export default HomeBanner;
