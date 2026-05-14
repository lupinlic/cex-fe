import React from 'react'
import { Metadata } from 'next'
import RegisterPage from '@/components/featured/account/register'

export const metadata: Metadata = {
  title: "Đăng ký"
}

function Register() {
  return (
    <RegisterPage />
  )
}

export default Register