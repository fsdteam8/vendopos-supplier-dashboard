import VerifyOTP from '@/components/auth/verifyotp'
import React from 'react'

const page = () => {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
         <VerifyOTP />
      </React.Suspense>
    </div>
  )
}

export default page