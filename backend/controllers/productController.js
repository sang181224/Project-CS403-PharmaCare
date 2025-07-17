const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        let sql = "SELECT * FROM products";
        const params = [];
        if (searchTerm) {
            sql += " WHERE ten_thuoc LIKE ? OR ma_thuoc LIKE ?";
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        sql += " ORDER BY id DESC";
        const [rows] = await pool.query(sql, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy chi tiết một sản phẩm
exports.getProductById = async (req, res) => {
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
};

// Thêm sản phẩm mới (bao gồm lô hàng đầu tiên)
exports.createProduct = async (req, res) => {
    const { ten_thuoc, ma_thuoc, danh_muc, nha_san_xuat, gia_ban, don_vi_tinh, mo_ta, ma_lo_thuoc, so_luong_nhap, gia_nhap, ngay_san_xuat, han_su_dung, vi_tri_kho } = req.body;
    const finalImagePath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : 'https://via.placeholder.com/400x400.png/EBF4FF/76A9FA?text=No+Image';

    if (!ten_thuoc || !ma_thuoc || !ma_lo_thuoc || !so_luong_nhap) {
        return res.status(400).json({ error: 'Thông tin sản phẩm và lô hàng là bắt buộc.' });
    }

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
};
// API Cập nhật thông tin sản phẩm
exports.updateProduct = async (req, res) => {
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
};
// API Xóa một sản phẩm
exports.deleteProduct = async (req, res) => {
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
};