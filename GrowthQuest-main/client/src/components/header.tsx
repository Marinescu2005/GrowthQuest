nimport { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Mountain } from "lucide-react";
import { Link, useLocation } from "wouter";

// Defensive: fallback for missing user image
const getUserImage = (user: any) => {
  if (user?.profileImageUrl && user.profileImageUrl.startsWith('http')) return user.profileImageUrl;
  if (user?.id) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=default`;
};

// Helper: focus first nav item on tab for accessibility
const focusFirstNav = () => {
  const first = document.querySelector('nav a');
  if (first) (first as HTMLElement).focus();
};

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", id: "dashboard" },
    { path: "/map", label: "Harta", id: "map" },
    { path: "/goals", label: "Obiective", id: "goals" },
    { path: "/journal", label: "Jurnal", id: "journal" },
    { path: "/community", label: "Comunitate", id: "community" },
    { path: "/achievements", label: "Realizări", id: "achievements" },
    { path: "/settings", label: "Setări", id: "settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

// Import useEffect at the top
import { useEffect } from "react";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", id: "dashboard" },
    { path: "/map", label: "Harta", id: "map" },
    { path: "/goals", label: "Obiective", id: "goals" },
    { path: "/journal", label: "Jurnal", id: "journal" },
    { path: "/community", label: "Comunitate", id: "community" },
    { path: "/achievements", label: "Realizări", id: "achievements" },
    { path: "/settings", label: "Setări", id: "settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  // Keyboard shortcut: Alt+M for menu focus (avoid global override, use effect)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'm') {
        focusFirstNav();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Mountain className="text-white h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-foreground">TranscendUp</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8" aria-label="Navigare principală">
            {navItems.map((item) => (
              <Link key={item.id} href={item.path} tabIndex={0} aria-current={isActive(item.path) ? 'page' : undefined}>
                <span className={`transition-colors pb-1 ${
                  isActive(item.path)
                    ? "text-primary font-medium border-b-2 border-primary"
                    : "text-foreground hover:text-primary"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button aria-label="Notificări" className="focus:outline-none">
                <Bell className="h-5 w-5 text-foreground hover:text-primary cursor-pointer transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
                <span className="sr-only">Notificări</span>
              </button>
              {/* TODO: notificări dropdown aici */}
            </div>
            
            <div className="flex items-center space-x-2">
              <img 
                src={getUserImage(user)}
                alt="User profile" 
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=default`; }}
              />
              {user?.level && (
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  Level {user.level}
                </Badge>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => {
                try {
                  await fetch("/api/logout", { credentials: "include" });
                  // For react-query: clear all queries (optional, if you use QueryClient)
                  if (window.location) {
                    window.location.href = "/";
                  }
                } catch (e) {
                  window.location.href = "/";
                }
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Delogare"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
