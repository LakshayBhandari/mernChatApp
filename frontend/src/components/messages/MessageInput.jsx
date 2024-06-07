import { useState ,useEffect} from "react";
import { BsFillImageFill, BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    const type="text"
    e.preventDefault();
    if (!message) return;
    await sendMessage(message,type);
    setMessage("");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type","image");
    console.log(formData)
    await sendMessage(formData,"image")
    setMessage("");
  };

 
  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{display:"none"}}
        />
        <label for="fileInput" className="absolute inset-y-0 end-0 flex items-center pe-3">
          <BsFillImageFill/>
        </label>
        <button
          type="submit"
          className="absolute inset-y-0 end-8 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend />
          )}
        </button>
      </div>
    </form>
  );
};
export default MessageInput;
