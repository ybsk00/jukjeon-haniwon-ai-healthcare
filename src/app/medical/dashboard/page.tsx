"use client";

import { useState } from "react";
import { Search, ChevronDown, X, MessageSquare, CheckCircle2, Clock } from "lucide-react";

export default function DoctorDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("전체");

    // Define Patient type
    type Patient = {
        id: number;
        time: string;
        name: string;
        type: string;
        complaint: string;
        keywords: string[];
        status: "completed" | "pending";
    };

    // Mock Data for Demo
    const [patients, setPatients] = useState<Patient[]>([
        {
            id: 1,
            time: "10:00",
            name: "김OO",
            type: "초진",
            complaint: "6개월째 아침 피로, 감기 잦음",
            keywords: ["회복력 저하"],
            status: "pending"
        },
        {
            id: 2,
            time: "10:30",
            name: "이△△",
            type: "재진",
            complaint: "최근 소화불량 및 복부 팽만감",
            keywords: ["소화·수면"],
            status: "completed"
        },
        {
            id: 3,
            time: "11:00",
            name: "박□□",
            type: "초진",
            complaint: "만성적인 허리 통증과 뻣뻣함",
            keywords: ["통증"],
            status: "pending"
        },
        {
            id: 4,
            time: "11:30",
            name: "최○△",
            type: "온라인",
            complaint: "임신 준비를 위한 상담",
            keywords: ["임신 준비"],
            status: "completed"
        },
        {
            id: 5,
            time: "14:00",
            name: "정□○",
            type: "재진",
            complaint: "생리통 및 주기 불규칙",
            keywords: ["여성밸런스"],
            status: "pending"
        },
    ]);

    // TODO: Fetch real patients data from Supabase
    // useEffect(() => {
    //     const fetchPatients = async () => {
    //         const { data, error } = await supabase.from('patients').select('*');
    //         if (data) setPatients(data);
    //     };
    //     fetchPatients();
    // }, []);

    const filters = ["전체", "초진", "재진", "온라인", "완료", "대기"];

    const handleStatusClick = (patient: Patient) => {
        if (patient.status === "completed") {
            alert(`[예약 확인]\n날짜: 2025.12.08 (금)\n시간: ${patient.time}\n환자: ${patient.name}`);
        }
    };

    const handleComplaintClick = (patient: Patient) => {
        alert(`[채팅 내역 - ${patient.name}]\n\n(AI): 안녕하세요, 어디가 불편하신가요?\n(환자): ${patient.complaint}\n(AI): 언제부터 그러셨나요?\n...`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>

            {/* Top Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <button className="px-4 py-1.5 rounded-full border border-teal-600 text-teal-600 text-sm font-medium hover:bg-teal-50">
                    오늘
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter === activeFilter ? "" : filter)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${activeFilter === filter
                            ? "bg-teal-100 text-teal-700 border border-teal-200"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {filter}
                        {activeFilter === filter && <X size={12} />}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" size={20} />
                <input
                    type="text"
                    placeholder="이름/키워드 검색"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Patient Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-teal-50/50 border-b border-teal-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-teal-700">시간</th>
                            <th className="px-6 py-4 text-sm font-bold text-teal-700">이름</th>
                            <th className="px-6 py-4 text-sm font-bold text-teal-700">주호소 (클릭하여 채팅보기)</th>
                            <th className="px-6 py-4 text-sm font-bold text-teal-700">패턴 키워드</th>
                            <th className="px-6 py-4 text-sm font-bold text-teal-700">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {patients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    예약된 환자가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600 font-medium">{patient.time}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-gray-900">{patient.name}</span>
                                            <span className="text-gray-400">·</span>
                                            <span className={`text-sm font-medium ${patient.type === '초진' ? 'text-green-600' :
                                                patient.type === '온라인' ? 'text-blue-600' : 'text-gray-600'
                                                }`}>
                                                {patient.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleComplaintClick(patient)}
                                            className="text-gray-700 hover:text-teal-600 hover:underline text-left flex items-center gap-2 group"
                                        >
                                            <MessageSquare size={16} className="text-gray-400 group-hover:text-teal-500" />
                                            {patient.complaint}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {patient.keywords.join(", ")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleStatusClick(patient)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${patient.status === 'completed'
                                                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200 cursor-pointer'
                                                    : 'bg-gray-100 text-gray-500 cursor-default'
                                                }`}
                                        >
                                            {patient.status === 'completed' ? (
                                                <>
                                                    <CheckCircle2 size={16} />
                                                    완료
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={16} />
                                                    대기
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
