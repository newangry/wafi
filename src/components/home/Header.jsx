import React from 'react'
import Image from 'next/image'
import {LuUploadCloud} from "react-icons/lu"
import {HiOutlineDocument} from "react-icons/hi"

export default function Header() {
  return (
    <div className='flex flex-col gap-8 items-center mt-28'>
        <div>
            <p className='text-2xl text-center md:text-3xl font-semibold mx-4'>UPLOAD YOUR PORTFOLIO - I WILL HELP!</p>
        </div>
        <div className='2xl:mx-[36rem] mx-[4rem] sm:mx-[8rem] md:mx-[13rem] lg:mx-[20rem] xl:mx-[30rem]'>
            <p className='text-center text-xs text-[#333333]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam maiores quasi ipsum necessitatibus, sed eos veritatis minima at ullam blanditiis quos veniam est reiciendis iusto quam dignissimos nisi? Nisi, error.</p>
        </div>
        <div className='header-background mx-4 '>
            <div className='flex justify-center'>
                <Image src="/upload-image.svg" width={0} height={0} sizes="100vw"
                               style={{width: '45%', height: 'auto'}}/>
            </div>

        </div>
        
    </div>
  )
}
