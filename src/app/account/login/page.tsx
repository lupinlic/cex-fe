import React from 'react'
import { Metadata } from 'next'
import LoginPage from '@/components/featured/account/login'

export const metadata: Metadata = {
  title: "Đăng nhập"
}

function Login() {
  return (
    <LoginPage />
  )
}

export default Login