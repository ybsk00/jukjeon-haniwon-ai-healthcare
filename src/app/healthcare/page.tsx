import Link from "next/link";
import { Battery, Moon, CloudRain, Thermometer, Baby } from "lucide-react";

const services = [
    {
        id: "recovery",
        title: "회복력·면역",
        subtitle: "기력 배터리 & 한방 기운 도장",
        description: "지금 내 몸 배터리는 몇 %일까? 한의사가 보는 오늘 기력 점수 확인하기",
        icon: Battery,
        color: "bg-blue-100 text-blue-600",
    },
    {
        id: "women",
        title: "여성 밸런스",
        subtitle: "월경 리듬 MBTI",
        description: "나의 한방 여성 리듬 MBTI는? PMS 때 나는 숨고 싶은 타입 vs 말 걸지 마 타입?",
        icon: Moon,
        color: "bg-purple-100 text-purple-600",
    },
    {
        id: "pain",
        title: "통증 패턴",
        subtitle: "통증 지도 & 몸 날씨 예보",
        description: "한의사가 보는 내 몸 통증 지도. 오늘 내 몸 날씨는 맑음일까 흐림일까?",
        icon: CloudRain,
        color: "bg-gray-100 text-gray-600",
    },
    {
        id: "digestion",
        title: "소화·수면",
        subtitle: "위장 온도계 & 수면 한방 MBTI",
        description: "내 위장은 지금 뜨거울까, 차가울까? 야식과 수면 패턴으로 보는 내 타입",
        icon: Thermometer,
        color: "bg-orange-100 text-orange-600",
    },
    {
        id: "pregnancy",
        title: "임신 준비",
        subtitle: "임신 체력 레벨 테스트",
        description: "임신을 준비하는 내 몸, 체력 레벨은? 성실 준비형 vs 휴식 필요형",
        icon: Baby,
        color: "bg-pink-100 text-pink-600",
    },
];

export default function HealthcarePage() {
    return (
        <div className="min-h-screen bg-stone-50 p-6 pb-24">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-2xl font-bold text-stone-800">AI 한방 헬스케어</h1>
                    <p className="text-stone-500 text-sm">
                        전통 한의학과 AI가 만나<br />
                        당신의 매일매일 건강 리듬을 챙겨드립니다.
                    </p>
                </div>

                <div className="grid gap-4">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={`/healthcare/${service.id}`}
                            className="block bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${service.color}`}>
                                    <service.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                            {service.title}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-stone-800 leading-tight">
                                        {service.subtitle}
                                    </h3>
                                    <p className="text-sm text-stone-500 leading-snug">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
