'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/public/assets/assets'
import { useAppContext } from '@/context/AppContext'
import { useClerk } from '@clerk/nextjs'
import toast from 'react-hot-toast'

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState('')
  const { user, chats, setChats, setSelectedChat, selectedChat } = useAppContext()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendPrompt(e)
    }
  }

  const sendPrompt = async (e) => {
    e.preventDefault()
    const promptCopy = prompt

    if (!promptCopy) return toast.error("Login to give a prompt")
    if (isLoading) return toast.error("Already sending a prompt")
    if (!selectedChat) return toast.error("No chat selected")

    console.log("🚀 Sending prompt:", promptCopy);
    console.log("💬 Selected chat:", selectedChat);

    setIsLoading(true)
    setPrompt('')

    const userPrompt = {
      role: "user",
      content: promptCopy,
      Timestamp: Date.now(),
    }

    setChats(prev =>
      prev.map(chat =>
        chat._id === selectedChat._id
          ? { ...chat, messages: [...chat.messages, userPrompt] }
          : chat
      )
    )

    try {
      console.log("📡 Making API call to /api/Chat/Ai");
      console.log("📤 Request body:", { chatId: selectedChat._id, prompt: promptCopy });
      
      const res = await fetch('/api/Chat/Ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: selectedChat._id, prompt: promptCopy }),
      })

      console.log("📥 API response status:", res.status);
      console.log("📥 API response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        console.error("❌ HTTP error:", res.status, res.statusText);
        const errorText = await res.text();
        console.error("❌ Error response body:", errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json()
      console.log("📄 API response data:", data);

      if (data.success) {
        const message = data.data.content
        console.log("🤖 AI response:", message);
        console.log("📄 Full response data:", data.data);
        
        const messageTokens = message.split(' ')

        let assistantMessage = {
          role: "assistant",
          content: "",
          Timestamp: Date.now(),
        }

        // Show typing effect
        messageTokens.forEach((_, index) => {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, index + 1).join(' ')
            setSelectedChat(prev => {
              const updatedMessages = [...prev.messages.slice(0, -1), assistantMessage]
              return { ...prev, messages: updatedMessages }
            })
          }, index * 100)
        })

        setChats(prev =>
          prev.map(chat =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        )

        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, data.data],
        }))
      } else {
        console.error("❌ API error:", data.message);
        console.error("❌ Full error response:", data);
        console.error("❌ Response status:", res.status);
        console.error("❌ Response headers:", Object.fromEntries(res.headers.entries()));
        toast.error(data.message || "Error occurred")
        setPrompt(promptCopy)
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast.error(error.message)
      setPrompt(promptCopy)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045]
     p-4 rounded-3xl mt-4 transition-all duration-300`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className='w-full bg-transparent outline-none overflow-hidden break-words resize-none'
        rows={2}
        placeholder='Message Deepseek'
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
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
          <button type="submit" className={`${prompt.length > 0 ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
            <Image className='w-3.5 aspect-square' src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt="send" />
          </button>
        </div>
      </div>
    </form>
  )
}

export default PromptBox
