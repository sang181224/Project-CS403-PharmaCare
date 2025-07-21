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
app.use(cors()); // Cho phép tất cả các kết nối
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// --- CẤU HÌNH DATABASE ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // Sẽ đọc từ biến môi trường
    user: process.env.DB_USER,       // Sẽ đọc từ biến môi trường
    password: process.env.DB_PASSWORD, // Sẽ đọc từ biến môi trường
    database: process.env.DB_DATABASE, // Sẽ đọc từ biến môi trường
    port: process.env.DB_PORT,         // Sẽ đọc từ biến môi trường
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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

// API Đăng nhập
app.post('/api/login', async (req, res) => {
    const { email, matKhau } = req.body;
    if (!email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });

        // SỬA LẠI DÒNG NÀY: Thêm 'email' vào payload
        const payload = { id: user.id, hoTen: user.hoTen, email: user.email, vaiTro: user.vaiTro };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: payload });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server.' });
    }
});
// API Đăng nhập (Đã thêm kiểm tra trạng thái tài khoản)
app.post('/api/login', async (req, res) => {
    const { email, matKhau } = req.body;
    if (!email || !matKhau) return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        }

        const user = rows[0];

        // --- BƯỚC KIỂM TRA BẢO MẬT ĐƯỢC THÊM VÀO ĐÂY ---
        if (user.trang_thai === 'tam_khoa') {
            return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
        }
        // --- KẾT THÚC BƯỚC KIỂM TRA ---

        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        }

        const payload = { id: user.id, hoTen: user.hoTen, email: user.email, vaiTro: user.vaiTro };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: payload });

    } catch (error) {
        res.status(500).json({ error: 'Lỗi server.' });
    }
});

// --- PRODUCT & BATCH ROUTES ---
// --- Product Routes (Quản lý Kho) ---
// API lấy danh sách sản phẩm (ĐÃ NÂNG CẤP - Hỗ trợ lọc theo Nhà cung cấp)
app.get('/api/products', checkAuth, async (req, res) => {
    try {
        const { search, status, category, nha_san_xuat, page = 1, limit = 1000 } = req.query; // Tăng limit để lấy hết SP
        const offset = (page - 1) * limit;

        let whereClauses = [];
        const params = [];

        if (search) {
            whereClauses.push(`(ten_thuoc LIKE ? OR ma_thuoc LIKE ?)`);
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            whereClauses.push(`trang_thai = ?`);
            params.push(status);
        }
        if (category) {
            whereClauses.push(`danh_muc = ?`);
            params.push(category);
        }
        // --- THÊM LOGIC LỌC MỚI ---
        if (nha_san_xuat) {
            whereClauses.push(`nha_san_xuat = ?`);
            params.push(nha_san_xuat);
        }
        // --- KẾT THÚC LOGIC MỚI ---

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Đếm tổng số kết quả
        const countSql = `SELECT COUNT(*) as totalItems FROM products ${whereSql}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        // Lấy dữ liệu
        const dataSql = `SELECT * FROM products ${whereSql} ORDER BY ten_thuoc ASC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        res.status(200).json({
            data: rows,
            pagination: { currentPage: parseInt(page), totalPages, totalItems }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// === XEM CHI TIẾT SẢN PHẨM===
// API LẤY CHI TIẾT SẢN PHẨM CÔNG KHAI (Đã cập nhật)
app.get('/api/public/products/:id', async (req, res) => {
    try {
        // Lấy tất cả các cột
        const sql = "SELECT * FROM products WHERE id = ?";
        const [rows] = await pool.query(sql, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API lấy chi tiết một sản phẩm (bao gồm các lô thuốc) - DÀNH CHO KHU VỰC QUẢN TRỊ
app.get('/api/products/:id', checkAuth, async (req, res) => {
    try {
        const productId = req.params.id;

        // Lấy thông tin chính của sản phẩm
        const productSql = "SELECT * FROM products WHERE id = ?";
        const [productRows] = await pool.query(productSql, [productId]);

        if (productRows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }
        const productData = productRows[0];

        // Lấy tất cả các lô hàng liên quan đến sản phẩm đó
        const batchesSql = "SELECT * FROM lo_thuoc WHERE id_san_pham = ? ORDER BY han_su_dung ASC";
        const [batchRows] = await pool.query(batchesSql, [productId]);

        // Gắn danh sách lô hàng vào đối tượng sản phẩm
        productData.batches = batchRows;

        res.status(200).json(productData);
    } catch (error) {
        console.error("Lỗi API getProductById:", error);
        res.status(500).json({ error: error.message });
    }
});
// API Thêm sản phẩm mới (BAO GỒM LÔ HÀNG ĐẦU TIÊN)
app.post('/api/products', upload.single('hinh_anh'), async (req, res) => {
    const {
        ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta,
        ma_lo_thuoc, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho
    } = req.body;

    const finalImagePath = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=No+Image';

    if (!ten_thuoc || !ma_thuoc || !gia_ban || !ma_lo_thuoc || !so_luong_nhap) {
        return res.status(400).json({ error: 'Các trường thông tin sản phẩm và lô hàng đầu tiên là bắt buộc.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // --- LOGIC MỚI: Tự động quyết định trạng thái ban đầu ---
        const initialQuantity = parseInt(so_luong_nhap, 10);
        let initialStatus = 'Hết hàng';
        if (initialQuantity > 20) {
            initialStatus = 'Còn hàng';
        } else if (initialQuantity > 0) {
            initialStatus = 'Sắp hết hàng';
        }
        // --- KẾT THÚC LOGIC MỚI ---

        // 1. Thêm sản phẩm vào bảng `products`
        const productSql = `INSERT INTO products (ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, hinh_anh, so_luong_ton, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const productParams = [ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, finalImagePath, initialQuantity, initialStatus];
        const [productResult] = await connection.query(productSql, productParams);
        const newProductId = productResult.insertId;

        // 2. Thêm lô hàng đầu tiên vào bảng `lo_thuoc`
        const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const batchParams = [newProductId, ma_lo_thuoc, initialQuantity, initialQuantity, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho];
        await connection.query(batchSql, batchParams);

        await connection.commit();
        res.status(201).json({ message: 'Thêm sản phẩm và lô hàng đầu tiên thành công!', productId: newProductId });

    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Mã thuốc hoặc mã lô đã tồn tại.' });
        }
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
// app.delete('/api/products/:id', async (req, res) => {
//     const productId = req.params.id;
//     try {
//         const [rows] = await pool.query('SELECT hinh_anh FROM products WHERE id = ?', [productId]);
//         if (rows.length === 0) {
//             return res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa.' });
//         }
//         const imageUrl = rows[0].hinh_anh;

//         await pool.query("DELETE FROM products WHERE id = ?", [productId]);

//         if (imageUrl && imageUrl.includes('/uploads/')) {
//             const filename = path.basename(imageUrl);
//             const localPath = path.join(__dirname, 'uploads', filename);
//             if (fs.existsSync(localPath)) {
//                 fs.unlink(localPath, (err) => { if (err) console.error("Lỗi xóa file ảnh:", err); });
//             }
//         }
//         res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// API "Lưu trữ" hoặc "Ngừng kinh doanh" một sản phẩm (thay cho xóa)
app.put('/api/products/:id/archive', checkAuth, async (req, res) => {
    try {
        const productId = req.params.id;

        // Thay vì DELETE, chúng ta UPDATE trạng thái
        const sql = "UPDATE products SET trang_thai = 'Ngừng kinh doanh', so_luong_ton = 0 WHERE id = ?";
        const [result] = await pool.query(sql, [productId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }

        // Cũng có thể xóa các lô hàng liên quan nếu cần
        await pool.query("DELETE FROM lo_thuoc WHERE id_san_pham = ?", [productId]);

        res.status(200).json({ message: 'Đã chuyển sản phẩm sang trạng thái Ngừng kinh doanh!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API "Kinh doanh trở lại" một sản phẩm
app.put('/api/products/:id/restore', checkAuth, async (req, res) => {
    try {
        const productId = req.params.id;

        // Đổi trạng thái về "Hết hàng", nhân viên sẽ cần nhập lô mới để bán
        const sql = "UPDATE products SET trang_thai = 'Hết hàng' WHERE id = ?";
        const [result] = await pool.query(sql, [productId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }

        res.status(200).json({ message: 'Đã đưa sản phẩm kinh doanh trở lại!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//  API Thêm một lô hàng mới
app.post('/api/batches', async (req, res) => {
    const {
        id_san_pham, ma_lo_thuoc, so_luong_nhap, gia_nhap,
        ngay_san_xuat, han_su_dung, vi_tri_kho
    } = req.body;

    if (!id_san_pham || !ma_lo_thuoc || !so_luong_nhap) {
        return res.status(400).json({ error: 'Thông tin bắt buộc bị thiếu.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Thêm lô hàng mới vào bảng `lo_thuoc`
        const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const newQuantity = parseInt(so_luong_nhap, 10);
        const batchParams = [id_san_pham, ma_lo_thuoc, newQuantity, newQuantity, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho];
        await connection.query(batchSql, batchParams);

        // 2. Cập nhật tồn kho và trạng thái của sản phẩm
        const updateProductSql = `
            UPDATE products
            SET 
                so_luong_ton = so_luong_ton + ?,
                trang_thai = CASE
                    WHEN (so_luong_ton + ?) > 20 THEN 'Còn hàng'
                    WHEN (so_luong_ton + ?) > 0 THEN 'Sắp hết hàng'
                    ELSE 'Hết hàng'
                END
            WHERE id = ?
        `;
        await connection.query(updateProductSql, [newQuantity, newQuantity, newQuantity, id_san_pham]);

        await connection.commit();
        res.status(201).json({ message: 'Nhập lô hàng mới thành công!' });

    } catch (error) {
        await connection.rollback();
        // Bắt lỗi trùng mã lô cho cùng một sản phẩm
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Mã lô hàng này đã tồn tại cho sản phẩm.' });
        }
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

//  API Quản lý Đơn hàng

// API lấy danh sách đơn hàng
app.get('/api/orders', checkAuth, async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;

        let whereClause = "WHERE 1=1"; // Bắt đầu với điều kiện luôn đúng
        const params = [];

        if (search) {
            whereClause += ` AND (ma_don_hang LIKE ? OR ten_khach_hang LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            whereClause += ` AND trang_thai = ?`;
            params.push(status);
        }

        // 1. Đếm tổng số kết quả
        const countSql = `SELECT COUNT(*) as totalItems FROM don_hang ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        // 2. Lấy dữ liệu cho trang hiện tại
        const offset = (page - 1) * limit;
        const dataSql = `SELECT * FROM don_hang ${whereClause} ORDER BY ngay_dat DESC LIMIT ? OFFSET ?`;

        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        // 3. Trả về kết quả
        res.status(200).json({
            data: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalItems: totalItems
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
// API Tạo một đơn hàng mới (Phiên bản ổn định hơn)
app.post('/api/orders', softCheckAuth, async (req, res) => {
    const { customerInfo, items } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!customerInfo || !items || !items.length) {
        return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Logic tạo mã đơn hàng
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        const [lastOrder] = await connection.query("SELECT ma_don_hang FROM don_hang WHERE ma_don_hang LIKE ? ORDER BY id DESC LIMIT 1", [`HD-${datePrefix}-%`]);
        let newSequence = 1;
        if (lastOrder.length > 0) {
            newSequence = parseInt(lastOrder[0].ma_don_hang.split('-')[2]) + 1;
        }
        const orderCode = `HD-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;

        const totalAmount = items.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0);

        // 1. Insert vào don_hang
        const orderSql = `INSERT INTO don_hang (ma_don_hang, id_thanh_vien, ten_khach_hang, dia_chi_giao, so_dien_thoai, trang_thai, tong_tien) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [orderResult] = await connection.query(orderSql, [orderCode, userId, customerInfo.ten_khach_hang, customerInfo.dia_chi_giao, customerInfo.so_dien_thoai, 'Đang xử lý', totalAmount]);
        const newOrderId = orderResult.insertId;

        // 2. Lặp và xử lý từng item một cách tuần tự để đảm bảo ổn định
        for (const item of items) {
            // 2a. Insert vào chi_tiet_don_hang
            const itemSql = `INSERT INTO chi_tiet_don_hang (id_don_hang, id_san_pham, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?)`;
            await connection.query(itemSql, [newOrderId, item.id_san_pham, item.so_luong, item.don_gia, item.so_luong * item.don_gia]);

            // 2b. Cập nhật tồn kho sản phẩm
            const stockSql = `UPDATE products SET so_luong_ton = so_luong_ton - ? WHERE id = ?`;
            await connection.query(stockSql, [item.so_luong, item.id_san_pham]);
        }

        await connection.commit();

        // Gửi phản hồi thành công
        res.status(201).json({ message: `Tạo đơn hàng ${orderCode} thành công!`, orderId: newOrderId });

    } catch (error) {
        await connection.rollback();
        console.error("LỖI KHI TẠO ĐƠN HÀNG:", error); // Log lỗi chi tiết ở backend
        res.status(500).json({ error: 'Đã xảy ra lỗi ở server khi tạo đơn hàng.' });
    } finally {
        connection.release();
    }
});
// API Tạo hóa đơn từ một đơn hàng có sẵn
app.post('/api/orders/:id/create-invoice', checkAuth, async (req, res) => {
    const orderId = req.params.id;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Kiểm tra xem đơn hàng đã có hóa đơn chưa
        const [existingInvoice] = await connection.query("SELECT id FROM hoa_don WHERE id_don_hang = ?", [orderId]);
        if (existingInvoice.length > 0) {
            throw new Error('Đơn hàng này đã được xuất hóa đơn rồi.');
        }

        // Lấy thông tin đơn hàng
        const [orderRows] = await connection.query("SELECT * FROM don_hang WHERE id = ?", [orderId]);
        if (orderRows.length === 0) throw new Error('Không tìm thấy đơn hàng.');
        const order = orderRows[0];

        // Tạo số hóa đơn mới
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2);
        const [lastInvoice] = await connection.query("SELECT so_hoa_don FROM hoa_don WHERE so_hoa_don LIKE ? ORDER BY id DESC LIMIT 1", [`HD${datePrefix}-%`]);
        let newSequence = 1;
        if (lastInvoice.length > 0) {
            newSequence = parseInt(lastInvoice[0].so_hoa_don.split('-')[1]) + 1;
        }
        const invoiceCode = `HD${datePrefix}-${newSequence.toString().padStart(4, '0')}`;

        // 1. Tạo hóa đơn mới
        const invoiceSql = `INSERT INTO hoa_don (so_hoa_don, id_don_hang, ngay_xuat_hoa_don, ten_khach_hang, trang_thai, tong_tien) VALUES (?, ?, ?, ?, ?, ?)`;
        const [invoiceResult] = await connection.query(invoiceSql, [invoiceCode, orderId, new Date(), order.ten_khach_hang, 'Đã thanh toán', order.tong_tien]);
        const newInvoiceId = invoiceResult.insertId;

        // 2. Sao chép chi tiết đơn hàng sang chi tiết hóa đơn
        const [orderItems] = await connection.query("SELECT id_san_pham, so_luong, don_gia, thanh_tien, (SELECT ten_thuoc FROM products WHERE id = id_san_pham) as ten_san_pham FROM chi_tiet_don_hang WHERE id_don_hang = ?", [orderId]);

        const itemPromises = orderItems.map(item => {
            const detailSql = `INSERT INTO chi_tiet_hoa_don (id_hoa_don, id_san_pham, ten_san_pham, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?, ?)`;
            return connection.query(detailSql, [newInvoiceId, item.id_san_pham, item.ten_san_pham, item.so_luong, item.don_gia, item.thanh_tien]);
        });
        await Promise.all(itemPromises);

        await connection.commit();
        res.status(201).json({ message: `Tạo hóa đơn ${invoiceCode} thành công!`, invoiceId: newInvoiceId });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});
// --- API TƯ VẤN ---
app.get('/api/consultations', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM yeu_cau_tu_van ORDER BY ngay_gui DESC");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API gửi phản hồi cho một yêu cầu tư vấn
app.put('/api/consultations/:id/reply', async (req, res) => {
    const { id } = req.params;
    const { phanHoi } = req.body;

    if (!phanHoi) {
        return res.status(400).json({ error: 'Nội dung phản hồi không được để trống.' });
    }

    try {
        const sql = `
            UPDATE yeu_cau_tu_van 
            SET phan_hoi = ?, trang_thai = 'Đã trả lời', ngay_tra_loi = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [phanHoi, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy yêu cầu tư vấn.' });
        }

        res.status(200).json({ message: 'Gửi phản hồi thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- GOODS RECEIPT/ISSUE ROUTES ---

// API lấy danh sách Phiếu Nhập Kho
app.get('/api/receipts', checkAuth, async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];
        if (search) {
            whereClause += ` AND (pn.ma_phieu_nhap LIKE ? OR ncc.ten_nha_cung_cap LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        const countSql = `SELECT COUNT(*) as totalItems FROM phieu_nhap pn LEFT JOIN nha_cung_cap ncc ON pn.id_nha_cung_cap = ncc.id ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        const dataSql = `
            SELECT pn.*, ncc.ten_nha_cung_cap, u.hoTen as ten_nhan_vien
            FROM phieu_nhap pn
            LEFT JOIN nha_cung_cap ncc ON pn.id_nha_cung_cap = ncc.id
            LEFT JOIN users u ON pn.id_nhan_vien = u.id
            ${whereClause}
            ORDER BY pn.ngay_nhap DESC LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API lấy chi tiết một Phiếu Nhập Kho
app.get('/api/receipts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy thông tin chung của phiếu nhập
        const receiptSql = `
            SELECT pn.*, ncc.ten_nha_cung_cap, u.hoTen as ten_nhan_vien
            FROM phieu_nhap pn
            LEFT JOIN nha_cung_cap ncc ON pn.id_nha_cung_cap = ncc.id
            LEFT JOIN users u ON pn.id_nhan_vien = u.id
            WHERE pn.id = ?
        `;
        const [receiptResult] = await pool.query(receiptSql, [id]);

        if (receiptResult.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu nhập.' });
        }
        const receiptData = receiptResult[0];

        // Lấy danh sách chi tiết các sản phẩm/lô hàng trong phiếu nhập
        const itemsSql = `
            SELECT ctpn.*, lt.ma_lo_thuoc, p.ten_thuoc
            FROM chi_tiet_phieu_nhap ctpn
            JOIN lo_thuoc lt ON ctpn.id_lo_thuoc = lt.id
            JOIN products p ON lt.id_san_pham = p.id
            WHERE ctpn.id_phieu_nhap = ?
        `;
        const [itemsResult] = await pool.query(itemsSql, [id]);

        receiptData.items = itemsResult;
        res.status(200).json(receiptData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Tạo một Phiếu Nhập Kho mới
// API Tạo một Phiếu Nhập Kho mới (Hoàn chỉnh)
app.post('/api/receipts', async (req, res) => {
    const { receiptInfo, items } = req.body;
    const userId = 1; // Giả sử nhân viên đăng nhập có id = 1

    if (!receiptInfo || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thông tin phiếu và sản phẩm không được để trống.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // --- Logic tạo mã phiếu nhập ---
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        const [lastReceipt] = await connection.query("SELECT ma_phieu_nhap FROM phieu_nhap WHERE ma_phieu_nhap LIKE ? ORDER BY id DESC LIMIT 1", [`PN-${datePrefix}-%`]);
        let newSequence = 1;
        if (lastReceipt.length > 0) {
            newSequence = parseInt(lastReceipt[0].ma_phieu_nhap.split('-')[2]) + 1;
        }
        const receiptCode = `PN-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;

        const totalAmount = items.reduce((sum, item) => sum + (Number(item.so_luong_nhap || 0) * Number(item.don_gia_nhap || 0)), 0);

        // 1. Tạo phiếu nhập chính
        const receiptSql = `INSERT INTO phieu_nhap (ma_phieu_nhap, id_nha_cung_cap, id_nhan_vien, ngay_nhap, tong_tien, trang_thai, ghi_chu) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [receiptResult] = await connection.query(receiptSql, [receiptCode, receiptInfo.id_nha_cung_cap, userId, receiptInfo.ngay_nhap, totalAmount, 'Hoàn thành', receiptInfo.ghi_chu]);
        const newReceiptId = receiptResult.insertId;

        // 2. Lặp qua từng sản phẩm để xử lý
        for (const item of items) {
            // 2a. Thêm lô thuốc mới
            const batchSql = `INSERT INTO lo_thuoc (id_san_pham, ma_lo_thuoc, so_luong_nhap, so_luong_con, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const [batchResult] = await connection.query(batchSql, [item.id_san_pham, item.ma_lo_thuoc, item.so_luong_nhap, item.so_luong_nhap, item.don_gia_nhap, item.ngay_san_xuat, item.han_su_dung, item.vi_tri_kho]);
            const newBatchId = batchResult.insertId;

            // 2b. Thêm chi tiết phiếu nhập
            const detailSql = `INSERT INTO chi_tiet_phieu_nhap (id_phieu_nhap, id_lo_thuoc, so_luong_nhap, don_gia_nhap, thanh_tien) VALUES (?, ?, ?, ?, ?)`;
            await connection.query(detailSql, [newReceiptId, newBatchId, item.so_luong_nhap, item.don_gia_nhap, item.thanh_tien]);

            // 2c. Cập nhật tồn kho sản phẩm
            await connection.query(`UPDATE products SET so_luong_ton = so_luong_ton + ? WHERE id = ?`, [item.so_luong_nhap, item.id_san_pham]);
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

// API lấy danh sách Phiếu Xuất Kho
app.get('/api/issues', checkAuth, async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];
        if (search) {
            whereClause += ` AND (px.ma_phieu_xuat LIKE ? OR dh.ma_don_hang LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        const countSql = `SELECT COUNT(*) as totalItems FROM phieu_xuat px LEFT JOIN don_hang dh ON px.id_don_hang = dh.id ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        const dataSql = `
            SELECT px.*, u.hoTen as ten_nhan_vien, dh.ma_don_hang
            FROM phieu_xuat px
            LEFT JOIN users u ON px.id_nhan_vien = u.id
            LEFT JOIN don_hang dh ON px.id_don_hang = dh.id
            ${whereClause}
            ORDER BY px.ngay_xuat DESC LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        res.status(200).json({ data: rows, pagination: { currentPage: parseInt(page), totalPages, totalItems } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API lấy chi tiết một Phiếu Xuất Kho
app.get('/api/issues/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy thông tin chung của phiếu xuất
        const issueSql = `
            SELECT px.*, u.hoTen as ten_nhan_vien, dh.ma_don_hang
            FROM phieu_xuat px
            LEFT JOIN users u ON px.id_nhan_vien = u.id
            LEFT JOIN don_hang dh ON px.id_don_hang = dh.id
            WHERE px.id = ?
        `;
        const [issueResult] = await pool.query(issueSql, [id]);

        if (issueResult.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phiếu xuất.' });
        }
        const issueData = issueResult[0];

        // Lấy danh sách chi tiết các sản phẩm/lô hàng trong phiếu xuất
        const itemsSql = `
            SELECT ctpx.*, lt.ma_lo_thuoc, p.ten_thuoc
            FROM chi_tiet_phieu_xuat ctpx
            JOIN lo_thuoc lt ON ctpx.id_lo_thuoc = lt.id
            JOIN products p ON lt.id_san_pham = p.id
            WHERE ctpx.id_phieu_xuat = ?
        `;
        const [itemsResult] = await pool.query(itemsSql, [id]);

        issueData.items = itemsResult;
        res.status(200).json(issueData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Tạo một Phiếu Xuất Kho mới
app.post('/api/issues', async (req, res) => {
    const { issueInfo, items } = req.body;
    const userId = 1; // Giả sử nhân viên đăng nhập có id = 1

    if (!issueInfo || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thông tin phiếu và sản phẩm không được để trống.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // --- Logic tạo mã phiếu xuất ---
        const today = new Date();
        const datePrefix = today.getFullYear().toString().slice(-2) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        const [lastIssue] = await connection.query("SELECT ma_phieu_xuat FROM phieu_xuat WHERE ma_phieu_xuat LIKE ? ORDER BY id DESC LIMIT 1", [`PX-${datePrefix}-%`]);
        let newSequence = 1;
        if (lastIssue.length > 0) {
            newSequence = parseInt(lastIssue[0].ma_phieu_xuat.split('-')[2]) + 1;
        }
        const issueCode = `PX-${datePrefix}-${newSequence.toString().padStart(4, '0')}`;

        // 1. Tạo phiếu xuất chính
        const issueSql = `INSERT INTO phieu_xuat (ma_phieu_xuat, id_don_hang, id_nhan_vien, ngay_xuat, ly_do_xuat) VALUES (?, ?, ?, ?, ?)`;
        const [issueResult] = await connection.query(issueSql, [issueCode, issueInfo.id_don_hang || null, userId, new Date(), issueInfo.ly_do_xuat]);
        const newIssueId = issueResult.insertId;

        // 2. Lặp qua từng sản phẩm để xử lý
        for (const item of items) {
            // Kiểm tra số lượng tồn của lô
            const [batchRows] = await connection.query('SELECT so_luong_con FROM lo_thuoc WHERE id = ?', [item.id_lo_thuoc]);
            if (batchRows.length === 0 || batchRows[0].so_luong_con < item.so_luong_xuat) {
                throw new Error(`Lô ${item.ma_lo_thuoc} không đủ số lượng tồn kho.`);
            }

            // 2a. Thêm chi tiết phiếu xuất
            const detailSql = `INSERT INTO chi_tiet_phieu_xuat (id_phieu_xuat, id_lo_thuoc, so_luong_xuat) VALUES (?, ?, ?)`;
            await connection.query(detailSql, [newIssueId, item.id_lo_thuoc, item.so_luong_xuat]);

            // 2b. Cập nhật (trừ) số lượng tồn trong lô
            await connection.query(`UPDATE lo_thuoc SET so_luong_con = so_luong_con - ? WHERE id = ?`, [item.so_luong_xuat, item.id_lo_thuoc]);

            // 2c. Cập nhật (trừ) tổng tồn kho sản phẩm
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
// --- API nhà cung cấp ---
app.get('/api/suppliers', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, ten_nha_cung_cap FROM nha_cung_cap ORDER BY ten_nha_cung_cap ASC");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN ROUTES ---
// API đặc biệt chỉ dành cho debug - tạo token thật cho vai trò được yêu cầu
app.post('/api/debug/login-as-role', (req, res) => {
    const { role } = req.body;
    let userPayload = {};

    if (role === 'thanh_vien') {
        userPayload = { id: 100, hoTen: 'Thành Viên Test', vaiTro: 'thanh_vien' };
    } else if (role === 'nhan_vien') {
        userPayload = { id: 200, hoTen: 'Nhân Viên Test', vaiTro: 'nhan_vien' };
    } else if (role === 'quan_tri_vien') {
        userPayload = { id: 1, hoTen: 'Admin Test', vaiTro: 'quan_tri_vien' };
    } else {
        return res.status(400).json({ error: 'Vai trò không hợp lệ.' });
    }

    const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({
        message: `Tạo token debug thành công cho vai trò ${role}`,
        token: token,
        user: userPayload
    });
});
// API lấy danh sách nhân viên (có tìm kiếm và lọc trạng thái)
// API lấy danh sách nhân viên (có tìm kiếm, lọc và phân trang)
app.get('/api/admin/employees', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = "WHERE vaiTro != 'thanh_vien'";
        const params = [];

        if (search) {
            whereClause += " AND (hoTen LIKE ? OR email LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            whereClause += " AND trang_thai = ?";
            params.push(status);
        }

        // 1. Đếm tổng số kết quả
        const countSql = `SELECT COUNT(*) as totalItems FROM users ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        // 2. Lấy dữ liệu cho trang hiện tại
        const dataSql = `SELECT id, hoTen, email, vaiTro, ngayTao, trang_thai FROM users ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        // 3. Trả về đúng định dạng { data, pagination }
        res.status(200).json({
            data: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalItems: totalItems
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Thêm nhân viên mới (chỉ dành cho Admin)
app.post('/api/admin/employees', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    const { hoTen, email, matKhau, vaiTro } = req.body;

    if (!hoTen || !email || !matKhau || !vaiTro) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(matKhau, 10);
        const sql = `INSERT INTO users (hoTen, email, matKhau, vaiTro, trang_thai) VALUES (?, ?, ?, ?, 'hoat_dong')`;

        await pool.query(sql, [hoTen, email, hashedPassword, vaiTro]);

        res.status(201).json({ message: `Tạo tài khoản cho nhân viên ${hoTen} thành công!` });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email này đã được sử dụng.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// API lấy chi tiết một nhân viên
app.get('/api/admin/employees/:id', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const { id } = req.params;
        // THÊM `trang_thai` VÀO CÂU LỆNH SELECT Ở ĐÂY
        const sql = "SELECT id, hoTen, email, vaiTro, trang_thai FROM users WHERE id = ?";

        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Cập nhật thông tin nhân viên
app.put('/api/admin/employees/:id', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const { id } = req.params;
        const { hoTen, vaiTro } = req.body;

        if (!hoTen || !vaiTro) {
            return res.status(400).json({ error: 'Thông tin không được để trống.' });
        }

        const sql = "UPDATE users SET hoTen = ?, vaiTro = ? WHERE id = ?";
        const [result] = await pool.query(sql, [hoTen, vaiTro, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
        }
        res.status(200).json({ message: 'Cập nhật thông tin nhân viên thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Cập nhật trạng thái (khóa/mở khóa) của nhân viên
app.put('/api/admin/employees/:id/status', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai } = req.body; // <-- SỬA LẠI TỪ 'status' THÀNH 'trang_thai'

        if (!trang_thai) {
            return res.status(400).json({ error: 'Trạng thái mới là bắt buộc.' });
        }

        const sql = "UPDATE users SET trang_thai = ? WHERE id = ?";
        const [result] = await pool.query(sql, [trang_thai, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
        }
        res.status(200).json({ message: `Cập nhật trạng thái nhân viên thành công!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API lấy danh sách Nhà cung cấp
app.get('/api/admin/suppliers', checkAuth, checkRole(['quan_tri_vien', 'nhan_vien']), async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        const params = [];
        if (search) {
            whereClause = `WHERE ten_nha_cung_cap LIKE ? OR email LIKE ? OR so_dien_thoai LIKE ?`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Đếm tổng số kết quả
        const countSql = `SELECT COUNT(*) as totalItems FROM nha_cung_cap ${whereClause}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        // Lấy dữ liệu cho trang hiện tại
        const dataSql = `SELECT * FROM nha_cung_cap ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        res.status(200).json({
            data: rows,
            pagination: { currentPage: parseInt(page), totalPages, totalItems }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Thêm Nhà cung cấp mới (chỉ dành cho Admin)
app.post('/api/admin/suppliers', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    const { ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac } = req.body;
    if (!ten_nha_cung_cap) {
        return res.status(400).json({ error: 'Tên nhà cung cấp là bắt buộc.' });
    }
    try {
        const sql = `INSERT INTO nha_cung_cap (ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac) VALUES (?, ?, ?, ?, ?)`;
        const params = [ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac];
        const [result] = await pool.query(sql, params);
        res.status(201).json({ message: 'Thêm nhà cung cấp thành công!', supplierId: result.insertId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API lấy chi tiết một nhà cung cấp
app.get('/api/admin/suppliers/:id', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM nha_cung_cap WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp.' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Cập nhật nhà cung cấp
app.put('/api/admin/suppliers/:id', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    const { ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac } = req.body;
    if (!ten_nha_cung_cap) return res.status(400).json({ error: 'Tên nhà cung cấp là bắt buộc.' });

    try {
        const sql = `UPDATE nha_cung_cap SET ten_nha_cung_cap = ?, dia_chi = ?, so_dien_thoai = ?, email = ?, nguoi_lien_lac = ? WHERE id = ?`;
        const params = [ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_lac, req.params.id];
        const [result] = await pool.query(sql, params);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp.' });
        res.status(200).json({ message: 'Cập nhật nhà cung cấp thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Xóa nhà cung cấp
app.delete('/api/admin/suppliers/:id', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM nha_cung_cap WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp.' });
        res.status(200).json({ message: 'Xóa nhà cung cấp thành công!' });
    } catch (error) {
        // Bắt lỗi khóa ngoại nếu nhà cung cấp đã có phiếu nhập
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'Không thể xóa nhà cung cấp đã có phiếu nhập. Bạn cần xóa các phiếu nhập liên quan trước.' });
        }
        res.status(500).json({ error: error.message });
    }
});
// API Báo cáo doanh thu theo tháng
app.get('/api/reports/revenue-by-month', checkAuth, checkRole(['quan_tri_vien']), async (req, res) => {
    try {
        const sql = `
            SELECT 
                MONTH(ngay_dat) as month,
                SUM(tong_tien) as totalRevenue
            FROM don_hang
            WHERE YEAR(ngay_dat) = YEAR(CURDATE()) AND trang_thai = 'Đã giao'
            GROUP BY MONTH(ngay_dat)
            ORDER BY month ASC;
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- INVOICE ROUTES ---
// API lấy danh sách hóa đơn (có phân trang và lọc)
app.get('/api/invoices', checkAuth, async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;

        let baseSql = `
            FROM hoa_don hd
            JOIN don_hang dh ON hd.id_don_hang = dh.id
        `;
        const params = [];
        const whereClauses = [];

        if (search) {
            whereClauses.push(`(hd.so_hoa_don LIKE ? OR hd.ten_khach_hang LIKE ?)`);
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            whereClauses.push(`hd.trang_thai = ?`);
            params.push(status);
        }

        if (whereClauses.length > 0) {
            baseSql += " WHERE " + whereClauses.join(" AND ");
        }

        // Đếm tổng số kết quả
        const countSql = `SELECT COUNT(*) as totalItems ${baseSql}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        // Lấy dữ liệu cho trang hiện tại
        const offset = (page - 1) * limit;
        const dataSql = `SELECT hd.*, dh.ma_don_hang ${baseSql} ORDER BY hd.ngay_xuat_hoa_don DESC LIMIT ? OFFSET ?`;

        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        res.status(200).json({
            data: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalItems: totalItems
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API lấy chi tiết một hóa đơn
app.get('/api/invoices/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy thông tin chung của hóa đơn
        const invoiceSql = `
            SELECT hd.*, dh.ma_don_hang 
            FROM hoa_don hd
            JOIN don_hang dh ON hd.id_don_hang = dh.id
            WHERE hd.id = ?
        `;
        const [invoiceRows] = await pool.query(invoiceSql, [id]);
        if (invoiceRows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy hóa đơn.' });
        }
        const invoiceData = invoiceRows[0];

        // Lấy danh sách các sản phẩm trong hóa đơn đó
        const itemsSql = "SELECT * FROM chi_tiet_hoa_don WHERE id_hoa_don = ?";
        const [itemRows] = await pool.query(itemsSql, [id]);
        invoiceData.items = itemRows;

        res.status(200).json(invoiceData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API lấy lịch sử đơn hàng của chính người dùng đang đăng nhập
app.get('/api/my/orders', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const sql = "SELECT * FROM don_hang WHERE id_thanh_vien = ? ORDER BY ngay_dat DESC";
        const [rows] = await pool.query(sql, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// --- USER-SPECIFIC ROUTES ---

// API lấy thông tin chi tiết của người dùng đang đăng nhập
app.get('/api/my/profile', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query("SELECT id, hoTen, email, soDienThoai, diaChi FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API cập nhật thông tin cá nhân
app.put('/api/my/profile', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { hoTen, soDienThoai, diaChi } = req.body;

        const sql = "UPDATE users SET hoTen = ?, soDienThoai = ?, diaChi = ? WHERE id = ?";
        await pool.query(sql, [hoTen, soDienThoai, diaChi, userId]);

        res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API LẤY SẢN PHẨM NỔI BẬT CHO TRANG CHỦ (KHÔNG PHÂN TRANG)
app.get('/api/public/homepage-products', async (req, res) => {
    try {
        const { limit = 8, category } = req.query;
        let sql = "SELECT id, ten_thuoc, gia_ban, hinh_anh FROM products WHERE so_luong_ton > 0 AND trang_thai = 'Còn hàng'";
        const params = [];

        if (category) {
            sql += " AND danh_muc = ?";
            params.push(category);
        }

        sql += " ORDER BY id DESC LIMIT ?";
        params.push(parseInt(limit));

        const [rows] = await pool.query(sql, params);
        res.status(200).json(rows); // Trả về mảng trực tiếp
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API LẤY SẢN PHẨM CÔNG KHAI (có tìm kiếm, lọc và phân trang)
app.get('/api/public/products', async (req, res) => {
    try {
        const { search, category, page = 1, limit = 12 } = req.query;

        let whereClauses = ["so_luong_ton > 0", "trang_thai = 'Còn hàng'"];
        const params = [];

        if (search) {
            whereClauses.push(`ten_thuoc LIKE ?`);
            params.push(`%${search}%`);
        }
        if (category) {
            whereClauses.push(`danh_muc = ?`);
            params.push(category);
        }

        const whereSql = `WHERE ${whereClauses.join(' AND ')}`;

        // Đếm tổng số kết quả
        const countSql = `SELECT COUNT(*) as totalItems FROM products ${whereSql}`;
        const [totalResult] = await pool.query(countSql, params);
        const totalItems = totalResult[0].totalItems;
        const totalPages = Math.ceil(totalItems / limit);

        // Lấy dữ liệu cho trang hiện tại
        const offset = (page - 1) * limit;
        const dataSql = `SELECT id, ten_thuoc, gia_ban, hinh_anh, danh_muc FROM products ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;

        const [rows] = await pool.query(dataSql, [...params, parseInt(limit), parseInt(offset)]);

        res.status(200).json({
            data: rows,
            pagination: { currentPage: parseInt(page), totalPages, totalItems }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API lấy danh sách các danh mục sản phẩm (chỉ từ các sản phẩm còn hàng)
app.get('/api/public/categories', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT danh_muc FROM products WHERE danh_muc IS NOT NULL AND danh_muc != '' AND trang_thai = 'Còn hàng'");
        const categories = rows.map(row => row.danh_muc);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API ĐẶC BIỆT DÙNG MỘT LẦN ĐỂ TẠO USER MẪU
// app.get('/api/setup/seed-users', async (req, res) => {
//     const users = [
//         { hoTen: 'Admin Chính', email: 'admin@gmail.com', matKhau: 'password123', vaiTro: 'quan_tri_vien' },
//         { hoTen: 'Nhân Viên An', email: 'nhanvien01@gmail.com', matKhau: 'password123', vaiTro: 'nhan_vien' },
//         { hoTen: 'Nhân Viên Trường', email: 'nhanvien02@gmail.com', matKhau: 'password123', vaiTro: 'nhan_vien' },
//         { hoTen: 'Thành Viên Nhật', email: 'thanhvien01@gmail.com', matKhau: 'password123', vaiTro: 'thanh_vien' }
//     ];

//     try {
//         // Xóa các user cũ để tránh trùng lặp
//         await pool.query("DELETE FROM users WHERE email IN (?)", [users.map(u => u.email)]);

//         for (const user of users) {
//             const hashedPassword = await bcrypt.hash(user.matKhau, 10);
//             const sql = `INSERT INTO users (hoTen, email, matKhau, vaiTro, trang_thai) VALUES (?, ?, ?, ?, 'hoat_dong')`;
//             await pool.query(sql, [user.hoTen, user.email, hashedPassword, user.vaiTro]);
//         }
//         res.status(200).send('<h1>Đã tạo thành công 3 tài khoản mẫu (admin, nhanvien, thanhvien) với mật khẩu là "password123".</h1><p>Bây giờ bạn có thể quay lại trang đăng nhập.</p>');
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// API lấy chi tiết một đơn hàng CỦA CHÍNH NGƯỜI DÙNG
app.get('/api/my/orders/:id', checkAuth, async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id; // Lấy ID người dùng từ token

        // Lấy thông tin chung của đơn hàng, ĐẢM BẢO đơn hàng này thuộc về người dùng đang đăng nhập
        const orderSql = "SELECT * FROM don_hang WHERE id = ? AND id_thanh_vien = ?";
        const [orderRows] = await pool.query(orderSql, [orderId, userId]);

        if (orderRows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng hoặc bạn không có quyền xem.' });
        }
        const orderData = orderRows[0];

        // Lấy danh sách sản phẩm trong đơn hàng đó
        const itemsSql = `
            SELECT ct.*, p.ten_thuoc, p.hinh_anh 
            FROM chi_tiet_don_hang ct
            JOIN products p ON ct.id_san_pham = p.id
            WHERE ct.id_don_hang = ?
        `;
        const [itemRows] = await pool.query(itemsSql, [orderId]);
        orderData.items = itemRows;

        res.status(200).json(orderData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API CÔNG KHAI để gửi yêu cầu tư vấn
// Dùng softCheckAuth để có thể lấy thông tin user nếu họ đã đăng nhập
// API CÔNG KHAI để gửi yêu cầu tư vấn (Phiên bản đã sửa lỗi)
app.post('/api/public/consultations', softCheckAuth, async (req, res) => {
    try {
        const { ten_nguoi_gui, email_nguoi_gui, tieu_de, noi_dung } = req.body;

        let finalName = ten_nguoi_gui;
        let finalEmail = email_nguoi_gui;

        // Nếu người dùng đã đăng nhập, lấy thông tin mới nhất từ database để đảm bảo chính xác
        if (req.user && req.user.id) {
            const [userRows] = await pool.query("SELECT hoTen, email FROM users WHERE id = ?", [req.user.id]);
            if (userRows.length > 0) {
                finalName = userRows[0].hoTen;
                finalEmail = userRows[0].email;
            }
        }

        if (!finalName || !noi_dung) {
            return res.status(400).json({ error: 'Tên và nội dung không được để trống.' });
        }

        const sql = `INSERT INTO yeu_cau_tu_van (ten_nguoi_gui, email_nguoi_gui, tieu_de, noi_dung, trang_thai) VALUES (?, ?, ?, ?, 'Mới')`;
        await pool.query(sql, [finalName, finalEmail, tieu_de, noi_dung]);

        res.status(201).json({ message: 'Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ sớm phản hồi cho bạn.' });
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu tư vấn:", error);
        res.status(500).json({ error: 'Đã có lỗi xảy ra ở server.' });
    }
});
// API lấy lịch sử tư vấn của chính người dùng đang đăng nhập
app.get('/api/my/consultations', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Lấy email của người dùng từ ID của họ
        const [userRows] = await pool.query("SELECT email FROM users WHERE id = ?", [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
        }
        const userEmail = userRows[0].email;

        // Lấy tất cả các yêu cầu tư vấn có email trùng khớp
        const sql = "SELECT * FROM yeu_cau_tu_van WHERE email_nguoi_gui = ? ORDER BY ngay_gui DESC";
        const [rows] = await pool.query(sql, [userEmail]);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// --- KHỞI ĐỘNG SERVER ---
app.listen(PORT, () => {
    console.log(`Server PharmaCare đang chạy tại http://localhost:${PORT}`);
});