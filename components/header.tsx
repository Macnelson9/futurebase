import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { ThemeSwitcher } from "./theme-switcher";
import { ConnectWalletButton } from "./connect-wallet";
import { useScrollEffect } from "@/hooks/useScrollEffect";

export const Header = () => {
  const pathname = usePathname();
  const isScrolled = useScrollEffect(50);

  // Enable scroll blur effect on About, Contact, Dashboard, and Time Travel pages
  const enableScrollBlur = [
    "/about",
    "/contact",
    "/dashboard",
    "/time-travel",
  ].includes(pathname);
  return (
    <div
      className={`fixed z-50 pt-8 md:pt-14 top-0 left-0 w-full transition-all duration-300 ${
        enableScrollBlur && isScrolled
          ? "bg-background/80 backdrop-blur-md"
          : ""
      }`}
    >
      {enableScrollBlur && isScrolled && (
        <div className="absolute bottom-0 left-0 w-full h-px bg-primary/10 translate-y-1"></div>
      )}
      <header className="flex items-center justify-between container">
        <Link href="/">
          <Logo className="w-[105px] h-[60px] md:w-[120px]" />
        </Link>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-10">
          {["Home", "Time Travel", "About", "Contact", "Dashboard"].map(
            (item) => (
              <Link
                className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-300 transition-all ease-out hover:scale-105 hover:drop-shadow-lg relative group"
                href={
                  item === "Home"
                    ? "/"
                    : item === "Time Travel"
                    ? "/time-travel"
                    : `/${item.toLowerCase()}`
                }
                key={item}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-x-4 max-lg:hidden">
          <ConnectWalletButton />
          <ThemeSwitcher />
        </div>
        <MobileMenu />
      </header>
    </div>
  );
};
