import { cn } from '@/lib/utils'
import React, { HTMLAttributes, ReactNode } from 'react'


interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>{
    children? : ReactNode,
    className? : string,
    
}

const Heading = ({children , className , ...props} : HeadingProps) => {
  return (
   <h1 className={cn("text-3xl sm:text-4xl md:text-5xl text-center text-pretty font-semibold tracking-tight text-zinc-800",className)}
    {...props}
   >
    {children}
   </h1>
  )
}

export default Heading
