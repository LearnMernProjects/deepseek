'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { assets } from '@/public/assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const RecentTabs = ({ openMenu, setOpenMenu, id, name }) => {
  const { fetchUsersChat, chats, setSelectedChat } = useAppContext();

  const isOpen = openMenu.id === id && openMenu.open;

  const selectChat = () => {
    const chatData = chats.find((chat) => chat._id === id);
    setSelectedChat(chatData);
    console.log("Selected chat data:", chatData);
  };

  const renameHandler = async () => {
    try {
      const newName = prompt("Enter new name");
      if (!newName) return;
      const { data } = await axios.post("/api/Chat/rename", { newName, chatId: id });
      if (data.success) {
        fetchUsersChat();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    try {
      const confirm = window.confirm("Do you want to delete this chat permanently?");
      if (!confirm) return;
      const { data } = await axios.post("/api/Chat/delete", { chatId: id });
      if (data.success) {
        fetchUsersChat();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={selectChat}
      className="flex items-center text-white/80 justify-between p-2 hover:bg-white/10 rounded-lg cursor-pointer group text-sm relative"
    >
      <p className="group-hover:max-w-5/6 truncate">{name}</p>

      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu({ id: id, open: !openMenu.open });
        }}
        className="relative flex h-6 w-6 justify-center items-center aspect-square hover:bg-white/20 rounded-lg z-10"
      >
        <Image
          src={assets.three_dots}
          alt="menu"
          className={`w-4 group-hover:block`}
        />

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-6 -right-36 bg-black w-max rounded-xl p-2 z-50 shadow-lg"
          >
            <div
              onClick={renameHandler}
              className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer"
            >
              <Image src={assets.pencil_icon} alt="Rename" className="w-4" />
              <p>Rename</p>
            </div>
            <div
              onClick={deleteHandler}
              className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer"
            >
              <Image src={assets.delete_icon} alt="Delete" className="w-4" />
              <p>Delete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTabs;
