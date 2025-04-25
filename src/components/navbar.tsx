import React from 'react'
import MaxWidthWrapper from './max-width-wrapper'
import Link from 'next/link'

import { SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const NavBar = () => {

    const user = false ;    

  return (
    <nav className='sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blue-lg transition-all'>
        <MaxWidthWrapper>
            <div className='flex h-16 items-center justify-between'>
                <Link href={'/'} className='flex z-40 font-semibold'>
                    Ping <span className='text-fuchsia-700'>
                        Panda
                    </span>
                </Link>
                <div className='h-full flex items-center space-x-4'>
                    {user ? (
                        <>
                        <SignOutButton> 
                          <Button>
                            
                          </Button>
                        </SignOutButton>
                        </>
                    ) : null}
                </div>
            </div>
        </MaxWidthWrapper>
    </nav>
  )
}

export default NavBar