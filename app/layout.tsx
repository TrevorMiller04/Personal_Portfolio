import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trevor Miller • Portfolio",
  description: "Junior CS Major at Syracuse University with experience in full-stack development, data science, and AI/ML. Available for summer 2025 internships.",
  keywords: [
    "Trevor Miller",
    "Syracuse University", 
    "Computer Science",
    "Full-Stack Developer",
    "Data Science",
    "AI/ML",
    "Internships",
    "Python",
    "JavaScript",
    "React"
  ],
  authors: [{ name: "Trevor Miller" }],
  creator: "Trevor Miller",
  openGraph: {
    title: "Trevor Miller • Portfolio",
    description: "Junior CS Major at Syracuse University",
    url: "https://trevormiller.xyz",
    siteName: "Trevor Miller Portfolio",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://trevormiller.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Merriweather:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}