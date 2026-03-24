"use client";

import { useAuth } from '../context/AuthContext';
import { Plane, Calendar, MapPin, Download, CheckCircle2 } from 'lucide-react';

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

    if (loading) return <div className="min-h-screen pt-32 text-center text-navy font-bold">Verifying Session Token...</div>;

    if (!user) {
        return (
            <div className="min-h-screen pt-32 text-center text-navy flex flex-col items-center">
                <h2 className="text-3xl font-black mb-4">Access Denied</h2>
                <p className="text-gray-500 mb-8 max-w-sm">You must authenticate via Firebase Google OAuth to view your active Postgres booking records.</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary">Return Home</button>
            </div>
        );
    }

    const handleDownload = () => {
        // Triggers native browser print protocol for PDF generation via CSS @media print
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-32 text-navy flex flex-col items-center print:bg-white print:pt-4">

            {/* PROFILE HEADER - Hides on Print */}
            <div className="max-w-5xl w-full px-6 mb-12 flex items-center gap-6 print:hidden">
                <img src={user.profilePhoto || 'https://www.gravatar.com/avatar?d=mp'} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-soft" />
                <div>
                    <h1 className="text-3xl font-black">{user.name}</h1>
                    <p className="text-gray-500">{user.email}  ·  TravelWise Prime Member</p>
                </div>
            </div>

            <div className="max-w-5xl w-full px-6">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2 print:hidden"><Calendar className="text-accent" /> Upcoming Itineraries</h3>

                <div className="space-y-6">
                    {mockBookings.map((bk) => (
                        <div key={bk.id} className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden print:w-full print:border-none print:shadow-none print:rounded-none">

                            <div className="bg-navy p-6 flex justify-between items-center text-white print:bg-white print:text-navy print:border-b-2 print:border-navy">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl print:hidden">
                                        <Plane className="text-accent" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold tracking-widest text-gray-400 print:text-navy">TRAVELWISE E-TICKET</div>
                                        <div className="text-2xl font-black">PNR: {bk.pnr}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm print:hidden">
                                    <CheckCircle2 size={16} /> {bk.status}
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">

                                {/* Route Info */}
                                <div className="col-span-2 flex items-center justify-between text-center px-4">
                                    <div>
                                        <div className="text-4xl font-black text-navy">{bk.from}</div>
                                        <div className="text-gray-500 font-semibold mt-1">Departure</div>
                                    </div>
                                    <div className="flex-1 px-8 relative flex flex-col items-center">
                                        <div className="w-full border-t-2 border-dashed border-gray-300 relative mt-2">
                                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-accent print:hidden" size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-black text-navy">{bk.to}</div>
                                        <div className="text-gray-500 font-semibold mt-1">Arrival</div>
                                    </div>
                                </div>

                                {/* Details Box */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 print:border-gray-200">
                                    <div className="space-y-4 text-sm font-medium">
                                        <div className="flex justify-between"><span className="text-gray-400">Date</span> <span className="text-navy">{bk.date}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Operator</span> <span className="text-navy font-bold">{bk.operator}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Seats</span> <span className="text-accent font-bold">{bk.seats.join(', ')}</span></div>
                                        <div className="h-px bg-gray-200" />
                                        <div className="flex justify-between font-bold"><span className="text-gray-500">Total Fare</span> <span className="text-navy">₹{bk.amount}</span></div>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center print:hidden">
                                <span className="text-xs text-gray-400 font-bold">UUID: {bk.id}</span>
                                <button onClick={handleDownload} className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow hover:border-accent text-navy font-bold px-4 py-2 rounded-lg transition-all text-sm group">
                                    <Download size={16} className="text-accent group-hover:-translate-y-0.5 transition-transform" /> PDF E-Ticket
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
