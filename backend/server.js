const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2'); // Sử dụng thư viện mysql2

// Khởi tạo ứng dụng express
const app = express();
const PORT = 3000;

// 1. Tạo kết nối tới database MySQL
const db = mysql.createConnection({
    host: 'localhost',      // Host của XAMPP
    user: 'root',           // User mặc định của XAMPP
    password: '',           // Mật khẩu mặc định của XAMPP là rỗng
    database: 'pharmacare'  // Tên database chúng ta vừa tạo
});

// 2. Thực hiện kết nối
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối thành công tới database MySQL "pharmacare"');

    // 3. Tạo bảng users nếu chưa tồn tại
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hoTen VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            matKhau VARCHAR(255) NOT NULL,
            vaiTro VARCHAR(50) DEFAULT 'thanh_vien',
            ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error("Lỗi tạo bảng users:", err);
        }
    });
});

// Sử dụng middleware
app.use(cors());
app.use(express.json());

// --- API ROUTES ---

app.get('/', (req, res) => {
    res.send('Backend PharmaCare đang hoạt động với database MySQL!');
});

// API Đăng ký tài khoản (dùng cú pháp MySQL)
app.post('/api/register', async (req, res) => {
    const { hoTen, email, matKhau } = req.body;

    if (!hoTen || !email || !matKhau) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        const matKhauMaHoa = await bcrypt.hash(matKhau, 10);

        // Dùng db.query thay vì db.run
        const sql = `INSERT INTO users (hoTen, email, matKhau) VALUES (?, ?, ?)`;
        db.query(sql, [hoTen, email, matKhauMaHoa], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Email này đã được sử dụng.' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: `Đăng ký thành công!`,
                userId: results.insertId // Lấy ID của người dùng vừa tạo trong MySQL
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Đã có lỗi xảy ra phía server.' });
    }
});


// API Đăng nhập
app.post('/api/login', (req, res) => {
    const { email, matKhau } = req.body;

    if (!email || !matKhau) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ email và mật khẩu.' });
    }

    // 1. Tìm người dùng trong database bằng email
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // 2. Nếu không tìm thấy người dùng
        if (results.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        }

        const user = results[0];

        // 3. So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        }

        // 4. Nếu mật khẩu khớp, tạo JWT (vé thông hành)
        const jwt = require('jsonwebtoken');
        const payload = {
            id: user.id,
            hoTen: user.hoTen,
            vaiTro: user.vaiTro
        };

        // SECRET_KEY nên được lưu ở file môi trường (.env) trong dự án thật
        const SECRET_KEY = 'your_very_secret_key_for_pharmacare';

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token có hạn trong 1 giờ

        // 5. Gửi token về cho frontend
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: payload
        });
    });
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`Server PharmaCare đang chạy tại http://localhost:${PORT}`);
});