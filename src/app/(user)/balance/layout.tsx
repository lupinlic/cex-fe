import React from 'react'
import Sidebar from '@/components/featured/balance/components/Sidebar';

function LayoutBalance( { children }: { children: React.ReactNode } ) {
  return (
    <div className='flex py-10 px-20 gap-6'>
        <div className=''>
        <Sidebar />
        </div>
        <div className='flex-1 p-4'>
            {children}
        </div>
    </div>
  )
}

export default LayoutBalance