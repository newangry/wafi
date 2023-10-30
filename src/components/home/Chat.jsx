import React from 'react'


export default function Chat() {
  return (
    <div className='flex flex-col gap-8 items-center mt-28'>
        <div>
            <p className='text-2xl text-center md:text-3xl font-semibold mx-4'>CHAT WITH ME - SEND ME YOUR CSV</p>
        </div>
        <div className='2xl:mx-[36rem] mx-[4rem] sm:mx-[8rem] md:mx-[13rem] lg:mx-[20rem] xl:mx-[30rem]'>
            <p className='text-center text-xs text-[#333333]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam maiores quasi ipsum necessitatibus, sed eos veritatis minima at ullam blanditiis quos veniam est reiciendis iusto quam dignissimos nisi? Nisi, error.</p>
        </div>
        <div className='flex justify-center mx-4 w-3/4'>
            <img src='/chat-img.jpg' className=''/>
        </div>
    </div>
  )
}
