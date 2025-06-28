"use client";

import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "@/utils/axiosInstance"; // ✅ Your custom Axios instance
import { isAxiosError } from "axios";      // ✅ Raw axios utility
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchUsersChats = useCallback(async () => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/Chat/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setChats(data.data);

        if (data.data.length === 0) {
          // Create a default chat when no chats exist
          const defaultChat = {
            _id: "default-chat-" + Date.now(),
            name: "New Chat",
            messages: [],
            userId: user?.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setChats([defaultChat]);
          setSelectedChat(defaultChat);
        } else {
          // Sort by most recent
          const sortedChats = data.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setSelectedChat(sortedChats[0]);
        }
      } else {
        toast.error(data.message || "Failed to fetch user's chats");
        // Create default chat even if API fails
        createDefaultChat();
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || error.message;
        toast.error(msg);
      } else {
        toast.error("Failed to fetch chats");
      }
      
      // Create default chat even if API fails
      createDefaultChat();
    }
  }, [getToken, user?.id]);

  // Helper function to create default chat
  const createDefaultChat = useCallback(() => {
    const defaultChat = {
      _id: "default-chat-" + Date.now(),
      name: "New Chat",
      messages: [],
      userId: user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats([defaultChat]);
    setSelectedChat(defaultChat);
  }, [user?.id]);

  const createNewChat = useCallback(async () => {
    try {
      if (!user) return;

      const token = await getToken();

      await axios.post(
        "/api/Chat/Create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUsersChats(); // Refresh chats
    } catch (error) {
      toast.error("Failed to create new chat");
      console.error("Create chat error:", error);
    }
  }, [getToken, user, fetchUsersChats]);

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    }
  }, [user, fetchUsersChats]);

  // Ensure there's always a selected chat
  useEffect(() => {
    if (user && !selectedChat && chats.length === 0) {
      console.log("Creating fallback default chat");
      createDefaultChat();
    }
  }, [user, selectedChat, chats.length, createDefaultChat]);

  const value = {
    chats,
    setChats,
    user,
    selectedChat,
    setSelectedChat,
    fetchUsersChats,
    createNewChat,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
