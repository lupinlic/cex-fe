import React from 'react'
import BalanceView from '@/components/featured/balance';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Balance - CEX",
  description: "Balance page for CEX application",
}

function Balance() {
  return (
    <BalanceView />
  )
}

export default Balance