import React from "react";
import { useCart } from "../../components/CartContext";
import QRCode from "react-qr-code";

const BANK_ACCOUNT = {
  bankName: "Vietcombank",
  accountNumber: "1030075556",
  accountHolder: "Trương Quang Vũ",
};

const PaymentPage = () => {
  const { getTotal } = useCart();
  const total = getTotal();

  // Thông tin chuyển khoản cho QR
  const qrValue = `STK: ${BANK_ACCOUNT.accountNumber}\nChủ TK: ${BANK_ACCOUNT.accountHolder}\nNgân hàng: ${BANK_ACCOUNT.bankName}\nSố tiền: ${total}`;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow flex flex-col md:flex-row gap-8">
      {/* Bên trái: QR và thông tin ngân hàng */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-lg font-bold mb-4">Quét mã QR để thanh toán</h3>
        <QRCode value={qrValue} size={200} />
        <div className="mt-6 text-sm">
          <div>
            <span className="font-semibold">Ngân hàng:</span>{" "}
            {BANK_ACCOUNT.bankName}
          </div>
          <div>
            <span className="font-semibold">Số tài khoản:</span>{" "}
            {BANK_ACCOUNT.accountNumber}
          </div>
          <div>
            <span className="font-semibold">Chủ tài khoản:</span>{" "}
            {BANK_ACCOUNT.accountHolder}
          </div>
          <div>
            <span className="font-semibold">Số tiền:</span>{" "}
            <span className="text-blue-600 font-bold">
              {total.toLocaleString()}₫
            </span>
          </div>
          <div className="mt-2 text-red-500">
            Nội dung chuyển khoản:{" "}
            <span className="font-mono">THANHTOAN-{Date.now()}</span>
          </div>
        </div>
      </div>
      {/* Bên phải: Hướng dẫn và lưu ý */}
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-4">Hướng dẫn thanh toán</h3>
        <ol className="list-decimal ml-5 text-gray-700 space-y-2">
          <li>Mở ứng dụng ngân hàng hoặc ví điện tử của bạn.</li>
          <li>Chọn chức năng quét mã QR và quét mã bên trái.</li>
          <li>Kiểm tra chính xác số tài khoản, chủ tài khoản và số tiền.</li>
          <li>Nhập đúng nội dung chuyển khoản như trên.</li>
          <li>Hoàn tất giao dịch và chờ xác nhận đơn hàng.</li>
        </ol>
        <div className="mt-6 text-green-600 font-semibold">
          Nếu cần hỗ trợ, vui lòng liên hệ hotline: 0123 456 789
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
