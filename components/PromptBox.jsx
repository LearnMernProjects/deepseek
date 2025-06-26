'use client'

import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/public/assets/assets'
import { useAppContext } from '@/context/AppContext'
import { useClerk } from '@clerk/nextjs'
import Sidebar from './Sidebar'


const PromptBox = ({isLoading, setIsLoading }) => {
     const [prompt, setPrompt] = useState('')
  return (
    <form className={`w-full ${false? "max-w-3xl": "max-w-2xl"} bg-[#404045]
     p-4 rounded-3xl mt-4 transition-all duration-300`}>
          <textarea className='w-full bg-transparent outline-none overflow-hidden break-words resize-none' 
          rows={2} placeholder='Message Deepseek' required onChange={(e) => setPrompt(e.target.value)} value={prompt}/>
          <div className="flex items-center justify-between text-sm">
               <div className='flex items-center gap-2'>
                    <p className='flex items-center gap-2 text-white/60 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition '>
                    <Image src={assets.deepthink_icon} alt="mic" className='h-5' />
                    DeepThink (R1)
                    </p>
                    <p className='flex items-center gap-2 text-white/60 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition '>
                    <Image src={assets.search_icon} alt="search" className='h-5' />
                    Search
                    </p>
               </div>
               <div className='flex items-center gap-2'>
               <Image src={assets.pin_icon} alt="mic" className='w-4 cursor-pointer' />
               <button className={`${prompt.length > 0 ? "bg-primary": "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                    <Image className='w-3.5 aspect-square' src={prompt? assets.arrow_icon: assets.arrow_icon_dull} alt="send" />
               </button>

               </div>
          </div>
      
    </form>
  )
}

export default PromptBox
