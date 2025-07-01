import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div className='w-full flex-1 flex items-center justify-center'>
        <SignUp fallbackRedirectUrl={"/welcome"} forceRedirectUrl={"/redirect"}/>
    </div>
  )
}

export default Page