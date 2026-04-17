import React from 'react'
import Future from '@/components/featured/Future'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Futures',
}

function FuturePage() {
  return (
    <Future />
  )
}

export default FuturePage