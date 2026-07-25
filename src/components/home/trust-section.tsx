import { ShieldCheck, Wallet, PackageCheck, Star } from "lucide-react";

const STEPS = [
  {
    icon: Wallet,
    title: "Оплачиваете через NEXORA",
    text: "Деньги списываются с карты или СБП и хранятся на защищённом счёте площадки — продавец их пока не получает.",
  },
  {
    icon: PackageCheck,
    title: "Продавец передаёт товар",
    text: "Аккаунт, ключ или услуга поступают вам в личный кабинет или чат сделки. У продавца есть строгий срок на выполнение.",
  },
  {
    icon: ShieldCheck,
    title: "Вы подтверждаете получение",
    text: "Проверяете товар и подтверждаете сделку. Если что-то не так — подключается служба поддержки и разбирает спор.",
  },
  {
    icon: Star,
    title: "Оплата поступает продавцу",
    text: "Только после вашего подтверждения деньги переводятся продавцу. Вы оставляете отзыв, который видят другие покупатели.",
  },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container">
        <div className="mb-12 max-w-xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Как проходит сделка с гарантией
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Каждая покупка на NEXORA защищена: деньги переходят продавцу
            только после того, как вы подтвердите получение товара.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <div key={step.title} className="glass relative flex flex-col gap-3 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand/15">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-sm font-semibold">{step.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
