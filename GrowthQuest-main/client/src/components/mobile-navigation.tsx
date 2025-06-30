import { Link, useLocation } from "wouter";
import { Home, Map, Target, BookOpen, Users, TrendingUp, Award, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Map", href: "/map", icon: Map },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Community", href: "/community", icon: Users },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {navigation.slice(0, 4).map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                isActive
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Second row for remaining navigation items */}
      <div className="grid grid-cols-4 gap-1 px-2 pb-2">
        {navigation.slice(4).map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                isActive
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}