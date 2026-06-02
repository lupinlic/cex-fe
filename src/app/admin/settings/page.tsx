export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Cấu hình sàn</p>
        <h1 className="text-4xl font-semibold text-slate-900">Thiết lập hệ thống</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Điều chỉnh các cấu hình cốt lõi của sàn giao dịch, bao gồm phí giao dịch, điều kiện nạp/rút, bảo mật và thông báo.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Cấu hình chung</h2>
              <p className="mt-1 text-sm text-slate-500">Thiết lập thông tin và trạng thái cơ bản cho sàn.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Tên sàn</label>
              <input type="text" value="CEX Exchange" readOnly className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Trạng thái sàn</label>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
                <p className="text-sm text-slate-700">Hoạt động</p>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Mô tả hệ thống</label>
              <textarea rows={4} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" defaultValue="Nền tảng giao dịch crypto chuyên sâu dành cho thị trường Việt Nam và quốc tế." readOnly />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Phí & Giới hạn</h2>
              <p className="mt-1 text-sm text-slate-500">Cài đặt mức phí và hạn mức áp dụng cho giao dịch và nạp/rút.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Phí giao dịch maker</label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">0.10%</div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Phí giao dịch taker</label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">0.20%</div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Hạn mức rút tối đa</label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">100 BTC / ngày</div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Bảo mật & Xác thực</h2>
            <p className="mt-1 text-sm text-slate-500">Cài đặt các chính sách bảo mật cần thiết cho sàn giao dịch.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">Cập nhật bảo mật</button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-800">KYC bắt buộc</p>
            <p className="mt-2 text-sm text-slate-600">Yêu cầu xác thực danh tính cho tất cả tài khoản giao dịch.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-800">2FA</p>
            <p className="mt-2 text-sm text-slate-600">Khuyến khích người dùng bật xác thực hai yếu tố để bảo vệ tài khoản.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Thông báo hệ thống</h2>
            <p className="mt-1 text-sm text-slate-500">Thiết lập kênh thông báo và thông tin cảnh báo cho admin.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-800">Email cảnh báo</p>
            <p className="mt-2 text-sm text-slate-600">Nhận thông báo khi có giao dịch lớn, sự kiện bảo mật hoặc lỗi hệ thống.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-800">Thông báo SMS</p>
            <p className="mt-2 text-sm text-slate-600">Cấu hình tin nhắn SMS cho các sự kiện quan trọng của sàn.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
