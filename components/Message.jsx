import React from 'react'
import Image from 'next/image'
import { assets } from '@/public/assets/assets'

function Message({ role, content }) {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div className={`flex flex-col w-full mb-8 ${role === "user" && "items-end"}`}>
        <div className={`group relative flex max-w-2xl py-3 rounded-xl ${role === "user" ? "bg-color-[#414158]" : "gap-3"}`}>
          
          <div className={`opacity-0 group-hover:opacity-100 absolute ${role === "user" ? "-left-16 top-2.5" : "left-9 -bottom-6"} transition-all`}>
            <div className='flex items-center gap-2 opacity-70'>
              {role === "user" ? (
                <>
                  <Image src={assets.copy_icon} alt="user" className='w-4.5 cursor-pointer' width={20} height={20} />
                  <Image src={assets.pencil_icon} alt="user-edit" className="w-4.5 cursor-pointer" width={20} height={20} />
                </>
              ) : (
                <>
                  <Image src={assets.copy_icon} alt="assistant-copy" className="w-4.5 cursor-pointer" width={20} height={20} />
                  <Image src={assets.regenerate_icon} alt="assistant-regen" className="w-4.5 cursor-pointer" width={20} height={20} />
                  <Image src={assets.like_icon} alt="assistant-like" className="w-4.5 cursor-pointer" width={20} height={20} />
                  <Image src={assets.dislike_icon} alt="assistant-dislike" className="w-4.5 cursor-pointer" width={20} height={20} />
                </>
              )}
            </div>
          </div>

          {role === "user" ? (
            <span className='text-white/90'>{content}</span>
          ) : (
            <>
              <Image src={assets.logo_icon} alt="assistant" className="h-9 w-9 p-1 rounded-full border border-white/15" width={20} height={20} />
              <div className='overflow-scroll mt-2 bg-gray-800 space-y-4 w-full'>{content}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
