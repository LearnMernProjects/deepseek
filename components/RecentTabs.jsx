'use client'
import React from 'react'
import Sidebar from './Sidebar'
import {useAppContext} from '@/context/AppContext'
import Image from 'next/image'
import { assets } from '@/public/assets/assets'
import { useState } from 'react'

const RecentTabs = ({openMenu, setOpenMenu}) => {
  return (
    <div className='flex items-center  text-white/80 
    justify-between p-2 hover:bg-white/10 rounded-lg
     cursor-pointer group text-sm '>
      <p className='group-hover:max-w-5/6 truncate'>Chat Name Here</p>
      <div className='group relative flex h-6 w-6 justify-center items-center aspect-square hover:bg-white/80 rounded-lg'>
        <Image src={assets.three_dots} alt="pin" className={`w-4 ${openMenu.open ? "": "hidden"} group-hover:block`} />
        <div className={`absolute top-6 -right-36 bg-gray-700 w-max rounded-xl p-2 ${openMenu.open === 0 ? "block": "hidden"}`}>
          <div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
            <Image src={assets.pencil_icon} alt="pin" className='w-4 cursor-pointer' />
            <p>Rename</p>
          </div>
          <div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
            <Image src={assets.delete_icon} alt="pin" className='w-4 cursor-pointer' />
            <p>Delete</p>
          </div>
          </div>
        </div>
      
    </div>
  )
}

export default RecentTabs;
