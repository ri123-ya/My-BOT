import { useState, useRef, useEffect } from "react";
import { User,Bot} from "lucide-react";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);

      // Simulate bot response (you'll replace this with backend later)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is a placeholder response!", sender: "bot" },
        ]);
      }, 500);

      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-neutral-900 text-white min-h-screen overflow-x-hidden">
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="container mx-auto max-w-3xl pb-44 px-2 overflow-y-auto h-[80vh]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>
            {message.sender === "user" ? (
              // User message
              <div className="flex items-start justify-end my-6 gap-3">
                <div className="bg-neutral-800 p-3 rounded-lg max-w-[70%]">
                  {message.text}
                </div>
                <div className="bg-gray-600 p-2 rounded-full flex-shrink-0">
                  <User size={20} />
                </div>
              </div>
            ) : (
              // Bot message
              <div className="flex items-start gap-3 my-6">
                <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                  <Bot size={20} />
                </div>
                <div className="max-w-fit">{message.text}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center bg-neutral-900">
        <div className="bg-neutral-800 p-2 rounded-3xl w-full max-w-3xl mb-3 mx-2">
          <textarea
            className="w-full resize-none outline-0 p-3 bg-transparent text-white"
            rows="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{ minHeight: "48px", maxHeight: "150px" }}
          />
          <div className="flex items-center justify-end">
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-white px-4 py-1 text-black rounded-full cursor-pointer hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ask 
            </button>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatUI;