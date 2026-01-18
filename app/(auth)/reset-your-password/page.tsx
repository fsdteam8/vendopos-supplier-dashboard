import ResetPassword from '@/components/auth/reset-password'
import React from 'react'

const page = () => {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </React.Suspense>
    </div>
  )
}

export default page