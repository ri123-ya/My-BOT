import { useState, useRef, useEffect } from "react";
import {
  User,
  Bot,
  ChevronDown,
  Linkedin,
  Github,
  Code,
  Briefcase,
  FileText,
  ChevronUp as ChevronUpIcon,
  Database,
  Sparkles,
} from "lucide-react";
import axios from "axios";

const ChatUI = () => {
  const [threadId, setThreadId] = useState(() => {
    const savedThreadId = sessionStorage.getItem("currentThreadId");
    if (savedThreadId) {
      return savedThreadId;
    }
    const newThreadId = `thread-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionStorage.setItem("currentThreadId", newThreadId);
    return newThreadId;
  });

  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [expandedSources, setExpandedSources] = useState({});
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "www.linkedin.com/in/riya-rastogi-260180204",
      icon: Linkedin,
    },
    { name: "GitHub", url: "https://github.com/ri123-ya/My-BOT", icon: Github },
    { name: "LeetCode", url: "https://leetcode.com/u/ri_123/", icon: Code },
    { name: "Portfolio", url: "https://yourportfolio.com", icon: Briefcase },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [inputValue]);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (isLoading || !inputValue.trim()) return;

    //add user message
    const userMsg = {
      id: `user-${Date.now()}-${Math.random()}`,
      sender: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const currentMsg = inputValue;
    setInputValue("");
    setIsLoading(true);
    setCurrentStep(" Classifying your question...");
    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        message: currentMsg,
        threadId: threadId,
      });

      const route = response.data.routeDecision;
      let stepInterval = null;
      if (route === "RAG_QUERY") {
        const steps = [
          "Searching for similar documents......",
          "Calling Groq API..",
          "RAG : Generating Response...",
        ];
        let stepIndex = 0;

        setCurrentStep(steps[0]); // Start with first step

        stepInterval = setInterval(() => {
          stepIndex++;
          if (stepIndex < steps.length) {
            setCurrentStep(steps[stepIndex]);
          }
        }, 1000);
        // Wait for the animation to complete before showing response
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 steps × 1 second

        if (stepInterval) {
          clearInterval(stepInterval);
          stepInterval = null;
        }
      } else {
        setCurrentStep("Direct LLM : Generating Response...");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const botMessage = {
        id: `user-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text: response.data.answer,
        sources: response.data.sources || [],
        usedRetrieval: response.data.usedRetrieval,
        routeDecision: response.data.routeDecision,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      clearInterval(stepInterval);
      console.error("Error calling API:", error);

      const errorMessage = {
        id: `user-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again later.",
        sources: [],
        usedRetrieval: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      if (setInterval) clearInterval(setInterval);
    } finally {
      setIsLoading(false);
      setCurrentStep("");
    }
  };

  const handleNewChat = () => {
    const newThreadId = `thread-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    setThreadId(newThreadId);
    setMessages([]);
    setExpandedSources({});
    sessionStorage.setItem("currentThreadId", newThreadId);
    sessionStorage.removeItem("chatMessages");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-neutral-900 text-white min-h-screen overflow-x-hidden">
      {/* Header with RiyaBot and Social Links */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-transparent">
        {/* Left: RiyaBot dropdown */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800/40 transition-colors"
          >
            <span className="font-semibold text-white">RiyaBot</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                showMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showMenu && (
            <div className="absolute top-12 left-0 bg-neutral-800/90 backdrop-blur-md rounded-lg shadow-lg border border-neutral-700 w-56 p-2">
              {socialLinks.map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors"
                >
                  <Icon size={18} className="text-gray-300" />
                  <span className="text-gray-200">{name}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-md text-sm text-gray-200 hover:bg-neutral-700 transition-colors"
        >
          <span className="text-lg">+</span>
          <span>New Chat</span>
        </button>
      </header>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="container mx-auto max-w-3xl pb-44 px-2 overflow-y-auto"
        style={{
          height: "calc(100vh - 200px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg">Ask me anything!</p>
              {/*Show thread ID for debugging */}
              <p className="text-xs mt-2 text-gray-600">
                Thread: {threadId.slice(0, 25)}...
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id || message.text}>
              {message.sender === "user" ? (
                <div className="flex items-start justify-end my-6 gap-3">
                  <div className="bg-neutral-800 p-3 rounded-lg max-w-[70%]">
                    {message.text}
                  </div>
                  <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                    <User size={20} />
                  </div>
                </div>
              ) : (
                <div className="my-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600 p-2 rounded-full flex-shrink-0">
                      <Bot size={20} />
                    </div>
                    <div className="max-w-[70%]">
                      {/* Main answer */}
                      <div className="text-gray-100">{message.text}</div>
                    </div>
                  </div>

                  {/*Sources Display - Below the answer */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 ml-14">
                      {/* Toggle button */}
                      <button
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors mb-2"
                        onClick={() =>
                          setExpandedSources((prev) => ({
                            ...prev,
                            [message.id]: !prev[message.id],
                          }))
                        }
                      >
                        <span className="text-xs font-medium">
                          {expandedSources[message.id]
                            ? `Hide Sources (${message.sources.length})`
                            : `View Sources (${message.sources.length})`}
                        </span>
                        {expandedSources[message.id] ? (
                          <ChevronUpIcon size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>

                      {/* Show grid of cards when expanded */}
                      {expandedSources[message.id] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {message.sources.map((source, index) => (
                            <div
                              key={index}
                              className="bg-neutral-800/60 border border-neutral-700/50 rounded-lg p-3 hover:border-neutral-600 transition-all"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <FileText
                                  size={14}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span className="text-xs text-gray-300 truncate font-mono">
                                  Resume.pdf
                                </span>
                                <span className="text-xs text-gray-500 block">
                                  Page {source.metadata?.page || index + 1}
                                </span>
                              </div>
                              {/* Content Preview */}
                              <div className="text-xs text-gray-400 leading-relaxed line-clamp-3 mt-2">
                                {source.pageContent ||
                                  source.content ||
                                  "No preview available"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 my-6">
            <div className="bg-green-600 p-2 rounded-full flex-shrink-0">
              <Bot size={20} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                {/* <Loader2 size={16} className="animate-spin" /> */}
                <span className="animate-pulse">
                  {currentStep || "Thinking..."}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Please wait while I process your request
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center bg-neutral-900">
        <div className="bg-neutral-800 p-2 rounded-3xl w-full max-w-3xl mb-3 mx-2 relative">
          <textarea
            ref={textareaRef}
            className="w-full resize-none outline-0 p-3 bg-transparent text-white custom-scrollbar"
            rows="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              minHeight: "48px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
            disabled={isLoading}
          />
          <div className="flex items-center justify-end absolute right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-white px-4 py-1 text-black rounded-full cursor-pointer hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ask
            </button>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatUI;
