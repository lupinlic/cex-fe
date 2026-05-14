import WithDrawView from "@/components/featured/withdraw";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Withdraw - CEX",
  description: "Withdraw page for CEX application",
}

function WithDrawPage() {
  return (
    <WithDrawView />
  )
}

export default WithDrawPage