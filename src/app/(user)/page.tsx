import HomePage from "@/components/featured/Home";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Trang chủ"
};
export default function Home() {
  return (
    <HomePage />
  );
}