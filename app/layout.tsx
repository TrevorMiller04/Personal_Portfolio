import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trevor Miller - Portfolio",
  description: "Full-Stack Developer & Data Engineer with modern tech stack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <main>{children}</main>
        
        {/* Debug info - Phase indicator */}
        <div className="fixed bottom-2 right-2 text-xs opacity-70 bg-green-100 text-green-800 px-2 py-1 rounded border border-green-500">
          Phase 1b | {new Date().toLocaleTimeString()}
        </div>
      </body>
    </html>
  );
}