export const products = [
  // GIẢM ĐAU
  {
    name: "Paracetamol 500mg",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00032865_paracetamol_stada_500mg_10x10_4111_61af_large_6bbfac12ff.jpg",
    discount: 5,
    price: 15000,
    oldPrice: 16000,
    isHot: true,
    specs: {
      thanhPhan: "Paracetamol 500mg",
      congDung: "Giảm đau, hạ sốt",
      quyCach: "Hộp 10 vỉ x 10 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "stada",         // Phải viết trùng với brands.value
    category: "pain-relief" // Trùng với categories.value
  },
  {
    name: "Panadol Extra",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_01920_804d7c5e3e.jpg",
    discount: 10,
    price: 25000,
    oldPrice: 28000,
    isHot: true,
    specs: {
      thanhPhan: "Paracetamol, Caffeine",
      congDung: "Giảm đau đầu, đau cơ, cảm cúm",
      quyCach: "Hộp 10 vỉ x 10 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "gsk",
    category: "pain-relief"
  },
  {
    name: "Efferalgan 500mg",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/IMG_6371_24181498d6.jpg",
    discount: 12,
    price: 18000,
    oldPrice: 20500,
    isHot: false,
    specs: {
      thanhPhan: "Paracetamol 500mg",
      congDung: "Giảm đau nhẹ đến vừa",
      quyCach: "Hộp 1 vỉ x 10 viên",
      dangBaoChe: "Viên nén sủi",
    },
    brand: "sanofi",
    category: "pain-relief"
  },
  {
    name: "Aspirin 81mg",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/IMG_1885_8746f0f960.jpg",
    discount: 8,
    price: 14000,
    oldPrice: 15500,
    isHot: false,
    specs: {
      thanhPhan: "Acetylsalicylic acid",
      congDung: "Giảm đau nhẹ, hạ sốt",
      quyCach: "Hộp 1 vỉ x 10 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "dhg",
    category: "pain-relief"
  },

  // CẢM LẠNH, SỐT (Gộp vào hạ sốt)
  {
    name: "Decolgen Forte",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_09268_d21a0bcef4.png",
    discount: 7,
    price: 18000,
    oldPrice: 19500,
    isHot: true,
    specs: {
      thanhPhan: "Paracetamol, Phenylephrine, Chlorpheniramine",
      congDung: "Giảm triệu chứng cảm lạnh, nghẹt mũi, sốt",
      quyCach: "Hộp 1 vỉ x 10 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "united-pharma",
    category: "fever"
  },
  {
    name: "Coldacmin",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00002013_coldacmin_flu_3384_5b50_large_7d3987c67a.JPG",
    discount: 8,
    price: 20000,
    oldPrice: 22000,
    isHot: false,
    specs: {
      thanhPhan: "Paracetamol, Loratadine, Phenylephrine",
      congDung: "Điều trị cảm cúm, sổ mũi, hắt hơi",
      quyCach: "Hộp 10 vỉ x 10 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "pymepharco",
    category: "fever"
  },
  {
    name: "Tiffy",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/IMG_6379_6d8abac855.jpg",
    discount: 10,
    price: 16000,
    oldPrice: 18000,
    isHot: false,
    specs: {
      thanhPhan: "Paracetamol, Chlorpheniramine, Pseudoephedrine",
      congDung: "Giảm sốt, nghẹt mũi, cảm cúm",
      quyCach: "Hộp 1 vỉ x 10 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "traphaco",
    category: "fever"
  },
  {
    name: "Fervex",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00500736_nucleo_cmp_forte_ferrer_6x5_2323_62b5_large_da6343ed9b.jpg",
    discount: 7,
    price: 39000,
    oldPrice: 42000,
    isHot: true,
    specs: {
      thanhPhan: "Paracetamol, Pheniramine, Acid Ascorbic",
      congDung: "Giảm triệu chứng cảm lạnh và cúm",
      quyCach: "Hộp 10 gói",
      dangBaoChe: "Bột pha uống",
    },
    brand: "sanofi",
    category: "fever"
  },

  // TIÊU HÓA (chưa có trong category => cần thêm ở file 2 & 3)
  {
    name: "Smecta",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/IMG_1718_1ac3c4cfae.jpg",
    discount: 5,
    price: 105000,
    oldPrice: 110000,
    isHot: true,
    specs: {
      thanhPhan: "Diosmectite",
      congDung: "Điều trị tiêu chảy cấp, đau bụng, đầy hơi",
      quyCach: "Hộp 30 gói",
      dangBaoChe: "Bột pha uống",
    },
    brand: "ipsen",
    category: "digestive"
  },
  {
    name: "Enterogermina",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00002814_enterogemina_5ml_sanofi_20_ong_5650_60fb_large_25c7916c1f.jpg",
    discount: 10,
    price: 115000,
    oldPrice: 128000,
    isHot: true,
    specs: {
      thanhPhan: "Bacillus clausii",
      congDung: "Khôi phục hệ vi sinh đường ruột, hỗ trợ tiêu hóa",
      quyCach: "Hộp 20 ống uống",
      dangBaoChe: "Dung dịch uống",
    },
    brand: "sanofi",
    category: "digestive"
  },
  {
    name: "Imexphar Sorbitol",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/IMG_1948_f9d466092e.jpg",
    discount: 9,
    price: 25000,
    oldPrice: 28000,
    isHot: false,
    specs: {
      thanhPhan: "Sorbitol",
      congDung: "Điều trị táo bón, hỗ trợ tiêu hóa",
      quyCach: "Hộp 10 gói",
      dangBaoChe: "Bột pha uống",
    },
    brand: "imexpharm",
    category: "digestive"
  },
  {
    name: "Bioflor 250mg",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/IMG_1543_9b410fbb30.jpg",
    discount: 6,
    price: 42000,
    oldPrice: 45000,
    isHot: false,
    specs: {
      thanhPhan: "Saccharomyces boulardii",
      congDung: "Cân bằng hệ vi sinh đường ruột",
      quyCach: "Hộp 10 gói",
      dangBaoChe: "Bột pha uống",
    },
    brand: "sanofi",
    category: "digestive"
  },


  // VITAMIN
  {
    name: "Vitamin C sủi Plusssz",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_03587_e8e7e30119.jpg",
    discount: 6,
    price: 48000,
    oldPrice: 51000,
    isHot: false,
    specs: {
      thanhPhan: "Vitamin C 1000mg",
      congDung: "Tăng đề kháng, chống mệt mỏi",
      quyCach: "Tuýp 20 viên sủi",
      dangBaoChe: "Viên sủi",
    },
    brand: "polpharma",
    category: "vitamin"
  },
  {
    name: "Centrum Silver",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00022043_calcid_soft_usa_nic_pharma_10x10_4283_62ad_large_63c17ef507.jpg",
    discount: 15,
    price: 650000,
    oldPrice: 760000,
    isHot: true,
    specs: {
      thanhPhan: "Multivitamin & khoáng chất",
      congDung: "Tăng sức đề kháng, cải thiện sức khỏe người cao tuổi",
      quyCach: "Lọ 220 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "pfizer",
    category: "vitamin"
  },
  {
    name: "Becozym C",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/image_1024_15cba5c458.png",
    discount: 10,
    price: 58000,
    oldPrice: 65000,
    isHot: false,
    specs: {
      thanhPhan: "Vitamin B1, B2, B6, B12, C, Nicotinamide",
      congDung: "Bổ sung vitamin, tăng cường sức khỏe",
      quyCach: "Lọ 20 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "gsk",
    category: "vitamin"
  },
  {
    name: "Nature Made Super C",
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00146_7d022b2ddd.jpg",
    discount: 20,
    price: 380000,
    oldPrice: 475000,
    isHot: true,
    specs: {
      thanhPhan: "Vitamin C, E, Zinc",
      congDung: "Tăng sức đề kháng",
      quyCach: "Lọ 200 viên",
      dangBaoChe: "Viên nén",
    },
    brand: "pfizer",
    category: "vitamin"
  }
];
