import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

// types/token.ts
export interface Token {
  name: string;
  symbol: string;
  icon1: string;
  icon2: string;
  price: string;
  change: string;
  high: string;
  low: string;
  isActive: boolean;
  volBTC: string;
  volUSDT: string;
  funding: string;
  countdown: string;
  lastPrice: string;
}
