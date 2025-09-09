import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClientProviderWrapper } from '@/components/providers/query-client-provider';
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trevor Miller - Full-Stack Developer & Data Engineer",
  description: "Modern portfolio showcasing advanced web applications, data analytics, and engineering solutions built with Next.js, TypeScript, and cutting-edge tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProviderWrapper>
          <div className="min-h-screen flex flex-col">
            <header className="border-b bg-background">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                  <Link href="/" className="text-2xl font-bold">
                    Trevor Miller
                  </Link>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <Link href="/projects" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                          Projects
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/data-stories" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                          Data Stories
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/contact" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                          Contact
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </nav>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t bg-muted/50">
              <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>© 2024 Trevor Miller. All rights reserved.</p>
                  <div className="flex items-center space-x-4">
                    <a href="https://github.com/TrevorMiller04" className="hover:text-primary">
                      GitHub
                    </a>
                    <a href="https://linkedin.com/in/trevormiller04" className="hover:text-primary">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
