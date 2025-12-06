"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("로그인 실패: " + error.message);
            setLoading(false);
        } else {
            router.push("/medical/dashboard");
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'kakao') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
        if (error) alert(error.message);
    };

    return (
        <div className="min-h-screen bg-traditional-bg flex flex-col items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 opacity-10 bg-[url('/texture-hanji.png')] pointer-events-none mix-blend-multiply"></div>

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-traditional-muted relative z-10 animate-fade-in">
                <Link href="/" className="absolute top-6 left-6 text-traditional-subtext hover:text-traditional-text">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <h1 className="text-2xl font-bold text-traditional-text mb-2">로그인</h1>
                    <p className="text-traditional-subtext text-sm">
                        더 정확한 진단과 처방을 위해<br />
                        의료진과 연결합니다.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-traditional-text mb-1">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-traditional-muted rounded-lg focus:outline-none focus:border-traditional-primary focus:ring-1 focus:ring-traditional-primary"
                            placeholder="example@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-traditional-text mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-traditional-muted rounded-lg focus:outline-none focus:border-traditional-primary focus:ring-1 focus:ring-traditional-primary"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-traditional-primary text-white rounded-lg font-medium hover:bg-traditional-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? "로그인 중..." : "이메일로 로그인"}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-traditional-muted"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-traditional-subtext">또는 소셜 로그인</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSocialLogin('kakao')}
                            className="flex items-center justify-center px-4 py-2 border border-traditional-muted rounded-lg hover:bg-yellow-50 transition-colors bg-[#FEE500] text-[#000000]"
                        >
                            카카오
                        </button>
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center px-4 py-2 border border-traditional-muted rounded-lg hover:bg-gray-50 transition-colors bg-white text-gray-700"
                        >
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
