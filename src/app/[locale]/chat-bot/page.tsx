"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getUserInfo } from "@/service/authService";

// Define TypeScript interfaces
interface Message {
  sender: "user" | "bot";
  text: string;
  options?: string[];
  timestamp: Date;
}

interface UserInfo {
  organizationId?: string;
  [key: string]: any;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: "bot", 
      text: "👋 Hello! Type 'order' to start your order.",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => Date.now().toString());
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userInfo: any = getUserInfo();

  // Auto-scroll + focus input whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages]);

  const handleSend = async (msg?: string) => {
    const messageToSend = msg || input;
    if (!messageToSend.trim()) return;

    // Add user message
    const userMessage: Message = { 
      sender: "user", 
      text: messageToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:8080/api/chat", {
        message: messageToSend,
        sessionId,
        organizationId: userInfo?.organizationId,
      });

      // Simulate typing delay
      setTimeout(() => {
        let replyText = "";
        if (typeof res.data?.reply === "object" && res.data.reply?.reply) {
          replyText = res.data.reply.reply;
        } else if (typeof res.data?.reply === "string") {
          replyText = res.data.reply;
        } else {
          replyText = JSON.stringify(res.data);
        }

        const botMessage: Message = { 
          sender: "bot", 
          text: replyText, 
          options: res.data?.options || [],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: "❌ Something went wrong. Please try again.",
          timestamp: new Date()
        },
      ]);
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleOptionClick = async (option: string) => {
    await handleSend(option);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <i className="ri-robot-2-line text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold">Chat Assistant</h2>
              <p className="text-indigo-200 text-sm">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="space-y-4">
            {messages.map((msg:any, i:any) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {msg.sender === "bot" && (
                      <div className="mt-0.5 text-indigo-500">
                        <i className="ri-robot-2-line"></i>
                      </div>
                    )}
                    <div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${msg.sender === "user" ? "text-indigo-200" : "text-gray-500"}`}>
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.sender === "user" && (
                          <div className="text-indigo-200">
                            <i className="ri-user-3-line text-sm"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Optional Buttons */}
                  {msg.options?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.options.map((opt:any, idx:any) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt)}
                          className="text-sm bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 shadow-sm"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="text-indigo-500">
                      <i className="ri-robot-2-line"></i>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Field */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="w-full py-3 px-4 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                loading || !input.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <i className="ri-loader-4-line animate-spin"></i>
              ) : (
                <i className="ri-send-plane-2-line"></i>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Powered by AI Assistant
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Need help? Contact support@example.com</p>
      </div>
    </div>
  );
}
