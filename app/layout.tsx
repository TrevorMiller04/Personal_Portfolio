import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trevor Miller - MVP Portfolio",
  description: "Testing Vercel deployment with minimal dependencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <main>{children}</main>
      </body>
    </html>
  );
}