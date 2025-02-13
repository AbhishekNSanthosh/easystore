import React from 'react'
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function AdminHeader() {
  return (
    <div className='fixed top-0 right-0 bg-white w-[85vw] h-[12vh] items-center flex flex-row justify-between px-[2vw]'>
      <div className="flex-1">
        <span className="font-medium text-dashcolor-500 text-lg">Welcome, Abhishek Santhosh 👋</span>
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        <div className="">
          <IoIosNotificationsOutline className='text-3xl cursor-pointer text-dashcolor-500 mr-10'/>
        </div>
        <div className="">
          <IoPersonCircleOutline className='text-5xl text-gray-500 cursor-pointer'/>
        </div>
      </div>
    </div>
  )
}
