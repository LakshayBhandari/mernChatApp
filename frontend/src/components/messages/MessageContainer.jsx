import { useCallback, useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { BsCameraVideo } from "react-icons/bs";

import { useSocket } from "../../context/SocketProvider";

import { useNavigate } from "react-router-dom";
const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const socket = useSocket();
  useEffect(() => {
    // cleanup function (unmounts)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const handleVideoCall = useCallback(() => {
    const name = authUser.fullName;
    console.log(socket);
    socket.emit("room:join", { name });
  }, []);


  const handleJoinRoom = useCallback((data) => {
    const { name, room } = data;
    console.log(data);
    if (name && room) {
      navigate(`/room/${room}`);
    }
  }, []);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    
    };
  }, [socket,handleJoinRoom]);

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2 flex w-full justify-between items-center">
            <div>
              <span className="label-text">To:</span>{" "}
              <span className="text-gray-900 font-bold">
                {selectedConversation.fullName}
              </span>
            </div>
            <div
              onClick={handleVideoCall}
              className="flex items-center gap-2 cursor-pointe text-white"
            >
              Video Chat
              <BsCameraVideo />
            </div>
          
          </div>
          <Messages />
          <MessageInput />

        </>
      )}
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
