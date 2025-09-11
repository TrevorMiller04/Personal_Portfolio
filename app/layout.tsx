import type { Metadata } from "next";

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
      <body style={{ 
        fontFamily: 'Inter, system-ui, sans-serif', 
        margin: 0,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        <main>{children}</main>
        
        {/* Debug info - Phase indicator */}
        <div style={{
          position: 'fixed',
          bottom: '8px',
          right: '8px',
          fontSize: '12px',
          opacity: 0.7,
          backgroundColor: '#dcfce7',
          color: '#166534',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #22c55e'
        }}>
          Phase 1a | {new Date().toLocaleTimeString()}
        </div>
      </body>
    </html>
  );
}