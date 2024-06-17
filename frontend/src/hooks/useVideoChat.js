import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useVideoChat = () => {
	
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendImage = async (message) => {

      const formData = new FormData();
      formData.append("file", file);
		setLoading(true);
		try {
			const res = await fetch(`/api/messages/videoCall/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendImage };
};
export default useVideoChat;