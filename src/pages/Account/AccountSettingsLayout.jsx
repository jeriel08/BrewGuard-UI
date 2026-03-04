import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Account",
    href: "/settings/account",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: <Lock className="mr-2 h-4 w-4" />,
  },
];

export default function AccountSettingsLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6 px-4 py-0 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0">
        <aside className="lg:w-1/5 lg:border-r-2 lg:border-border lg:pr-6">
          <nav
            className={cn(
              "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            )}
          >
            {sidebarNavItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="secondary"
                  className={cn(
                    location.pathname === item.href
                      ? "bg-secondary hover:underline"
                      : "bg-transparent hover:bg-secondary hover:underline",
                    "justify-start w-full cursor-pointer",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl lg:pl-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
