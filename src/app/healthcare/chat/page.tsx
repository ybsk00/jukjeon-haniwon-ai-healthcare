import { Suspense } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-traditional-bg">로딩중...</div>}>
            <ChatInterface />
        </Suspense>
    );
}
