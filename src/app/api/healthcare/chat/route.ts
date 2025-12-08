import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";
import { HEALTHCARE_PROMPTS } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
    try {
        const { message, history, serviceType } = await req.json();

        if (!serviceType || !HEALTHCARE_PROMPTS[serviceType as keyof typeof HEALTHCARE_PROMPTS]) {
            return NextResponse.json(
                { error: "Invalid service type" },
                { status: 400 }
            );
        }

        const systemPrompt = HEALTHCARE_PROMPTS[serviceType as keyof typeof HEALTHCARE_PROMPTS];

        // Combine system prompt with conversation history
        const fullPrompt = `
${systemPrompt}

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
사용자: ${message}
AI:
`;

        // Use "healthcare" mode for faster response (gemini-2.5-flash)
        const responseText = await generateText(fullPrompt, "healthcare");

        return NextResponse.json({
            role: "ai",
            content: responseText.trim()
        });

    } catch (error) {
        console.error("Healthcare Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
