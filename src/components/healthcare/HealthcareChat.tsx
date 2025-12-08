"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "ai";
    content: string;
}

interface HealthcareChatProps {
    serviceType: string;
    serviceName: string;
    initialMessage: string;
}

export default function HealthcareChat({ serviceType, serviceName, initialMessage }: HealthcareChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: initialMessage }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/healthcare/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                    serviceType: serviceType,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "ai", content: data.content }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "죄송합니다. 잠시 문제가 발생했습니다. 다시 시도해 주세요." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="bg-traditional-accent/10 p-4 border-b border-traditional-accent/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-traditional-accent/20 flex items-center justify-center text-traditional-accent">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-stone-800">{serviceName}</h2>
                    <p className="text-xs text-stone-500">AI 한방 헬스케어</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === "user"
                                    ? "bg-traditional-accent text-white rounded-tr-none"
                                    : "bg-white border border-stone-100 text-stone-800 rounded-tl-none"
                                }`}
                        >
                            <div className="flex items-start gap-2 mb-1">
                                {msg.role === "ai" ? (
                                    <Bot size={14} className="mt-1 opacity-50" />
                                ) : (
                                    <User size={14} className="mt-1 opacity-50" />
                                )}
                                <span className="text-xs opacity-70 font-medium">
                                    {msg.role === "user" ? "나" : serviceName}
                                </span>
                            </div>
                            <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed whitespace-pre-wrap">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-traditional-accent/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-traditional-accent/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-traditional-accent/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-stone-100">
                <div className="flex gap-2 items-end bg-stone-50 p-2 rounded-xl border border-stone-200 focus-within:border-traditional-accent/50 focus-within:ring-1 focus-within:ring-traditional-accent/50 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="답변을 입력해주세요..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none min-h-[44px] max-h-[120px] p-2 text-stone-800 placeholder:text-stone-400 text-sm"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        className="p-2 rounded-lg bg-traditional-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-traditional-accent/90 transition-colors mb-0.5"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[10px] text-center text-stone-400 mt-2">
                    AI 답변은 참고용이며 의학적 진단을 대체하지 않습니다.
                </p>
            </div>
        </div>
    );
}
