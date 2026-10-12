import React, { useState } from 'react';
import { Copy, Check, QrCode, X, ExternalLink, Share2 } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Chia sẻ liên kết cho học sinh</h3>
              <p className="text-xs text-blue-100">Gửi vào nhóm Zalo hoặc trình chiếu tại lớp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <img
              src={qrCodeUrl}
              alt="Mã QR liên kết"
              className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm border border-slate-100"
            />
            <span className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-indigo-600" /> Quét mã bằng camera điện thoại hoặc Zalo
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              Đường link nộp thông tin:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-100 text-slate-700 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none select-all font-mono"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 shadow-sm shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Sao chép link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3.5 text-xs text-amber-800 space-y-1">
            <p className="font-semibold flex items-center gap-1 text-amber-900">
              💡 Gợi ý tin nhắn mẫu gửi nhóm Zalo lớp:
            </p>
            <p className="italic text-slate-700">
              "Kính gửi Quý Phụ huynh và các em học sinh, Thầy/Cô chủ nhiệm xin thông báo các em truy cập đường link sau để cập nhật thông tin năm học mới: {currentUrl} (Không cần đăng nhập, điền trực tiếp)."
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
