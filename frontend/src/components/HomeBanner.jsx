import React from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';

const bannerData = [
    {
        image: "https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Top_Banner1440x414_2_82a10f6f68.png",
        title: "Thuốc Giảm Đau Hiệu Quả",
        description: "Giảm nhanh các cơn đau đầu, đau cơ, đau bụng... với sản phẩm chất lượng cao.",
        buttonText: "Mua Ngay",
        link: "/product"
    },
    {
        image: "https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DD_Desktop_Main_Banner_1440x414_63406c9ae8.jpg",
        title: "Hạ Sốt & Cảm Cúm Nhanh Chóng",
        description: "Dứt điểm cảm lạnh, sổ mũi và sốt với thuốc đặc trị từ thương hiệu uy tín.",
        buttonText: "Khám Phá Ngay",
        link: "/product"
    },
    {
        image: "https://cdn.nhathuoclongchau.com.vn/unsafe/2560x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/banner_web_tach_nen_2_ae3de34a16.png",
        title: "Bổ Sung Vitamin Mỗi Ngày",
        description: "Nâng cao sức đề kháng và cải thiện sức khỏe với các sản phẩm vitamin chất lượng cao.",
        buttonText: "Xem Sản Phẩm",
        link: "/product"
    }
];

const BannerSlide = ({ slide }) => {
    const navigate = useNavigate();
    return (
        <div className="relative h-[450px] overflow-hidden">
            <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                {/* Xóa mx-auto để nội dung căn lề trái */}
                <div className="max-w-7xl w-full px-8 lg:px-16">
                    <div className="max-w-xl text-white">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            {slide.title}
                        </h2>
                        <p className="text-lg mb-6">
                            {slide.description}
                        </p>
                        <button
                            onClick={() => navigate(slide.link)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors text-base"
                        >
                            {slide.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function HomeBanner() {
    return (
        // Thêm arrows={true} để hiện nút chuyển slide
        <Carousel autoplay arrows={true}>
            {bannerData.map((slide, index) => (
                // Antd Carousel yêu cầu mỗi slide phải có một thẻ div bọc ngoài
                <div key={index}>
                    <BannerSlide slide={slide} />
                </div>
            ))}
        </Carousel>
    );
}

export default HomeBanner;