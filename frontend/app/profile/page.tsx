"use client";

import { useAuth } from '../context/AuthContext';
import { Plane, Download, CheckCircle2 } from 'lucide-react';

export default function ProfileDashboard() {
    const { user, loading } = useAuth();

    // Mocked Database Bookings since Postgres hook requires active session state across the real OAuth layer
    const mockBookings = [
        {
            id: "bk_9a8f7c",
            pnr: "AWT6XY",
            date: new Date().toLocaleDateString(),
            from: "DEL",
            to: "BOM",
            operator: "IG-305",
            seats: ["1A", "1B"],
            status: "CONFIRMED",
            amount: 9500
        }
    ];

    if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-accent font-black uppercase tracking-[0.4em] animate-pulse">Syncing Galactic Identity...</div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-[#020617] pt-48 text-center text-white flex flex-col items-center px-6">
                <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 mb-8 animate-fade-up">
                    <h2 className="text-4xl font-black mb-2 tracking-tighter">Identity Not Found</h2>
                    <p className="text-gray-500 font-extrabold uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">Access to the Postgres registry requires a cryptographically signed Firebase session.</p>
                </div>
                <button onClick={() => window.location.href = '/'} className="px-10 py-4 bg-white text-navy font-black rounded-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-2xl">Return to Command Center</button>
            </div>
        );
    }

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#020617] pt-32 pb-32 text-white flex flex-col items-center print:bg-white print:pt-4">

            {/* PROFILE HEADER - Hides on Print */}
            <div className="max-w-5xl w-full px-6 mb-16 flex items-center gap-10 print:hidden animate-fade-in">
                <div className="relative">
                    <img src={user.profilePhoto || 'https://www.gravatar.com/avatar?d=mp'} alt="Profile" className="w-24 h-24 rounded-[32px] border-4 border-white/10 shadow-2xl object-cover" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-xl border-4 border-[#020617] flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-navy" strokeWidth={3} />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-black mb-1 tracking-tighter">{user.name}</h1>
                    <p className="text-gray-500 font-extrabold uppercase tracking-[0.3em] text-[10px]">{user.email}  ·  Command Center Access Granted</p>
                </div>
            </div>

            <div className="max-w-5xl w-full px-6">
                <h3 className="font-black text-xs uppercase tracking-[0.4em] text-accent mb-10 flex items-center gap-4 print:hidden">
                    <div className="w-8 h-px bg-accent/30"></div>
                    Active Flight Metadata
                </h3>

                <div className="space-y-10">
                    {mockBookings.map((bk) => (
                        <div key={bk.id} className="acrylic-glass rounded-[48px] border border-white/5 shadow-2xl transition-all hover:border-accent/40 group overflow-hidden print:w-full print:border-none print:shadow-none print:rounded-none">

                            <div className="p-8 border-b border-white/5 flex justify-between items-center print:border-b-2 print:border-navy">
                                <div className="flex items-center gap-6">
                                    <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20 print:hidden">
                                        <Plane className="text-accent" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase print:text-navy">TRAVELWISE E-TICKET</div>
                                        <div className="text-3xl font-black tracking-tighter mt-1">{bk.pnr}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-accent text-navy px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest print:hidden">
                                    <CheckCircle2 size={16} strokeWidth={3} /> {bk.status}
                                </div>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                {/* Route Info */}
                                <div className="col-span-2 flex items-center justify-between text-center px-6">
                                    <div className="text-left">
                                        <div className="text-5xl font-black text-white tracking-tighter mb-2">{bk.from}</div>
                                        <div className="text-accent font-black text-[10px] uppercase tracking-[0.4em]">ORIGIN</div>
                                    </div>
                                    <div className="flex-1 px-12 relative flex flex-col items-center">
                                        <div className="w-full h-px border-b-2 border-dashed border-white/10 relative mt-2">
                                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-5 text-accent group-hover:scale-110 transition-transform print:hidden" size={32} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-5xl font-black text-white tracking-tighter mb-2">{bk.to}</div>
                                        <div className="text-accent font-black text-[10px] uppercase tracking-[0.4em]">DESTINATION</div>
                                    </div>
                                </div>

                                {/* Details Box */}
                                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-3xl print:border-gray-200">
                                    <div className="space-y-6 text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex justify-between"><span className="text-gray-500">DEPARTURE</span> <span className="text-white">{bk.date}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">FLEET</span> <span className="text-white">{bk.operator}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">COORDINATES</span> <span className="text-accent">{bk.seats.join(' · ')}</span></div>
                                        <div className="h-px bg-white/5 my-4" />
                                        <div className="flex justify-between font-black"><span className="text-gray-500">TOTAL FARE</span> <span className="text-white text-lg tracking-tighter">₹{bk.amount.toLocaleString('en-IN')}</span></div>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-white/[0.02] p-6 border-t border-white/5 flex justify-between items-center print:hidden">
                                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">{bk.id}</span>
                                <button onClick={handleDownload} className="flex items-center gap-3 bg-white text-navy font-black px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest group shadow-xl">
                                    <Download size={18} strokeWidth={3} className="text-accent group-hover:translate-y-0.5 transition-transform" /> Generate PDF
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
