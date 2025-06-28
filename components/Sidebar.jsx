'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { assets } from '@/public/assets/assets';
import { useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import RecentTabs from './RecentTabs';

const logo_text = '/assets/logo_text.svg';
const logo_icon = '/assets/logo_icon.svg';
const sidebar_icon = '/assets/sidebar_icon.svg';
const sidebar_close_icon = '/assets/sidebar_close_icon.svg';

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user, chats, createNewChat } = useAppContext();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${
        expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'
      } h-screen`}
    >
      {/* === Top Header === */}
      <div>
        <div className={`flex ${expand ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
          <Image
            className={expand ? 'w-36' : 'w-10'}
            src={expand ? logo_text : logo_icon}
            alt="logo"
            width={144}
            height={40}
          />

          {/* Sidebar Toggle */}
          <div
            onClick={() => setExpand(!expand)}
            className="group relative flex items-center justify-center hover:bg-white transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer"
          >
            <Image
              src={expand ? sidebar_close_icon : sidebar_icon}
              alt="menu"
              className="w-7 hidden md:block"
              width={28}
              height={28}
            />
            <div
              className={`absolute w-max ${
                expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0'
              } opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}
            >
              {expand ? 'Close sidebar' : 'Open sidebar'}
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand ? 'left-1/2 -top-1.5 translate-x-1/2' : 'left-4 -bottom-1.5'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* === Middle Section === */}
      <div className="flex flex-col mt-10 gap-4 overflow-y-auto flex-grow">
        {/* New Chat */}
        <button
          onClick={createNewChat}
          className={`flex items-center justify-center mt-8 cursor-pointer ${
            expand
              ? 'bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max'
              : 'group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg'
          }`}
        >
          <Image
            className={expand ? 'w-6' : 'w-7'}
            src={expand ? assets.chat_icon : assets.chat_icon_dull}
            alt="new chat"
          />
          <div className="w-max absolute -top-12 -right-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
            NEW CHAT
            <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
          </div>
          {expand && <p className="text-white font-medium">New Chat</p>}
        </button>

        {/* Recents */}
        {expand && (
          <div className="text-white/25 text-sm mt-4">
            <p className="my-1">Recents</p>
            {chats.map((chat) => (
              <RecentTabs
                key={chat._id}
                id={chat._id}
                name={chat.name}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            ))}
          </div>
        )}
      </div>

      {/* === Bottom Fixed GET APP Section === */}
      <div
        className={`relative group ${
          expand ? 'p-2.5 border-t border-white/10' : 'py-2'
        }`}
      >
        <div
          className={`flex items-center ${
            expand
              ? 'gap-2 text-white/80 text-sm hover:bg-white/10 rounded-lg p-2'
              : 'h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg justify-center'
          }`}
        >
          <Image
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt="chat"
            className={expand ? 'w-5' : 'w-6.5 mx-auto'}
            width={expand ? 20 : 26}
            height={expand ? 20 : 26}
          />

          {expand && <span>GET APP</span>}
          {expand && <Image src={assets.new_icon} alt="new icon" width={16} height={16} />}
        </div>

        {/* Tooltip */}
        <div
          className={`absolute z-10 ${
            expand ? 'left-full ml-2' : '-right-32'
          } bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-300`}
        >
          <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
            <Image src={assets.qrcode} alt="qr" className="w-44" width={176} height={176} />
            <p>Scan to get Deepseek app</p>
            <div className="w-3 h-3 absolute bg-black rotate-45 -left-1 -bottom-1.5"></div>
          </div>
        </div>
      </div>

      {/* === Profile === */}
      <div
        onClick={user ? null : openSignIn}
        className={`flex items-center ${
          expand
            ? 'hover:text-white hover:bg-gray-500/30 rounded-lg'
            : 'justify-center w-full'
        } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
      >
        {user ? (
          <UserButton />
        ) : (
          <Image
            src={assets.profile_icon}
            alt="profile"
            className="w-7"
            width={20}
            height={20}
          />
        )}
        {expand && <span>Profile</span>}
      </div>
    </div>
  );
};

export default Sidebar;
