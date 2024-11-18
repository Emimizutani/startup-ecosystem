import { useI18n } from "@/lib/i18n";
import { useUser } from "@/hooks/use-user";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, User } from "lucide-react";

export default function Header() {
  const { t, language, setLanguage } = useI18n();
  const { user, logout } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold text-primary cursor-pointer">
            StartupEcosystem
          </span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-4">
            <NavigationMenuItem>
              <Link href="/matching">
                <NavigationMenuLink className="cursor-pointer">
                  {t("common.matching")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/events">
                <NavigationMenuLink className="cursor-pointer">
                  {t("common.events")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/support">
                <NavigationMenuLink className="cursor-pointer">
                  {t("common.support")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English {language === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ja")}>
                日本語 {language === "ja" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/profile">{t("common.profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  {t("common.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/profile">{t("common.login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
