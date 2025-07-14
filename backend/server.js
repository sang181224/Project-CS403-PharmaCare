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

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));


// --- CẤU HÌNH DATABASE (SỬ DỤNG CONNECTION POOL) ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();


// --- CẤU HÌNH UPLOAD FILE VỚI MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, 'product-' + Date.now() + path.extname(file.originalname))
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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
// =================================================================
// ---                       CÁC API ROUTE                       ---
// =================================================================
app.get('/', (req, res) => { // Thêm lại route gốc
    res.send('Backend PharmaCare đang hoạt động!');
});
// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
    const { hoTen, email, matKhau } = req.body;
    if (!hoTen || !email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    try {
        const hashedPassword = await bcrypt.hash(matKhau, 10);
        await pool.query(`INSERT INTO users (hoTen, email, matKhau) VALUES (?, ?, ?)`, [hoTen, email, hashedPassword]);
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email đã được sử dụng.' });
        res.status(500).json({ error: 'Lỗi server.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, matKhau } = req.body;
    if (!email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });

        const payload = { id: user.id, hoTen: user.hoTen, vaiTro: user.vaiTro };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: payload });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server.' });
    }
});

// --- PRODUCT & BATCH ROUTES ---
// --- Product Routes (Quản lý Kho) ---
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// === XEM CHI TIẾT SẢN PHẨM===
app.get('/api/products/:id', async (req, res) => {
    try {
        const [pRows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (pRows.length === 0) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        const productData = pRows[0];
        const [bRows] = await pool.query("SELECT * FROM lo_thuoc WHERE id_san_pham = ?", [req.params.id]);
        productData.batches = bRows;
        res.status(200).json(productData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// === API THÊM SẢN PHẨM MỚI (BAO GỒM LÔ HÀNG ĐẦU TIÊN) ===
app.post('/api/products', upload.single('hinh_anh'), async (req, res) => {
    const { ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, ma_lo_thuoc, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho } = req.body;
    const finalImagePath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=No+Image';

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const productSql = `INSERT INTO products (ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, hinh_anh, so_luong_ton, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const productParams = [ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, finalImagePath, so_luong_nhap, 'Còn hàng'];
        const [productResult] = await connection.query(productSql, productParams);

        const newProductId = productResult.insertId;
        const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const batchParams = [newProductId, ma_lo_thuoc, so_luong_nhap, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho];
        await connection.query(batchSql, batchParams);

        await connection.commit();
        res.status(201).json({ message: 'Thêm sản phẩm và lô hàng thành công!', productId: newProductId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// API Cập nhật thông tin sản phẩm
app.put('/api/products/:id', upload.single('hinh_anh'), async (req, res) => {
    const productId = req.params.id;
    const { ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta } = req.body;

    try {
        const [existingProduct] = await pool.query('SELECT hinh_anh FROM products WHERE id = ?', [productId]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }
        const oldImagePath = existingProduct[0].hinh_anh;

        let finalImagePath = oldImagePath;
        if (req.file) {
            finalImagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const sql = `UPDATE products SET ten_thuoc = ?, ma_thuoc = ?, danh_muc = ?, nha_san_xuat = ?, gia_ban = ?, don_vi_tinh = ?, mo_ta = ?, hinh_anh = ? WHERE id = ?`;
        const params = [ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, finalImagePath, productId];

        await pool.query(sql, params);

        // Xóa ảnh cũ nếu có ảnh mới được tải lên và ảnh cũ là file cục bộ
        if (req.file && oldImagePath && oldImagePath.includes('/uploads/')) {
            const filename = path.basename(oldImagePath);
            const localPath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(localPath)) {
                fs.unlink(localPath, (err) => {
                    if (err) console.error("Lỗi khi xóa ảnh cũ:", err);
                });
            }
        }

        res.status(200).json({ message: 'Cập nhật sản phẩm thành công!' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API Xóa một sản phẩm
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT hinh_anh FROM products WHERE id = ?', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa.' });
        }
        const imageUrl = rows[0].hinh_anh;

        await pool.query("DELETE FROM products WHERE id = ?", [productId]);

        if (imageUrl && imageUrl.includes('/uploads/')) {
            const filename = path.basename(imageUrl);
            const localPath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(localPath)) {
                fs.unlink(localPath, (err) => { if (err) console.error("Lỗi xóa file ảnh:", err); });
            }
        }
        res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  API Thêm một lô hàng mới
app.post('/api/batches', async (req, res) => {
    const { id_san_pham, ma_lo_thuoc, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho } = req.body;
    if (!id_san_pham || !ma_lo_thuoc || !so_luong_nhap) return res.status(400).json({ error: 'Thông tin bắt buộc bị thiếu.' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const batchParams = [id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho];
        await connection.query(batchSql, batchParams);

        const updateProductSql = `UPDATE products SET so_luong_ton = so_luong_ton + ?, trang_thai = 'Còn hàng' WHERE id = ?`;
        await connection.query(updateProductSql, [so_luong_nhap, id_san_pham]);

        await connection.commit();
        res.status(201).json({ message: 'Nhập lô hàng mới thành công!' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

//  API Quản lý Đơn hàng

// API lấy danh sách đơn hàng
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM don_hang ORDER BY ngay_dat DESC");
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// API lấy chi tiết một đơn hàng
app.get('/api/orders/:id', async (req, res) => {
    try {
        const [orderRows] = await pool.query("SELECT * FROM don_hang WHERE id = ?", [req.params.id]);
        if (orderRows.length === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
        const orderData = orderRows[0];
        const itemsSql = `SELECT ct.*, p.ten_thuoc, p.hinh_anh FROM chi_tiet_don_hang ct JOIN products p ON ct.id_san_pham = p.id WHERE ct.id_don_hang = ?`;
        const [itemRows] = await pool.query(itemsSql, [req.params.id]);
        orderData.items = itemRows;
        res.status(200).json(orderData);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// API Cập nhật trạng thái đơn hàng
app.put('/api/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Trạng thái không được để trống.' });
    try {
        const [result] = await pool.query("UPDATE don_hang SET trang_thai = ? WHERE id = ?", [status, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
        res.status(200).json({ message: 'Cập nhật trạng thái thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// API Xóa một đơn hàng 
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM don_hang WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng để xóa.' });
        res.status(200).json({ message: 'Xóa đơn hàng thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});
// API Tạo một đơn hàng mới (với mã hóa đơn chuyên nghiệp)
app.post('/api/orders', async (req, res) => {
    const { customerInfo, items } = req.body;

    if (!customerInfo || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thông tin khách hàng và sản phẩm không được để trống.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // --- Logic tạo mã hóa đơn mới ---
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2)
            + ('0' + (today.getMonth() + 1)).slice(-2)
            + ('0' + today.getDate()).slice(-2);
        const searchPattern = `HD-${datePrefix}-%`;

        // Tìm số thứ tự lớn nhất trong ngày
        const [lastOrder] = await connection.query(
            "SELECT ma_don_hang FROM don_hang WHERE ma_don_hang LIKE ? ORDER BY ma_don_hang DESC LIMIT 1",
            [searchPattern]
        );

        let newSequence = 1;
        if (lastOrder.length > 0) {
            const lastSeq = parseInt(lastOrder[0].ma_don_hang.split('-')[2], 10);
            newSequence = lastSeq + 1;
        }

        const orderCode = `HD-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;
        // --- Kết thúc logic tạo mã ---


        // 1. Tính toán tổng tiền
        const totalAmount = items.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0);

        // 2. Thêm vào bảng `don_hang`
        const orderSql = `INSERT INTO don_hang (ma_don_hang, ten_khach_hang, dia_chi_giao, so_dien_thoai, trang_thai, tong_tien) VALUES (?, ?, ?, ?, ?, ?)`;
        const orderParams = [orderCode, customerInfo.ten_khach_hang, customerInfo.dia_chi_giao, customerInfo.so_dien_thoai, 'Đang xử lý', totalAmount];
        const [orderResult] = await connection.query(orderSql, orderParams);
        const newOrderId = orderResult.insertId;

        // 3. Thêm từng sản phẩm vào `chi_tiet_don_hang`
        const itemPromises = items.map(item => {
            const itemSql = `INSERT INTO chi_tiet_don_hang (id_don_hang, id_san_pham, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?)`;
            return connection.query(itemSql, [newOrderId, item.id_san_pham, item.so_luong, item.don_gia, item.so_luong * item.don_gia]);
        });
        await Promise.all(itemPromises);

        // 4. Cập nhật (trừ) số lượng tồn kho trong bảng `products`
        const stockPromises = items.map(item => {
            const stockSql = `UPDATE products SET so_luong_ton = so_luong_ton - ? WHERE id = ?`;
            return connection.query(stockSql, [item.so_luong, item.id_san_pham]);
        });
        await Promise.all(stockPromises);

        // Nếu tất cả thành công
        await connection.commit();
        res.status(201).json({ message: `Tạo đơn hàng ${orderCode} thành công!`, orderId: newOrderId });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// --- KHỞI ĐỘNG SERVER ---
app.listen(PORT, () => {
    console.log(`Server PharmaCare đang chạy tại http://localhost:${PORT}`);
});