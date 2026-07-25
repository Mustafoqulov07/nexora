import Link from "next/link";
import { Gamepad2, Send, MessageCircle } from "lucide-react";

const COLUMNS = [
  {
    title: "Площадка",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/categories", label: "Категории" },
      { href: "/about", label: "О нас" },
      { href: "/guarantees", label: "Гарантии сделок" },
    ],
  },
  {
    title: "Аккаунт",
    links: [
      { href: "/dashboard", label: "Личный кабинет" },
      { href: "/orders", label: "Мои заказы" },
      { href: "/favorites", label: "Избранное" },
      { href: "/settings", label: "Настройки" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { href: "/support", label: "Помощь" },
      { href: "/rules", label: "Правила площадки" },
      { href: "/privacy", label: "Политика конфиденциальности" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface/40">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
              <Gamepad2 className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              NEXORA
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Безопасная торговая площадка для геймеров: аккаунты, внутриигровая
            валюта, буст и цифровые товары от проверенных продавцов.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="#"
              aria-label="Telegram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Send className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Онлайн-чат поддержки"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-foreground">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} NEXORA. Все права защищены.</p>
          <p>Оплата картами МИР, СБП и криптовалютой</p>
        </div>
      </div>
    </footer>
  );
}
