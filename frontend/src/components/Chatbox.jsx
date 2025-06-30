import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  User,
  Bot,
  ChevronDown,
  Copy,
  Volume2,
  Check,
} from "lucide-react";

export const ChatInterface = () => {
  const [messages, setMessages] = useState(() => {
    const youtubeId = sessionStorage.getItem("videoId");
    const saved = youtubeId && sessionStorage.getItem(`chatMessages_${youtubeId}`);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: "1",
          text: "Hi! I'm here to help you learn from this video. Ask me anything about the content, or I can quiz you on what you've watched!",
          sender: "ai",
        },
      ];
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const youtubeId = sessionStorage.getItem("videoId");
    if (youtubeId) {
      const MAX_MESSAGES = 500;
      const trimmedMessages = messages.slice(-MAX_MESSAGES);
      sessionStorage.setItem(`chatMessages_${youtubeId}`, JSON.stringify(trimmedMessages));
    }
  }, [messages]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isTextareaOverflowing, setIsTextareaOverflowing] = useState(false);

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollChatToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollButton(!isNearBottom);
    setShouldAutoScroll(isNearBottom);
  };

  useEffect(() => {
    if (shouldAutoScroll) scrollChatToBottom();
  }, [messages, isTyping]);

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const maxHeight = 160;
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
      setIsTextareaOverflowing(el.scrollHeight > maxHeight);
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setShouldAutoScroll(true);
    setTimeout(() => scrollChatToBottom(), 100);
    const chatId = sessionStorage.getItem("chatId");
    const videoId = sessionStorage.getItem("videoId");

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.text,
          chatId,
          videoId,
        }),
      });

      const data = await response.json();
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: data?.answer || "Sorry, no response received.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        text: "There was an error contacting the server.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (messageId, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleReadAloud = (messageId, text) => {
    if (speakingMessageId) {
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    if (speakingMessageId === messageId) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    speechSynthesis.speak(utterance);
  };

  const handleScrollToBottom = () => {
    setShouldAutoScroll(true);
    scrollChatToBottom();
  };

  const ThinkingAnimation = () => (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-md">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageActions = ({ message }) => (
    <div className="flex items-center space-x-1 mt-2 opacity-100 transition-opacity duration-200">
      <button
        onClick={() => handleCopyMessage(message.id, message.text)}
        className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors duration-200 text-slate-500 hover:text-slate-700"
        title="Copy message"
      >
        {copiedMessageId === message.id ? (
          <Check className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
      {message.sender === "ai" && (
        <button
          onClick={() => handleReadAloud(message.id, message.text)}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-colors duration-200 ${
            speakingMessageId === message.id
              ? "text-blue-600 bg-blue-50"
              : "text-slate-500 hover:text-slate-700"
          }`}
          title="Read aloud"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-slate-200/50 flex flex-col w-full relative h-[395px] mb-8 md:mb-0"
    >
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">AI Learning Assistant</h3>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn group`}
            >
              <div
                className={`flex items-start space-x-2.5 max-w-[85%] ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.sender === "user"
                      ? "bg-slate-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div className="flex flex-col max-w-full sm:max-w-[85%]">
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      message.sender === "user"
                        ? "bg-slate-600 text-white rounded-tr-md"
                        : "bg-slate-100 text-slate-800 rounded-tl-md hover:bg-slate-50"
                    }`}
                  >
                    <p
                    style={{ overflowWrap: "anywhere" }}
                    className="text-sm leading-relaxed break-words whitespace-pre-wrap"
                    >
                    {message.text}
                    </p>


                  </div>
                  <MessageActions message={message} />
                </div>
              </div>
            </div>
          ))}
          {isTyping && <ThinkingAnimation />}
        </div>

        {showScrollButton && (
          <button
            onClick={handleScrollToBottom}
            className="absolute right-4 bottom-4 w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl flex-shrink-0">
        <div className="flex space-x-2.5 items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about the video..."
            className={`flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-800 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 caret-blue-500 resize-none ${
              isTextareaOverflowing
                ? "overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                : "overflow-hidden"
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-3.5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
