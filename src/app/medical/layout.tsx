import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "죽전한의원 진료 시스템",
    description: "의료진 전용 대시보드",
};

export default function MedicalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-medical-bg text-medical-text font-sans selection:bg-medical-primary/20">
            {/* Medical Header */}
            <header className="bg-white border-b border-medical-muted px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-medical-primary rounded-lg flex items-center justify-center text-white font-bold">
                        J
                    </div>
                    <h1 className="text-lg font-bold text-medical-text tracking-tight">죽전한의원 <span className="text-medical-subtext font-normal text-sm ml-1">Medical OS</span></h1>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-medical-subtext">김죽전 원장님</span>
                    <button className="px-3 py-1.5 border border-medical-muted rounded-md hover:bg-medical-muted transition-colors">
                        로그아웃
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
