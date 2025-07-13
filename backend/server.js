const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- KHỞI TẠO VÀ CẤU HÌNH CƠ BẢN ---
const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_very_secret_key_for_pharmacare';

// --- CẤU HÌNH MIDDLEWARE TOÀN CỤC ---
app.use(cors());
app.use(express.json());

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));


// --- CẤU HÌNH DATABASE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacare'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối thành công tới database MySQL "pharmacare"');
    // ... code tạo bảng ...
});


// --- CẤU HÌNH UPLOAD FILE VỚI MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });


// --- MIDDLEWARE XÁC THỰC TOKEN ---
const checkAuth = (req, res, next) => {
    // ... code checkAuth ...
};


// =================================================================
// ---                       CÁC API ROUTE                       ---
// =================================================================

// ... (các API cũ không đổi) ...
app.get('/', (req, res) => {
    res.send('Backend PharmaCare đang hoạt động với database MySQL!');
});
// --- Auth Routes ---
app.post('/api/register', async (req, res) => {
    const { hoTen, email, matKhau } = req.body;
    if (!hoTen || !email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    try {
        const hashedPassword = await bcrypt.hash(matKhau, 10);
        const sql = `INSERT INTO users (hoTen, email, matKhau) VALUES (?, ?, ?)`;
        db.query(sql, [hoTen, email, hashedPassword], (err, results) => {
            if (err) return err.code === 'ER_DUP_ENTRY' ? res.status(409).json({ error: 'Email này đã được sử dụng.' }) : res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Đăng ký thành công!', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server.' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, matKhau } = req.body;
    if (!email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        const user = results[0];
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        const payload = { id: user.id, hoTen: user.hoTen, vaiTro: user.vaiTro };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: payload });
    });
});

app.get('/api/user/profile', checkAuth, (req, res) => {
    res.json(req.user);
});

// --- Product Routes (Quản lý Kho) ---
app.get('/api/products', (req, res) => {
    db.query("SELECT * FROM products ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});




// === API THÊM SẢN PHẨM MỚI (BAO GỒM LÔ HÀNG ĐẦU TIÊN) ===
app.post('/api/products', upload.single('hinh_anh'), (req, res) => {

    // Dữ liệu sản phẩm
    const { ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta } = req.body;
    // Dữ liệu lô hàng đầu tiên
    const { ma_lo, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung } = req.body;

    const finalImagePath = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}` : 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=No+Image';

    // Bắt đầu một transaction để đảm bảo cả 2 lệnh cùng thành công hoặc thất bại
    db.beginTransaction(err => {
        if (err) { return res.status(500).json({ error: err.message }); }

        // 1. Thêm sản phẩm vào bảng `products`
        const productSql = `INSERT INTO products (ten_thuoc, ma_thuoc, danh_muc, gia_ban, hinh_anh, so_luong_ton, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const productParams = [ten_thuoc, ma_thuoc, danh_muc, gia_ban, finalImagePath, so_luong_nhap, 'Còn hàng'];

        db.query(productSql, productParams, (err, productResult) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
            }

            const newProductId = productResult.insertId;

            // 2. Thêm lô hàng đầu tiên vào bảng `lo_thuoc`
            const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, gia_nhap, ngay_san_xuat, han_su_dung) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const batchParams = [newProductId, ma_lo, so_luong_nhap, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung];

            db.query(batchSql, batchParams, (err, batchResult) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }

                // Nếu tất cả thành công, commit transaction
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }
                    res.status(201).json({ message: 'Thêm sản phẩm và lô hàng đầu tiên thành công!', productId: newProductId });
                });
            });
        });
    });
});

// API lấy chi tiết một sản phẩm (bao gồm các lô thuốc)
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    let productData;

    const productSql = "SELECT * FROM products WHERE id = ?";
    db.query(productSql, [productId], (err, productResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (productResults.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }
        productData = productResults[0];

        const batchesSql = "SELECT * FROM lo_thuoc WHERE id_san_pham = ?";
        db.query(batchesSql, [productId], (err, batchResults) => {
            if (err) return res.status(500).json({ error: err.message });

            productData.batches = batchResults; // Gắn mảng các lô thuốc vào sản phẩm
            res.status(200).json(productData);
        });
    });
});


// API Cập nhật thông tin sản phẩm
app.put('/api/products/:id', upload.single('hinh_anh'), (req, res) => {
    const productId = req.params.id;
    const { ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta } = req.body;

    let finalImagePath;
    // Chỉ cập nhật ảnh nếu có file mới được tải lên
    if (req.file) {
        const imagePath = req.file.path.replace(/\\/g, "/");
        finalImagePath = `${req.protocol}://${req.get('host')}/${imagePath}`;
    }

    // Lấy đường dẫn ảnh cũ để có thể xóa sau nếu cần
    db.query('SELECT hinh_anh FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const oldImagePath = results[0]?.hinh_anh;

        const sql = `
            UPDATE products SET 
            ten_thuoc = ?, ma_thuoc = ?, danh_muc = ?, nha_san_xuat = ?, 
            gia_ban = ?, don_vi_tinh = ?, mo_ta = ?
            ${req.file ? ', hinh_anh = ?' : ''} 
            WHERE id = ?
        `;

        const params = [ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta];
        if (req.file) {
            params.push(finalImagePath);
        }
        params.push(productId);

        db.query(sql, params, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            // (Tùy chọn) Xóa file ảnh cũ sau khi cập nhật thành công
            if (req.file && oldImagePath) {
                // fs.unlink(path.join(__dirname, oldImagePath), (unlinkErr) => {
                //     if (unlinkErr) console.error("Lỗi khi xóa ảnh cũ:", unlinkErr);
                // });
            }

            res.status(200).json({ message: 'Cập nhật sản phẩm thành công!' });
        });
    });
});

// API Xóa một sản phẩm (Phiên bản hoàn chỉnh)
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    // 1. Lấy đường dẫn ảnh trước khi xóa
    db.query('SELECT hinh_anh FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const imageUrl = results[0]?.hinh_anh;

        // 2. Tiến hành xóa sản phẩm khỏi database
        const sql = "DELETE FROM products WHERE id = ?";
        db.query(sql, [productId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa.' });
            }

            // 3. Chỉ xóa file nếu imageUrl tồn tại và là file cục bộ (chứa '/uploads/')
            if (imageUrl && imageUrl.includes('/uploads/')) {
                const filename = path.basename(imageUrl);
                const localPath = path.join(__dirname, 'uploads', filename);

                // Thêm bước kiểm tra file tồn tại cho chắc chắn
                if (fs.existsSync(localPath)) {
                    fs.unlink(localPath, (unlinkErr) => {
                        if (unlinkErr) {
                            // Chỉ log lỗi ra console chứ không ảnh hưởng đến kết quả trả về
                            console.error("Lỗi khi xóa file ảnh cũ:", unlinkErr);
                        }
                    });
                }
            }

            res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
        });
    });
});

// --- KHỞI ĐỘNG SERVER ---
app.listen(PORT, () => {
    console.log(`Server PharmaCare đang chạy tại http://localhost:${PORT}`);
});