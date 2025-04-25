import React from 'react'
import MaxWidthWrapper from './components/max-width-wrapper'
import Heading from './components/heading'

const Page = () => {
  return (
    <>
      <section className='relative py-24 sm:py-32 bg-white'>
        <MaxWidthWrapper className='text-center'>
          <div className='relative mx-auto text-center flex flex-col items-center gap-10'>
            <Heading>
              Real-Time Saas Insights
            </Heading>
          </div>
        </MaxWidthWrapper>
      </section>
      <section></section>
      <section></section>
      <section></section>
    </>
  )
}

export default Page
