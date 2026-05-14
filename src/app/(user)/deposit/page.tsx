import DepositView from "@/components/featured/deposit";
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Deposit - CEX",
  description: "Deposit page for CEX application",
}

function DepositPage() {
  return (
    <DepositView />
  )
}

export default DepositPage