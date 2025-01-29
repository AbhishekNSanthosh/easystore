import React from 'react'

export default function Header() {
  return (
    <div className='px-[5vw] h-[10vh] flex flex-row items-center'>
       <div className="flex-1">
        Pricing
       </div>
       <div className="flex-1">
        Easy store
       </div>
       <div className="flex-1 flex items-center justify-end">
        login
       </div>
    </div>
  )
}
