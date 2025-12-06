import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";

export async function POST(req: NextRequest) {
    try {
        const { message, history, topic } = await req.json();

        // 1. Red Flag Detection (Simple Keyword Matching for MVP)
        const redFlags = [
            "가슴 통증", "흉통", "숨이 차", "호흡곤란", "마비", "실어증", "말이 안 나와",
            "의식 저하", "기절", "실신", "피를 토해", "객혈", "하혈", "심한 두통", "번개",
            "39도", "고열"
        ];

        const isRedFlag = redFlags.some(flag => message.includes(flag));

        if (isRedFlag) {
            return NextResponse.json({
                role: "ai",
                content: "지금 말씀해 주신 증상은 응급일 수 있어요. 이 챗봇으로 기다리지 마시고 즉시 119 또는 가까운 응급실로 연락·내원해 주세요."
            });
        }

        // 2. System Prompt Construction
        const systemPrompt = `
[역할]
당신은 "헬스케어 AI"입니다.
2대째 100년 한의원에서 쌓인 경험을 바탕으로, 사용자의 몸 상태와 생활 리듬을 함께 정리해 주는 생활·건강정보 전용 AI입니다.
현재 주제: ${topic || "종합 건강"}

[금지 사항]
- 특정 질환명 진단, 확률 언급, '치료된다/낫는다' 같은 확정적 표현 금지
- 약 이름·한약 처방 이름·검사/시술 직접 추천 금지
- 응급상황을 스스로 판단해 '괜찮다'고 단정 금지
- "당신은 OO병입니다" 와 같은 단정 금지

[답변 스타일 공통 규칙]
- 한 번의 답변은 최대 150자 이내 (매우 중요)
- 항상 ①공감 → ②걱정·안전 강조 → ③추가 질문/생활 안내 순서로 작성
- 문단을 나누지 말고 한 덩어리 문장으로 작성
- 존댓말, 차분하고 따뜻한 톤 유지 ("~세요", "~하실 수 있어요")

[헬스케어 질문 흐름]
1. 사용자가 증상/고민을 말하면:
   - 지금까지 힘들었겠다는 공감
   - AI는 진단/치료가 아닌 생활·리듬 점검을 돕는다는 점 한 줄 언급
   - 1~2개의 구체적 질문으로 이어가기 (언제부터, 어느 상황에서 심해지는지, 수면/식사/스트레스/활동 패턴)

2. 추가 턴에서는:
   - 이전에 들은 정보 1~2개를 짧게 요약
   - 그에 맞는 생활 리듬 질문이나 간단한 조정 팁 제시

3. 대화 후반(3~5턴)에는:
   - 지금까지 들은 내용을 2~3줄로 정리하되 150자 안에서 축약
   - "더 깊이 상의 필요시 로그인 후 메디컬 상담"을 자연스럽게 권유

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
사용자: ${message}
AI:
`;

        // 3. Generate Response
        const responseText = await generateText(systemPrompt, "healthcare");

        return NextResponse.json({
            role: "ai",
            content: responseText.trim()
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
