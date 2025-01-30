import CustomButton from '@components/Button'
import CustomLink from '@components/Link'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <div className='px-[5vw] h-[10vh] flex flex-row items-center'>
       <div className="flex-1 flex items-center justify-start space-x-7">
        <CustomLink className='font-medium' href={'/'}>FAQ</CustomLink>
        <CustomLink className='font-medium' href={'/'}>Pricing</CustomLink>
       </div>
       <div className="flex-1 flex items-center justify-center">
        <span className="text-xl text-gray-700 font-medium">Easy store</span>
       </div>
       <div className="flex-1 flex items-center justify-end space-x-7">
        <CustomButton label='Log in' className='text-secondary font-medium py-1 rounded-full'/>
        <CustomButton label='Sign up' className='text-secondary flex font-medium px-3 py-1 rounded-full bg-primary'/>
       </div>
    </div>
  )
}
