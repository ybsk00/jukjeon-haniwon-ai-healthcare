"use client";

import { useState } from "react";
import { Search, Calendar, Filter, Plus } from "lucide-react";

// Mock Data for MVP
const MOCK_PATIENTS = [
    { id: 1, name: "김민수", time: "10:00", type: "초진", complaint: "6개월째 아침 피로, 감기 잦음", status: "예진완료", score: 42 },
    { id: 2, name: "이영희", time: "10:30", type: "재진", complaint: "갱년기 열감, 불면", status: "예진완료", score: 55 },
    { id: 3, name: "박철수", time: "11:00", type: "초진", complaint: "허리 통증, 굽힐 때 심함", status: "진료중", score: 60 },
    { id: 4, name: "최지은", time: "11:30", type: "온라인", complaint: "식후 더부룩함, 야식 잦음", status: "미완료", score: 52 },
    { id: 5, name: "정우성", time: "13:00", type: "재진", complaint: "난임 상담, 생활 교정", status: "예약", score: 64 },
];

export default function DashboardPage() {
    const [patients, setPatients] = useState(MOCK_PATIENTS);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-medical-text">환자 리스트</h2>
                    <span className="px-2 py-0.5 bg-medical-primary/10 text-medical-primary text-xs font-bold rounded-full">
                        Today {patients.length}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-medical-subtext" size={18} />
                        <input
                            type="text"
                            placeholder="이름/차트번호 검색"
                            className="pl-10 pr-4 py-2 border border-medical-muted rounded-lg text-sm focus:outline-none focus:border-medical-primary w-64"
                        />
                    </div>
                    <button className="p-2 border border-medical-muted rounded-lg hover:bg-medical-muted text-medical-subtext">
                        <Filter size={18} />
                    </button>
                    <button className="flex items-center gap-1 px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary/90 text-sm font-medium">
                        <Plus size={16} />
                        환자 등록
                    </button>
                </div>
            </div>

            {/* Patient Table */}
            <div className="bg-white border border-medical-muted rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-medical-muted/50 border-b border-medical-muted text-xs uppercase text-medical-subtext font-semibold">
                            <th className="px-6 py-4">시간</th>
                            <th className="px-6 py-4">이름/유형</th>
                            <th className="px-6 py-4">주호소 (Chief Complaint)</th>
                            <th className="px-6 py-4">리듬점수</th>
                            <th className="px-6 py-4">상태</th>
                            <th className="px-6 py-4 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-medical-muted">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-medical-muted/30 transition-colors cursor-pointer group">
                                <td className="px-6 py-4 text-sm font-medium text-medical-text">
                                    {patient.time}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-medical-text">{patient.name}</span>
                                        <span className={`text-xs ${patient.type === '초진' ? 'text-medical-secondary' : 'text-medical-subtext'}`}>
                                            {patient.type}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-medical-text">
                                    {patient.complaint}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full max-w-[80px] h-2 bg-medical-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${patient.score < 50 ? 'bg-red-400' : patient.score < 70 ? 'bg-yellow-400' : 'bg-green-400'
                                                    }`}
                                                style={{ width: `${patient.score}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-medical-subtext">{patient.score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === '예진완료' ? 'bg-blue-100 text-blue-800' :
                                            patient.status === '진료중' ? 'bg-green-100 text-green-800' :
                                                patient.status === '미완료' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-purple-100 text-purple-800'
                                        }`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-medical-primary hover:text-medical-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
