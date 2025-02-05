import React from 'react'

export default function AdminHeader() {
  return (
    <div className='fixed top-0 right-0 bg-white w-[83vw] h-[12vh] items-center flex flex-row justify-between px-[2vw]'>
      <div className="flex-1">
        <span className="font-medium text- text-lg">Welcome, Abhishek Santhosh 👋</span>
      </div>
      <div className="flex-1 flex items-center justify-end">
        profile
      </div>
    </div>
  )
}
