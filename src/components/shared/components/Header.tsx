"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/shared/ui/input";
import { Button } from "@/components/shared/ui/button";
import {
  Search,
  Download,
  Bell,
  HelpCircle,
  Globe,
  Divide,
  PlusCircle,
  Users,
  Repeat,
  LineChart,
  TrendingUp,
  Network,
  ShieldCheck,
  Blocks,
  PartyPopper,
  Gift,
  UserPlus,
  User,
  Wallet,
  ArrowDownToLine,
  ArrowLeftRight,
  BarChart3,
  ClipboardList,
  ArrowUpFromLine,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { HoverDropdown } from "./hover-dropdown";
import { HoverCard } from "./hover-card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";

export function Header() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const email = user?.email || "huatunglam1205@domain.com";

  const maskedEmail =
    email.slice(0, 3) + "***@" + email.split("@")[1];

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Clear all authentication data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear any other auth-related data that might exist
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("auth") || key.includes("token") || key.includes("user"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Dispatch custom event to notify auth state change
      window.dispatchEvent(new CustomEvent('auth-changed'));

      // Show success message
      toast.success("Đăng xuất thành công");

      // Redirect to login page
      router.push("/account/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <header className="w-full border-b border-border bg-background fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-6 h-16">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-full h-8 mr-2 inline-block"
            />
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <HoverDropdown
              showArrow
              trigger={
                <span className="cursor-pointer hover:text-primary">
                  Mua tiền mã hoá
                </span>
              }
              content={
                <HoverCard
                  items={[
                    {
                      icon: <Users className="w-5 h-5" />,
                      title: "Giao dịch P2P",
                      description:
                        "Mua/bán không mất phí giao dịch thông qua hơn 100 phương thức thanh toán",
                        link: "/p2p"
                    },
                    {
                      icon: <PlusCircle className="w-5 h-5" />,
                      title: "Mua và bán",
                      description: "Visa, Mastercard và các thẻ khác",
                      link: "/buy-sell"

                    },
                    {
                      icon: <Divide className="w-5 h-5" />,
                      title: "Công cụ tính crypto",
                      description:
                        "Kiểm tra tỷ lệ chuyển đổi thực tế và giá trị crypto",
                        link: "/calculator"
                    },
                  ]}
                />
              }
            />

            <span className="cursor-pointer hover:text-primary">
              Thị trường
            </span>
            <HoverDropdown
              showArrow
              trigger={
                <span className="cursor-pointer hover:text-primary">
                  Giao dịch
                </span>
              }
              content={
                <HoverCard
                  items={[
                    {
                      icon: <Repeat className="w-5 h-5" />,
                      title: "Chuyển đổi",
                      description:
                        "Chuyển đổi nhanh, không mất phí giao dịch, không trượt giá",
                        link: "/convert"
                    },
                    {
                      icon: <LineChart className="w-5 h-5" />,
                      title: "Spot",
                      description: "Mua và bán crypto dễ dàng",
                      link: "/spot"
                    },
                    {
                      icon: <TrendingUp className="w-5 h-5" />,
                      title: "Futures",
                      description:
                        "Giao dịch furtures với đòn bẩy lên đến 125x và phí thấp",
                        link: "/futures"
                    },
                    {
                      icon: <Network className="w-5 h-5" />,
                      title: "DEX",
                      description:
                        "Giao dịch trên các sàn giao dịch phi tập trung",
                        link: "/dex"
                    },
                  ]}
                />
              }
            />
            <span className="cursor-pointer hover:text-primary">
              Tăng trưởng
            </span>
            <span className="cursor-pointer hover:text-primary">Tổ chức</span>
            <span className="cursor-pointer hover:text-primary">Học viện</span>
            <HoverDropdown
              showArrow
              trigger={
                <span className="cursor-pointer hover:text-primary">Thêm</span>
              }
              content={
                <HoverCard
                  items={[
                    {
                      icon: <ShieldCheck className="w-5 h-5" />,
                      title: "Bảo mật tài sản",
                      description: "",
                      link: "/security"
                    },
                    {
                      icon: <Blocks className="w-5 h-5" />,
                      title: "Web3",
                      description: "",
                      link: "/web3"
                    },
                    {
                      icon: <PartyPopper className="w-5 h-5" />,
                      title: "Trung tâm sự kiện",
                      description: "",
                      link: "/events"
                    },
                    {
                      icon: <Gift className="w-5 h-5" />,
                      title: "Phần thưởng của tôi",
                      description: "",
                      link: "/rewards"
                    },
                    {
                      icon: <UserPlus className="w-5 h-5" />,
                      title: "Giới thiệu",
                      description: "",
                      link: "/referral"
                    },
                  ]}
                />
              }
            />
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tiền mã hoá"
              className="pl-9 w-[220px] bg-muted"
            />
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link href="/account/login">
                  <Button
                    variant="ghost"
                    className=" transition cursor-pointer"
                  >
                    Đăng nhập
                  </Button>
                </Link>{" "}
                <Link href="/account/register">
                  <Button className="rounded-full transition cursor-pointer">
                    Đăng ký
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {" "}
                <HoverDropdown
                  showArrow
                  trigger={
                    <span className="cursor-pointer hover:text-primary text-[14px]">
                      Tài sản
                    </span>
                  }
                  content={
                    <HoverCard
                      items={[
                        {
                          icon: <Wallet className="w-5 h-5" />,
                          title: "Tài sản của tôi",
                          description: "",
                          link: "/balance"
                        },
                        {
                          icon: <ArrowDownToLine className="w-5 h-5" />,
                          title: "Nạp tiền",
                          description: "",
                          link: "/deposit"
                        },
                        {
                          icon: <ArrowUpFromLine className="w-5 h-5" />,
                          title: "Rút tiền",
                          description: "",
                          link: "/withdraw"
                        },
                        {
                          icon: <ArrowLeftRight className="w-5 h-5" />,
                          title: "Chuyển tiền",
                          description: "",
                          link: "/balance/tranfer"
                        },
                        {
                          icon: <BarChart3 className="w-5 h-5" />,
                          title: "Phân tích",
                          description: "",
                          link: "/analytics"
                        },
                        {
                          icon: <ClipboardList className="w-5 h-5" />,
                          title: "Trung tâm lệnh",
                          description: "",
                          link: "/orders"
                        },
                      ]}
                    />
                  }
                />
                <div className="w-8 h-8  flex items-center justify-center cursor-pointer border-r border-border">
                  
                  <HoverDropdown
                  trigger={
                    <User className="w-5 h-5" />
                  }
                  content={
                    <>
                    <div className="flex border-b border-gray-200 py-3">
                      <img src="/images/avt.png" alt="User Avatar" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="text-[12px] text-background">{maskedEmail}</p>
                        <p className="text-[11px] text-muted-foreground">
                          <span>UID:</span>
                          <span className="font-mono ml-1">{user?.id?.slice(-8) || "123456789"}</span>
                        </p>
                      </div>
                    </div>
                    <HoverCard
                      items={[
                        {
                          icon: <LayoutDashboard className="w-5 h-5" />,
                          title: "Tổng quan",
                          description: "",
                          link: "/assets"
                        },
                        {
                          icon: <User className="w-5 h-5" />,
                          title: "Thông tin",
                          description: "",
                          link: "/deposit"
                        },
                        {
                          icon: <ShieldCheck className="w-5 h-5" />,
                          title: "Xác minh",
                          description: "",
                          link: "/withdraw"
                        },
                        {
                          icon: <LogOut className="w-5 h-5" />,
                          title: isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất",
                          description: "",
                          onClick: isLoggingOut ? undefined : handleLogout
                        },
                      ]}
                    />
                    </>
                  }
                />
                </div>
              </>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 cursor-pointer" />
            <Bell className="w-5 h-5 cursor-pointer" />
            <HelpCircle className="w-5 h-5 cursor-pointer" />
            <Globe className="w-5 h-5 cursor-pointer" />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
