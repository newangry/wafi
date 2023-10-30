import React from 'react'
import Image from 'next/image'

export default function Section3() {
  return (
    <div className='flex flex-col gap-8 items-center mt-28'>
        <div>
            <p className='text-2xl text-center md:text-3xl font-semibold mx-4'>SECTION #3</p>
        </div>
        <div className='2xl:mx-[36rem] mx-[4rem] sm:mx-[8rem] md:mx-[13rem] lg:mx-[20rem] xl:mx-[30rem]'>
            <p className='text-center text-[#333333]  text-xs'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam maiores quasi ipsum necessitatibus, sed eos veritatis minima at ullam blanditiis quos veniam est reiciendis iusto quam dignissimos nisi? Nisi, error.</p>
        </div>
        <div className='mx-4 mt-10 flex justify-center'>
            <Image src="/robot.svg" width={0} height={0} sizes="100vw"
                               style={{width: '90%', height: 'auto'}}/>
        </div>
    </div>
  )
}
