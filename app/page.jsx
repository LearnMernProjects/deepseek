'use client'
import { useState } from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets.js";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
export default function Home() {
  const [expand, setExpand]= useState(false);
  const [messages, setMessages]= useState([]);
  const [isLoading, setIsLoading]= useState(false);
  return (
    <div>
      <div className="h-screen flex">
        <Sidebar expand ={expand} setExpand={setExpand} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={() =>(expand? setExpand(false): setExpand(true)) } className="rotate-180" src={assets.menu_icon} alt="Toggle menu"/>
              <Image className="opacity-70" src={assets.chat_icon} alt="Chat icon"/>
          </div>
          {messages.length===0?(
            <> 
            <div className="flex items-center gap-3"> 
              <Image src={assets.logo_icon} alt="Chat icon" className="h-16"/>
              <p className="text-2xl font-medium">Hi I am DeepSeek</p>
              </div> 
              <p className="text-sm  mt-2">How Can I Help You?
                </p>
                </>):
            ( <div> 
              <Message role="user" content="what is the capital of France?"/>
            </div>

          )}
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI GENERATED TEXT FOR CLEAR REFRENCE

          </p>
        </div>
      </div>
      
    </div>
  );
}
