"use client";

import Marquee from "react-fast-marquee";

const data = [
  { name: "BTC/USDT", change: 6.09, img: "/images/coin/btc.png" },
  { name: "ETH/USDT", change: 45.63, img: "/images/coin/eth.png" },
  { name: "LTC/USDT", change: 8.22, img: "/images/coin/ltc.png" },
  { name: "USDT/USDT", change: -1.49, img: "/images/coin/usdt.png" },
  { name: "SOL/USDT", change: 3.43, img: "/images/coin/sol.png" },
    { name: "XRP/USDT", change: -2.17, img: "/images/coin/xrp.png" },
    { name: "BTC/USDT", change: 6.09, img: "/images/coin/btc.png" },
  { name: "ETH/USDT", change: 45.63, img: "/images/coin/eth.png" },
  { name: "LTC/USDT", change: 8.22, img: "/images/coin/ltc.png" },
  { name: "USDT/USDT", change: -1.49, img: "/images/coin/usdt.png" },
  { name: "SOL/USDT", change: 3.43, img: "/images/coin/sol.png" },
    { name: "XRP/USDT", change: -2.17, img: "/images/coin/xrp.png" },
];

export default function Ticker() {
  return (
    <div className="bg-black py-2">
      <Marquee speed={50} gradient={false} pauseOnHover={true}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center mx-6 gap-2">
            {/* Ảnh coin */}
            <img src={item.img} alt="" className="w-5 h-5" />

            {/* Tên */}
            <span className="text-white text-[12px]">{item.name}</span>

            {/* % */}
            <span
              className={`text-[12px] ${
                item.change >= 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change}%
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}