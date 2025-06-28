'use client'
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets.js";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import { useAppContext } from "@/context/AppContext"; // Ensure this exists and is correctly set up

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div>
      <div className="h-screen flex">
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={() => (expand ? setExpand(false) : setExpand(true))} className="rotate-180" src={assets.menu_icon} alt="Toggle menu" />
            <Image className="opacity-70" src={assets.chat_icon} alt="Chat icon" />
          </div>

          {messages.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="Chat icon" className="h-16" />
                <p className="text-2xl font-medium">Hi I am DeepSeek</p>
              </div>
              <p className="text-sm mt-2">How Can I Help You?</p>
            </>
          ) : (
            <div ref={containerRef} className="flex flex-col relative items-center justify-start w-full mt-20 max-h-screen overflow-y-auto">
              <p className="fixed top-8 border border-transparent hover:border-gray-500/50 rounded-lg px-2 py-1 mb-6 font-semibold">{selectedChat.name}</p>
              {messages.map((message, index) => (
                <Message role={message.role} key={index} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex py-3 max-w-3xl w-full gap-4">
                  <Image src={assets.logo_icon} alt="Loading" className="h-9 w-9 p-1 border border-white/15 rounded-full" />
                  <div className="loader flex justify-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-white animate-bounce"></div>
                    <div className="h-1 w-1 rounded-full bg-white animate-bounce"></div>
                    <div className="h-1 w-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI GENERATED TEXT FOR CLEAR REFERENCE</p>
        </div>
      </div>
    </div>
  );
}
