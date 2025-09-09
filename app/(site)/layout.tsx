import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}