"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  ChevronDown,
  User,
  Package,
  FileText,
  Layers,
  Coins,
  LineChart,
  Database,
  Receipt,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64  h-screen p-3 flex flex-col gap-2">
      {/* Tài sản */}
      <div className="mb-2">
        <Link
          href="/balance"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
            isActive("/balance")
              ? "text-primary"
              : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Wallet size={18} />
          Tài sản
        </Link>
      </div>

      {/* Tài khoản */}
      <div>
        <button
          onClick={() => toggleMenu("account")}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium ${
            openMenu === "account" ? " text-primary" : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <span className="flex items-center gap-3">
            <User size={18} />
            Tài khoản
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openMenu === "account" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openMenu === "account" && (
          <div className="ml-10 mt-2 flex flex-col gap-4 text-sm">
            {[
              { name: "Spot", path: "/balance/spot" },
              { name: "Funding", path: "/balance/funding" },
              { name: "Futures", path: "/balance/future" },
              { name: "Onchain", path: "/balance/onchain" },
              { name: "OTC", path: "/balance/otc" },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-2 py-1 rounded ${
                  isActive(item.path)
                    ? "text-green-400 font-semibold"
                    : "hover:text-green-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sản phẩm */}
      <div className="mt-3">
        <button
          onClick={() => toggleMenu("products")}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium ${
            openMenu === "products" ? " text-primary" : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <span className="flex items-center gap-3">
            <Package size={18} />
            Sản phẩm
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openMenu === "products" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openMenu === "products" && (
          <div className="ml-10 mt-2 flex flex-col gap-2 text-sm">
            <Link
              href="/product/danh-sach"
              className={`block px-2 py-1 rounded ${
                isActive("/product/danh-sach")
                  ? "text-green-400 font-semibold"
                  : "hover:text-green-400"
              }`}
            >
              Danh sách
            </Link>
            <Link
              href="/product/them-moi"
              className={`block px-2 py-1 rounded ${
                isActive("/product/them-moi")
                  ? "text-green-400 font-semibold"
                  : "hover:text-green-400"
              }`}
            >
              Thêm mới
            </Link>
          </div>
        )}
      </div>

      {/* Lệnh */}
      <div className="mt-3">
        <button
          onClick={() => toggleMenu("orders")}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium ${
            openMenu === "orders" ? " text-primary" : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <span className="flex items-center gap-3">
            <Receipt size={18} />
            Lệnh
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openMenu === "orders" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openMenu === "orders" && (
          <div className="ml-10 mt-2 flex flex-col gap-2 text-sm">
            <Link
              href="/lenh/lich-su"
              className={`block px-2 py-1 rounded ${
                isActive("/lenh/lich-su")
                  ? "text-green-400 font-semibold"
                  : "hover:text-green-400"
              }`}
            >
              Lịch sử
            </Link>
            <Link
              href="/lenh/quan-ly"
              className={`block px-2 py-1 rounded ${
                isActive("/lenh/quan-ly")
                  ? "text-green-400 font-semibold"
                  : "hover:text-green-400"
              }`}
            >
              Quản lý
            </Link>
          </div>
        )}
      </div>

      {/* Xuất dữ liệu */}
      <div className="mt-3">
        <button
          onClick={() => toggleMenu("export")}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg font-medium ${
            openMenu === "export" ? " text-primary" : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <span className="flex items-center gap-3">
            <FileText size={18} />
            Xuất dữ liệu
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openMenu === "export" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openMenu === "export" && (
          <div className="ml-10 mt-2 flex flex-col gap-2 text-sm">
            <Link
              href="/xuat-du-lieu/bao-cao"
              className={`block px-2 py-1 rounded ${
                isActive("/xuat-du-lieu/bao-cao")
                  ? "text-green-400 font-semibold"
                  : "hover:text-green-400"
              }`}
            >
              Báo cáo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
