export default function HomePage() {
  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Exchange Admin</p>
        <h1 className="text-4xl font-semibold text-slate-900">Bảng điều khiển sàn giao dịch</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Quản lý thị trường, tài sản, giao dịch và hoạt động của người dùng trên nền tảng giao dịch crypto.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Tác vụ nhanh</h2>
              <p className="text-sm text-slate-500">Các hành động quản trị dành cho sàn crypto.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
              Quản lý cặp giao dịch
              <span className="mt-1 block text-xs text-slate-500">Thêm, sửa hoặc vô hiệu hóa các thị trường giao dịch.</span>
            </button>
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
              Giám sát tính thanh khoản
              <span className="mt-1 block text-xs text-slate-500">Kiểm tra sâu về quỹ, lệnh và pool thanh khoản.</span>
            </button>
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
              Quản lý người dùng
              <span className="mt-1 block text-xs text-slate-500">Duyệt KYC, xử lý xác thực và khóa tài khoản bất thường.</span>
            </button>
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
              Kiểm tra bảo mật
              <span className="mt-1 block text-xs text-slate-500">Xem báo cáo rủi ro và nhật ký bảo mật.</span>
            </button>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Thông tin nhanh</h2>
              <p className="text-sm text-slate-500">Tổng quan về trạng thái sàn và các cảnh báo cấp bách.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Khối lượng giao dịch</p>
              <p className="mt-2 text-base font-medium text-slate-900">45 BTC trong 24 giờ qua.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Số lượng lệnh chờ</p>
              <p className="mt-2 text-base font-medium text-slate-900">128 lệnh đang nằm trên sổ lệnh.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Hoạt động gần đây</h2>
            <p className="text-sm text-slate-500">Những sự kiện mới nhất liên quan đến giao dịch và bảo mật.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Xem chi tiết
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Cặp mới được bật</p>
            <p className="mt-1 text-sm text-slate-600">ETH/USDT đã được cập nhật thanh khoản và mở giao dịch.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Yêu cầu KYC</p>
            <p className="mt-1 text-sm text-slate-600">5 hồ sơ KYC đang chờ xác thực từ người dùng VIP.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Cảnh báo bảo mật</p>
            <p className="mt-1 text-sm text-slate-600">Đã phát hiện 1 phiên đăng nhập bất thường trên một tài khoản giao dịch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
