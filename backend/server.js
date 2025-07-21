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
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_very_secret_key_for_pharmacare';

// --- CẤU HÌNH MIDDLEWARE TOÀN CỤC ---

// SỬA LẠI CẤU HÌNH CORS ĐỂ CHẤP NHẬN HEADER AUTHORIZATION
const corsOptions = {
  origin: 'https://project-cs-403-pharma-care.vercel.app',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization" // Dòng quan trọng nhất
};
app.use(cors(corsOptions));

app.use(express.json());
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// --- CẤU HÌNH DATABASE ---
const pool = mysql.createPool({
    host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, port: process.env.DB_PORT, ssl: { rejectUnauthorized: true },
    waitForConnections: true, connectionLimit: 10, queueLimit: 0
}).promise();

// --- CẤU HÌNH UPLOAD FILE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, 'product-' + Date.now() + path.extname(file.originalname))
});
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) return cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// --- MIDDLEWARE XÁC THỰC ---
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
const softCheckAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return next();
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (!err) req.user = user;
        next();
    });
};
const checkRole = (allowedRoles) => (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.vaiTro)) {
        next();
    } else {
        res.status(403).json({ error: 'Không có quyền truy cập.' });
    }
};

// =================================================================
// ---                       CÁC API ROUTE                       ---
// =================================================================

// --- PUBLIC & AUTH ROUTES ---
app.get('/', (req, res) => res.send('Backend PharmaCare đang hoạt động!'));

app.post('/api/register', async (req, res) => {
    const { hoTen, email, matKhau } = req.body;
    if (!hoTen || !email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    try {
        const hashedPassword = await bcrypt.hash(matKhau, 10);
        await pool.query(`INSERT INTO users (hoTen, email, matKhau, vaiTro) VALUES (?, ?, ?, 'thanh_vien')`, [hoTen, email, hashedPassword]);
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
        if (user.trang_thai === 'tam_khoa') return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa.' });
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        const payload = { id: user.id, hoTen: user.hoTen, email: user.email, vaiTro: user.vaiTro };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: payload });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server.' });
    }
});

app.get('/api/public/products', async (req, res) => {
    try {
        const { search, category, page = 1, limit = 12 } = req.query;
        let whereClauses = ["so_luong_ton > 0", "trang_thai = 'Còn hàng'"];
        const params = [];
        if (search) { whereClauses.push(`ten_thuoc LIKE ?`); params.push(`%${search}%`); }
        if (category) { whereClauses.push(`danh_muc = ?`); params.push(category); }
        const whereSql = `WHERE ${whereClauses.join(' AND ')}`;
        const countSql = `SELECT COUNT(*) as totalItems FROM products ${whereSql}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;
        const dataSql = `SELECT id, ten_thuoc, gia_ban, hinh_anh, danh_muc FROM products ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/public/categories', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT danh_muc FROM products WHERE danh_muc IS NOT NULL AND danh_muc != '' AND trang_thai = 'Còn hàng'");
        res.status(200).json(rows.map(row => row.danh_muc));
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/public/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/public/consultations', softCheckAuth, async (req, res) => {
    const { ten_nguoi_gui, email_nguoi_gui, tieu_de, noi_dung } = req.body;
    const finalName = req.user ? req.user.hoTen : ten_nguoi_gui;
    const finalEmail = req.user ? req.user.email : email_nguoi_gui;
    if (!finalName || !noi_dung) return res.status(400).json({ error: 'Tên và nội dung không được để trống.' });
    try {
        await pool.query(`INSERT INTO yeu_cau_tu_van (ten_nguoi_gui, email_nguoi_gui, tieu_de, noi_dung, trang_thai) VALUES (?, ?, ?, ?, 'Mới')`, [finalName, finalEmail, tieu_de, noi_dung]);
        res.status(201).json({ message: 'Gửi yêu cầu tư vấn thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/orders', softCheckAuth, async (req, res) => {
    const { customerInfo, items } = req.body;
    const userId = req.user ? req.user.id : null;
    if (!customerInfo || !items || !items.length) return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        const [lastOrder] = await connection.query("SELECT ma_don_hang FROM don_hang WHERE ma_don_hang LIKE ? ORDER BY id DESC LIMIT 1", [`HD-${datePrefix}-%`]);
        let newSequence = 1;
        if (lastOrder.length > 0) newSequence = parseInt(lastOrder[0].ma_don_hang.split('-')[2]) + 1;
        const orderCode = `HD-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;
        const totalAmount = items.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0);
        const orderSql = `INSERT INTO don_hang (ma_don_hang, id_thanh_vien, ten_khach_hang, dia_chi_giao, so_dien_thoai, trang_thai, tong_tien) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [orderResult] = await connection.query(orderSql, [orderCode, userId, customerInfo.ten_khach_hang, customerInfo.dia_chi_giao, customerInfo.so_dien_thoai, 'Đang xử lý', totalAmount]);
        const newOrderId = orderResult.insertId;
        for (const item of items) {
            await connection.query(`INSERT INTO chi_tiet_don_hang (id_don_hang, id_san_pham, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?)`, [newOrderId, item.id_san_pham, item.so_luong, item.don_gia, item.so_luong * item.don_gia]);
            await connection.query(`UPDATE products SET so_luong_ton = so_luong_ton - ? WHERE id = ?`, [item.so_luong, item.id_san_pham]);
        }
        await connection.commit();
        res.status(201).json({ message: `Tạo đơn hàng ${orderCode} thành công!`, orderId: newOrderId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo đơn hàng.' });
    } finally {
        connection.release();
    }
});

// --- USER-SPECIFIC ROUTES (Cần đăng nhập) ---
app.get('/api/my/orders', checkAuth, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM don_hang WHERE id_thanh_vien = ? ORDER BY ngay_dat DESC", [req.user.id]);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/my/orders/:id', checkAuth, async (req, res) => {
    try {
        const [orderRows] = await pool.query("SELECT * FROM don_hang WHERE id = ? AND id_thanh_vien = ?", [req.params.id, req.user.id]);
        if (orderRows.length === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
        const orderData = orderRows[0];
        const [itemRows] = await pool.query(`SELECT ct.*, p.ten_thuoc, p.hinh_anh FROM chi_tiet_don_hang ct JOIN products p ON ct.id_san_pham = p.id WHERE ct.id_don_hang = ?`, [req.params.id]);
        orderData.items = itemRows;
        res.status(200).json(orderData);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/my/profile', checkAuth, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, hoTen, email, soDienThoai, diaChi FROM users WHERE id = ?", [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/my/profile', checkAuth, async (req, res) => {
    try {
        const { hoTen, soDienThoai, diaChi } = req.body;
        await pool.query("UPDATE users SET hoTen = ?, soDienThoai = ?, diaChi = ? WHERE id = ?", [hoTen, soDienThoai, diaChi, req.user.id]);
        res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/my/consultations', checkAuth, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM yeu_cau_tu_van WHERE email_nguoi_gui = ? ORDER BY ngay_gui DESC", [req.user.email]);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- PROTECTED ROUTES (Nhân viên & Admin) ---
const apiRouter = express.Router();
apiRouter.use(checkAuth);

// Products
apiRouter.get('/products', async (req, res) => {
    try {
        const { search, status, category, nha_san_xuat, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let whereClauses = [];
        const params = [];
        if (search) { whereClauses.push(`(ten_thuoc LIKE ? OR ma_thuoc LIKE ?)`); params.push(`%${search}%`, `%${search}%`); }
        if (status) { whereClauses.push(`trang_thai = ?`); params.push(status); }
        if (category) { whereClauses.push(`danh_muc = ?`); params.push(category); }
        if (nha_san_xuat) { whereClauses.push(`nha_san_xuat = ?`); params.push(nha_san_xuat); }
        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const countSql = `SELECT COUNT(*) as totalItems FROM products ${whereSql}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const dataSql = `SELECT * FROM products ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.get('/products/:id', async (req, res) => {
    try {
        const [pRows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (pRows.length === 0) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        const productData = pRows[0];
        const [bRows] = await pool.query("SELECT * FROM lo_thuoc WHERE id_san_pham = ?", [req.params.id]);
        productData.batches = bRows;
        res.status(200).json(productData);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.post('/products', upload.single('hinh_anh'), async (req, res) => {
    const { ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, ma_lo_thuoc, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho } = req.body;
    const finalImagePath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=No+Image';
    if (!ten_thuoc || !ma_thuoc || !gia_ban || !ma_lo_thuoc || !so_luong_nhap) return res.status(400).json({ error: 'Thông tin sản phẩm và lô hàng là bắt buộc.' });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const initialQuantity = parseInt(so_luong_nhap, 10);
        let initialStatus = initialQuantity > 20 ? 'Còn hàng' : (initialQuantity > 0 ? 'Sắp hết hàng' : 'Hết hàng');
        const productSql = `INSERT INTO products (ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, hinh_anh, so_luong_ton, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [productResult] = await connection.query(productSql, [ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, finalImagePath, initialQuantity, initialStatus]);
        const newProductId = productResult.insertId;
        const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, don_gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await connection.query(batchSql, [newProductId, ma_lo_thuoc, initialQuantity, initialQuantity, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho]);
        await connection.commit();
        res.status(201).json({ message: 'Thêm sản phẩm và lô hàng thành công!', productId: newProductId });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Mã thuốc hoặc mã lô đã tồn tại.' });
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

apiRouter.put('/products/:id/archive', async (req, res) => {
    try {
        const [result] = await pool.query("UPDATE products SET trang_thai = 'Ngừng kinh doanh', so_luong_ton = 0 WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        await pool.query("DELETE FROM lo_thuoc WHERE id_san_pham = ?", [req.params.id]);
        res.status(200).json({ message: 'Đã chuyển sản phẩm sang trạng thái Ngừng kinh doanh!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.put('/products/:id/restore', async (req, res) => {
    try {
        const [result] = await pool.query("UPDATE products SET trang_thai = 'Hết hàng' WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        res.status(200).json({ message: 'Đã đưa sản phẩm kinh doanh trở lại!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Batches
apiRouter.post('/batches', async (req, res) => {
    const { id_san_pham, ma_lo_thuoc, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho } = req.body;
    if (!id_san_pham || !ma_lo_thuoc || !so_luong_nhap) return res.status(400).json({ error: 'Thông tin bắt buộc bị thiếu.' });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const newQuantity = parseInt(so_luong_nhap, 10);
        const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, don_gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await connection.query(batchSql, [id_san_pham, ma_lo_thuoc, newQuantity, newQuantity, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho]);
        const updateProductSql = `UPDATE products SET so_luong_ton = so_luong_ton + ?, trang_thai = CASE WHEN (so_luong_ton + ?) > 20 THEN 'Còn hàng' WHEN (so_luong_ton + ?) > 0 THEN 'Sắp hết hàng' ELSE 'Hết hàng' END WHERE id = ?`;
        await connection.query(updateProductSql, [newQuantity, newQuantity, newQuantity, id_san_pham]);
        await connection.commit();
        res.status(201).json({ message: 'Nhập lô hàng mới thành công!' });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Mã lô hàng này đã tồn tại.' });
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Orders (Admin/Employee actions)
apiRouter.get('/orders', async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        let whereClause = "WHERE 1=1";
        const params = [];
        if (search) { whereClause += ` AND (ma_don_hang LIKE ? OR ten_khach_hang LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
        if (status) { whereClause += ` AND trang_thai = ?`; params.push(status); }
        const countSql = `SELECT COUNT(*) as totalItems FROM don_hang ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;
        const dataSql = `SELECT * FROM don_hang ${whereClause} ORDER BY ngay_dat DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.get('/orders/:id', async (req, res) => {
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

apiRouter.put('/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Trạng thái không được để trống.' });
    try {
        const [result] = await pool.query("UPDATE don_hang SET trang_thai = ? WHERE id = ?", [status, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
        res.status(200).json({ message: 'Cập nhật trạng thái thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.delete('/orders/:id', async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM don_hang WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
        res.status(200).json({ message: 'Xóa đơn hàng thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.post('/orders/:id/create-invoice', async (req, res) => {
    const orderId = req.params.id;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [existingInvoice] = await connection.query("SELECT id FROM hoa_don WHERE id_don_hang = ?", [orderId]);
        if (existingInvoice.length > 0) throw new Error('Đơn hàng này đã được xuất hóa đơn.');
        const [orderRows] = await connection.query("SELECT * FROM don_hang WHERE id = ?", [orderId]);
        if (orderRows.length === 0) throw new Error('Không tìm thấy đơn hàng.');
        const order = orderRows[0];
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2);
        const [lastInvoice] = await connection.query("SELECT so_hoa_don FROM hoa_don WHERE so_hoa_don LIKE ? ORDER BY id DESC LIMIT 1", [`INV${datePrefix}-%`]);
        let newSequence = 1;
        if (lastInvoice.length > 0) newSequence = parseInt(lastInvoice[0].so_hoa_don.split('-')[1]) + 1;
        const invoiceCode = `INV${datePrefix}-${newSequence.toString().padStart(4, '0')}`;
        const invoiceSql = `INSERT INTO hoa_don (so_hoa_don, id_don_hang, ngay_xuat_hoa_don, ten_khach_hang, trang_thai, tong_tien) VALUES (?, ?, ?, ?, ?, ?)`;
        const [invoiceResult] = await connection.query(invoiceSql, [invoiceCode, orderId, new Date(), order.ten_khach_hang, 'Đã thanh toán', order.tong_tien]);
        const newInvoiceId = invoiceResult.insertId;
        const [orderItems] = await connection.query("SELECT id_san_pham, so_luong, don_gia, thanh_tien, (SELECT ten_thuoc FROM products WHERE id = id_san_pham) as ten_san_pham FROM chi_tiet_don_hang WHERE id_don_hang = ?", [orderId]);
        for (const item of orderItems) {
            await connection.query(`INSERT INTO chi_tiet_hoa_don (id_hoa_don, id_san_pham, ten_san_pham, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?, ?)`, [newInvoiceId, item.id_san_pham, item.ten_san_pham, item.so_luong, item.don_gia, item.thanh_tien]);
        }
        await connection.commit();
        res.status(201).json({ message: `Tạo hóa đơn ${invoiceCode} thành công!`, invoiceId: newInvoiceId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Invoices
apiRouter.get('/invoices', async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        let baseSql = `FROM hoa_don hd JOIN don_hang dh ON hd.id_don_hang = dh.id`;
        const params = [];
        let whereClauses = [];
        if (search) { whereClauses.push(`(hd.so_hoa_don LIKE ? OR hd.ten_khach_hang LIKE ?)`); params.push(`%${search}%`, `%${search}%`); }
        if (status) { whereClauses.push(`hd.trang_thai = ?`); params.push(status); }
        if (whereClauses.length > 0) baseSql += " WHERE " + whereClauses.join(" AND ");
        const countSql = `SELECT COUNT(*) as totalItems ${baseSql}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;
        const dataSql = `SELECT hd.*, dh.ma_don_hang ${baseSql} ORDER BY hd.ngay_xuat_hoa_don DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.get('/invoices/:id', async (req, res) => {
    try {
        const invoiceSql = `SELECT hd.*, dh.ma_don_hang FROM hoa_don hd JOIN don_hang dh ON hd.id_don_hang = dh.id WHERE hd.id = ?`;
        const [invoiceRows] = await pool.query(invoiceSql, [req.params.id]);
        if (invoiceRows.length === 0) return res.status(404).json({ error: 'Không tìm thấy hóa đơn.' });
        const invoiceData = invoiceRows[0];
        const itemsSql = "SELECT * FROM chi_tiet_hoa_don WHERE id_hoa_don = ?";
        const [itemRows] = await pool.query(itemsSql, [req.params.id]);
        invoiceData.items = itemRows;
        res.status(200).json(invoiceData);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Consultations (Reply)
apiRouter.put('/consultations/:id/reply', async (req, res) => {
    const { phanHoi } = req.body;
    if (!phanHoi) return res.status(400).json({ error: 'Nội dung phản hồi không được để trống.' });
    try {
        const sql = `UPDATE yeu_cau_tu_van SET phan_hoi = ?, trang_thai = 'Đã trả lời', ngay_tra_loi = CURRENT_TIMESTAMP WHERE id = ?`;
        const [result] = await pool.query(sql, [phanHoi, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy yêu cầu.' });
        res.status(200).json({ message: 'Gửi phản hồi thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Receipts & Issues
apiRouter.get('/receipts', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const params = [];
        if (search) { whereClause += ` AND (pn.ma_phieu_nhap LIKE ? OR ncc.ten_nha_cung_cap LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
        const countSql = `SELECT COUNT(*) as totalItems FROM phieu_nhap pn LEFT JOIN nha_cung_cap ncc ON pn.id_nha_cung_cap = ncc.id ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const dataSql = `SELECT pn.*, ncc.ten_nha_cung_cap, u.hoTen as ten_nhan_vien FROM phieu_nhap pn LEFT JOIN nha_cung_cap ncc ON pn.id_nha_cung_cap = ncc.id LEFT JOIN users u ON pn.id_nhan_vien = u.id ${whereClause} ORDER BY pn.ngay_nhap DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.post('/receipts', async (req, res) => {
    const { receiptInfo, items } = req.body;
    const userId = req.user.id;
    if (!receiptInfo || !items || !items.length) return res.status(400).json({ error: 'Thông tin không hợp lệ.' });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        const [lastReceipt] = await connection.query("SELECT ma_phieu_nhap FROM phieu_nhap WHERE ma_phieu_nhap LIKE ? ORDER BY id DESC LIMIT 1", [`PN-${datePrefix}-%`]);
        let newSequence = 1;
        if (lastReceipt.length > 0) newSequence = parseInt(lastReceipt[0].ma_phieu_nhap.split('-')[2]) + 1;
        const receiptCode = `PN-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;
        const totalAmount = items.reduce((sum, item) => sum + (Number(item.so_luong_nhap || 0) * Number(item.don_gia_nhap || 0)), 0);
        const receiptSql = `INSERT INTO phieu_nhap (ma_phieu_nhap, id_nha_cung_cap, id_nhan_vien, ngay_nhap, tong_tien, trang_thai, ghi_chu) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [receiptResult] = await connection.query(receiptSql, [receiptCode, receiptInfo.id_nha_cung_cap, userId, receiptInfo.ngay_nhap, totalAmount, 'Hoàn thành', receiptInfo.ghi_chu]);
        const newReceiptId = receiptResult.insertId;
        for (const item of items) {
            const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, don_gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const [batchResult] = await connection.query(batchSql, [item.id_san_pham, item.ma_lo_thuoc, item.so_luong_nhap, item.so_luong_nhap, item.don_gia_nhap, item.ngay_san_xuat, item.han_su_dung, item.vi_tri_kho]);
            const newBatchId = batchResult.insertId;
            const detailSql = `INSERT INTO chi_tiet_phieu_nhap (id_phieu_nhap, id_lo_thuoc, so_luong_nhap, don_gia_nhap, thanh_tien) VALUES (?, ?, ?, ?, ?)`;
            await connection.query(detailSql, [newReceiptId, newBatchId, item.so_luong_nhap, item.don_gia_nhap, item.thanh_tien]);
            const newQuantity = parseInt(item.so_luong_nhap, 10);
            const updateProductSql = `UPDATE products SET so_luong_ton = so_luong_ton + ?, trang_thai = CASE WHEN (so_luong_ton + ?) > 20 THEN 'Còn hàng' WHEN (so_luong_ton + ?) > 0 THEN 'Sắp hết hàng' ELSE 'Hết hàng' END WHERE id = ?`;
            await connection.query(updateProductSql, [newQuantity, newQuantity, newQuantity, item.id_san_pham]);
        }
        await connection.commit();
        res.status(201).json({ message: `Tạo phiếu nhập ${receiptCode} thành công!`, receiptId: newReceiptId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

apiRouter.get('/issues', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const params = [];
        if (search) { whereClause += ` AND (px.ma_phieu_xuat LIKE ? OR dh.ma_don_hang LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
        const countSql = `SELECT COUNT(*) as totalItems FROM phieu_xuat px LEFT JOIN don_hang dh ON px.id_don_hang = dh.id ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const dataSql = `SELECT px.*, u.hoTen as ten_nhan_vien, dh.ma_don_hang FROM phieu_xuat px LEFT JOIN users u ON px.id_nhan_vien = u.id LEFT JOIN don_hang dh ON px.id_don_hang = dh.id ${whereClause} ORDER BY px.ngay_xuat DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.post('/issues', async (req, res) => {
    const { issueInfo, items } = req.body;
    const userId = req.user.id;
    if (!issueInfo || !items || !items.length) return res.status(400).json({ error: 'Thông tin không hợp lệ.' });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        const [lastIssue] = await connection.query("SELECT ma_phieu_xuat FROM phieu_xuat WHERE ma_phieu_xuat LIKE ? ORDER BY id DESC LIMIT 1", [`PX-${datePrefix}-%`]);
        let newSequence = 1;
        if (lastIssue.length > 0) newSequence = parseInt(lastIssue[0].ma_phieu_xuat.split('-')[2]) + 1;
        const issueCode = `PX-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;
        const issueSql = `INSERT INTO phieu_xuat (ma_phieu_xuat, id_don_hang, id_nhan_vien, ngay_xuat, ly_do_xuat) VALUES (?, ?, ?, ?, ?)`;
        const [issueResult] = await connection.query(issueSql, [issueCode, issueInfo.id_don_hang || null, userId, new Date(), issueInfo.ly_do_xuat]);
        const newIssueId = issueResult.insertId;
        for (const item of items) {
            const [batchRows] = await connection.query('SELECT so_luong_con FROM lo_thuoc WHERE id = ?', [item.id_lo_thuoc]);
            if (batchRows.length === 0 || batchRows[0].so_luong_con < item.so_luong_xuat) throw new Error(`Lô hàng không đủ số lượng.`);
            await connection.query(`INSERT INTO chi_tiet_phieu_xuat (id_phieu_xuat, id_lo_thuoc, so_luong_xuat) VALUES (?, ?, ?)`, [newIssueId, item.id_lo_thuoc, item.so_luong_xuat]);
            await connection.query(`UPDATE lo_thuoc SET so_luong_con = so_luong_con - ? WHERE id = ?`, [item.so_luong_xuat, item.id_lo_thuoc]);
            await connection.query(`UPDATE products SET so_luong_ton = so_luong_ton - ? WHERE id = ?`, [item.so_luong_xuat, item.id_san_pham]);
        }
        await connection.commit();
        res.status(201).json({ message: `Tạo phiếu xuất ${issueCode} thành công!` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// --- ADMIN ONLY ROUTES ---
const adminRouter = express.Router();
adminRouter.use(checkAuth, checkRole(['quan_tri_vien']));

adminRouter.get('/employees', async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = "WHERE vaiTro != 'thanh_vien'";
        const params = [];
        if (search) { whereClause += " AND (hoTen LIKE ? OR email LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
        if (status) { whereClause += " AND trang_thai = ?"; params.push(status); }
        const countSql = `SELECT COUNT(*) as totalItems FROM users ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const dataSql = `SELECT id, hoTen, email, vaiTro, ngayTao, trang_thai FROM users ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.post('/employees', async (req, res) => {
    const { hoTen, email, matKhau, vaiTro } = req.body;
    if (!hoTen || !email || !matKhau || !vaiTro) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    try {
        const hashedPassword = await bcrypt.hash(matKhau, 10);
        await pool.query(`INSERT INTO users (hoTen, email, matKhau, vaiTro, trang_thai) VALUES (?, ?, ?, ?, 'hoat_dong')`, [hoTen, email, hashedPassword, vaiTro]);
        res.status(201).json({ message: `Tạo tài khoản cho ${hoTen} thành công!` });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email đã được sử dụng.' });
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get('/employees/:id', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, hoTen, email, vaiTro, trang_thai FROM users WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.put('/employees/:id/status', async (req, res) => {
    const { trang_thai } = req.body;
    if (!trang_thai) return res.status(400).json({ error: 'Trạng thái mới là bắt buộc.' });
    try {
        const [result] = await pool.query("UPDATE users SET trang_thai = ? WHERE id = ?", [trang_thai, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
        res.status(200).json({ message: `Cập nhật trạng thái thành công!` });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.get('/suppliers', checkRole(['quan_tri_vien', 'nhan_vien']), async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = '';
        const params = [];
        if (search) { whereClause = `WHERE ten_nha_cung_cap LIKE ? OR email LIKE ?`; params.push(`%${search}%`, `%${search}%`); }
        const countSql = `SELECT COUNT(*) as totalItems FROM nha_cung_cap ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);
        const dataSql = `SELECT * FROM nha_cung_cap ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);
        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.post('/suppliers', checkRole(['quan_tri_vien']), async (req, res) => {
    const { ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac } = req.body;
    if (!ten_nha_cung_cap) return res.status(400).json({ error: 'Tên nhà cung cấp là bắt buộc.' });
    try {
        const [result] = await pool.query(`INSERT INTO nha_cung_cap (ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac) VALUES (?, ?, ?, ?, ?)`, [ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac]);
        res.status(201).json({ message: 'Thêm nhà cung cấp thành công!', supplierId: result.insertId });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.get('/suppliers/:id', checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM nha_cung_cap WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp.' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.put('/suppliers/:id', checkRole(['quan_tri_vien']), async (req, res) => {
    const { ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac } = req.body;
    if (!ten_nha_cung_cap) return res.status(400).json({ error: 'Tên nhà cung cấp là bắt buộc.' });
    try {
        const [result] = await pool.query(`UPDATE nha_cung_cap SET ten_nha_cung_cap = ?, dia_chi = ?, so_dien_thoai = ?, email = ?, nguoi_lien_lac = ? WHERE id = ?`, [ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp.' });
        res.status(200).json({ message: 'Cập nhật nhà cung cấp thành công!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

adminRouter.delete('/suppliers/:id', checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM nha_cung_cap WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp.' });
        res.status(200).json({ message: 'Xóa nhà cung cấp thành công!' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(400).json({ error: 'Không thể xóa nhà cung cấp đã có phiếu nhập.' });
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get('/reports/revenue-by-month', checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT MONTH(ngay_dat) as month, SUM(tong_tien) as totalRevenue FROM don_hang WHERE YEAR(ngay_dat) = YEAR(CURDATE()) AND trang_thai = 'Đã giao' GROUP BY MONTH(ngay_dat) ORDER BY month ASC;`);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Sử dụng các router
app.use('/api', apiRouter);
app.use('/api/admin', adminRouter);

// --- KHỞI ĐỘNG SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server PharmaCare đang chạy tại cổng ${PORT}`);
});