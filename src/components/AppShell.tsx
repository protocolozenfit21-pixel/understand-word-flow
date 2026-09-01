import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Compass, Home, Moon, Sun, Target, User, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/biblia", label: "Bíblia", icon: BookOpen },
  { to: "/desafios", label: "Desafios", icon: Target },
  { to: "/jornada", label: "Jornada", icon: Compass },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const bare = pathname.startsWith("/onboarding");

  if (bare) return <div className="min-h-screen bg-background">{children}</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Elohim</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Link
              to="/buscar"
              search={{ q: "" }}
              aria-label="Pesquisar"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Search className="size-[18px]" />
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label="Alternar modo claro e escuro"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-16">{children}</main>

      <nav className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 md:hidden">
        <div className="rounded-[2rem] border border-border/60 bg-background/60 shadow-[var(--shadow-lift)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/55">
          <div className="grid grid-cols-5">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className={cn(
                  "group flex flex-col items-center gap-1 rounded-[2rem] py-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
                  "hover:bg-secondary/60 data-[status=active]:text-primary",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="text-balance-tight text-2xl font-semibold md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
