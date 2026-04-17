import React from "react";
import { coin } from "./data/coin";
function HomePage() {
  return (
    <div className="  px-4 sm:px-6 lg:px-8 flex flex-col gap-30 py-20">
      <div className="mx-50 flex items-center justify-between gap-10">
        <div className="">
          <h1 className="text-[50px] font-bold mb-4 w-[600px]">
            Nền Tảng Giao Dịch Crypto Ưu Việt Hơn
          </h1>

          <p className="text-muted-foreground max-w-md mb-10">
            Truy cập thị trường tiền mã hóa toàn cầu với nền tảng giao dịch an
            toàn, nhanh chóng và đáng tin cậy của chúng tôi.
          </p>

          <div className="flex gap-4">
            <a
              href="/account/register"
              className="px-6 py-3 bg-foreground text-background rounded-full hover:bg-primary/90 transition cursor-pointer"
            >
              Bắt đầu ngay
            </a>
            <a
              href="/learn"
              className="px-6 py-3  text-primary rounded-full hover:bg-primary/10 transition cursor-pointer"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
        <div className="">
          <video
            src="https://www.okx.com/cdn/assets/files/2510/A50E07C169E1C04F.mp4"
            autoPlay
            loop
            muted
            className="rounded-xl w-full max-h-[590px]"
          />
        </div>
      </div>
      <div className="mx-30 flex flex-col gap-10">
        <h2 className="text-[40px] font-bold mb-4 text-center">
          Đối tác an toàn để giao dịch crypto
        </h2>
        <div className="grid grid-cols-4 gap-10">
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src="/images/1.webp"
              alt="Visa"
              className="w-[140px] h-[140px] object-contain"
            />
            <p className="text-[20px] text-center">
              Độ tin cậy đã được kiểm chứng
            </p>
            <p className="text-[16px] text-muted-foreground text-center">
              Giao dịch mà không cần do dự. Hơn 70 triệu nhà giao dịch tin tưởng
              OKX để luôn chủ động trong mọi biến động của thị trường.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src="/images/2.webp"
              alt="Visa"
              className="w-[140px] h-[140px] object-contain"
            />
            <p className="text-[20px] text-center">Dự trữ minh bạch</p>
            <p className="text-[16px] text-muted-foreground text-center">
              Giữ tài sản của bạn an toàn và được xác minh thông qua Bằng chứng
              dự trữ của chúng tôi. Bạn cần trợ giúp? Chúng tôi hỗ trợ bạn 24/7.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src="/images/3.webp"
              alt="Visa"
              className="w-[140px] h-[140px] object-contain"
            />
            <p className="text-[20px] text-center">Nạp tiền dễ dàng</p>
            <p className="text-[16px] text-muted-foreground text-center">
              Nạp on-chain nhanh chóng, dễ dàng. Hay bạn muốn giao dịch theo
              cách khác? Thử giao dịch ngang hàng (P2P) ngay.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src="/images/4webp.webp"
              alt="Visa"
              className="w-[140px] h-[140px] object-contain"
            />
            <p className="text-[20px] text-center">Xác minh bảo mật</p>
            <p className="text-[16px] text-muted-foreground text-center">
              Xác minh danh tính của bạn trong vài phút bằng giấy tờ tùy thân có
              ảnh. Sau khi thiết lập, bạn có thể truy cập các tính năng giao
              dịch hàng đầu.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-30 flex items-center justify-between gap-15">
        <div className="">
          <h1 className="text-[50px] font-bold mb-4 w-[600px]">
            Xây dựng danh mục đầu tư
          </h1>

          <p className="text-muted-foreground max-w-md mb-10">
            Tự tin kiểm soát tương lai tài chính. Dù đã quen giao dịch hay chỉ
            mới khởi đầu, bạn vẫn có thể trade hơn 300 loại crypto theo cách của
            mình, với mức phí thấp.
          </p>

          <div className="flex gap-4">
            <a
              href="/account/register"
              className="px-6 py-3 bg-foreground text-background rounded-full hover:bg-primary/90 transition cursor-pointer"
            >
              Mua crypto
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {coin.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 p-4 border rounded-lg border-muted-foreground w-[170px] h-[170px] hover:bg-muted transition cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-bold">{item.symbol}</p>
                <p className="text-muted-foreground">{item.price}</p>
                <p
                  className={`flex items-center gap-1 ${
                    item.change.startsWith("-")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {item.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-[40px] font-bold mb-4 text-center">
          Tìm giao dịch của bạn
        </h2>
        <p className="text-[16px] text-muted-foreground text-center max-w-lg">
          Giành lợi thế trong mọi giao dịch. Tận hưởng phí thấp, giao dịch cực nhanh và API mạnh mẽ.
        </p>
        <video
          src="https://www.okx.com/cdn/assets/files/2212/882D5049A31E763B.mp4"
          autoPlay
          loop
          muted
          className="rounded-xl w-full max-h-[590px] mt-10"
        />
      </div>
    </div>
  );
}

export default HomePage;
