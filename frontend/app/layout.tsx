import type { Metadata } from 'next';
import './globals.css';
import Navbar from './navbar';
import Providers from './providers';

export const metadata: Metadata = {
  title: "TravelWise V2 | Premium Flights & Railways",
  description: "Enterprise multi-service booking platform with microservices architecture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-poppins relative bg-[#020617]" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <div className="relative z-10 min-h-screen pt-20 flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
