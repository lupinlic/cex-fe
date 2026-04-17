export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border px-10 py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 text-sm">
        
        {/* Column 1 */}
        <div>
          <h3 className="font-semibold mb-4">Giới thiệu về OKX</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">Về OKX</li>
            <li className="hover:text-foreground cursor-pointer">Quyền riêng tư</li>
            <li className="hover:text-foreground cursor-pointer">Cơ hội nghề nghiệp</li>
            <li className="hover:text-foreground cursor-pointer">Liên hệ</li>
            <li className="hover:text-foreground cursor-pointer">Điều khoản</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-4">Sản phẩm</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">Mua crypto</li>
            <li className="hover:text-foreground cursor-pointer">P2P</li>
            <li className="hover:text-foreground cursor-pointer">Chuyển đổi</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-4">Dịch vụ</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">API</li>
            <li className="hover:text-foreground cursor-pointer">Dữ liệu</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold mb-4">Mua tiền mã hóa</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">BTC</li>
            <li className="hover:text-foreground cursor-pointer">ETH</li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="font-semibold mb-4">Giao dịch</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">BTC/USDT</li>
            <li className="hover:text-foreground cursor-pointer">ETH/USDT</li>
          </ul>
        </div>

        {/* Column 6 */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold mb-4">
            Giao dịch linh hoạt
          </h3>

          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full mb-6 hover:opacity-90 transition">
            Đăng ký
          </button>

          {/* QR */}
          <div className="bg-muted p-2 rounded">
            <div className="w-24 h-24 bg-border rounded" />
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Quét để tải app
          </p>
        </div>
      </div>
    </footer>
  );
}