import { useNavigate } from "react-router-dom";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSocket } from "../../context/SocketProvider";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState, useCallback, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
const Home = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [room, setRoom] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useAuthContext();
  const handleJoinCallerRoom = useCallback((data) => {
    const { room } = data;
    console.log(room);
    setRoom(room);
  }, []);

  useEffect(() => {
    if (room) {
      setIsOpen(true); // TODO
    }
  }, [room]);
  useEffect(() => {
    socket.on("callIncoming", handleJoinCallerRoom);
    return () => {
      socket.off("callIncoming", handleJoinCallerRoom);
    };
  }, [socket, handleJoinCallerRoom]);
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigate(`/room/${room}`);
                  const name = authUser.fullName;
                  console.log(socket);
                  socket.emit("room:join", { name, room: 1 });
                }}
              >
                Accept
              </button>
              <button onClick={() => setIsOpen(false)}>Reject</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebar />
        <MessageContainer />
      </div>
    </>
  );
};
export default Home;
