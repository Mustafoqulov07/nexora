"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Users, value: "128 000+", label: "активных пользователей" },
  { icon: ShieldCheck, value: "99.4%", label: "сделок без споров" },
  { icon: Zap, value: "3 мин", label: "средняя скорость доставки" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-glow" />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />

      <div className="container relative flex flex-col items-center py-20 text-center sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-success" />
          Более 19 000 товаров онлайн прямо сейчас
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          Игровые ценности{" "}
          <span className="gradient-text">без риска и переплат</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          Покупайте и продавайте аккаунты, игровую валюту, буст и цифровые
          товары через сделки с гарантией NEXORA — деньги хранятся на
          площадке до подтверждения получения.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 w-full max-w-xl"
        >
          <form
            role="search"
            className="glass gradient-border flex items-center gap-2 rounded-2xl p-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Например: аккаунт Dota 2 Immortal"
              aria-label="Поиск товаров"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button variant="brand" size="default" className="shrink-0">
              Найти
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="glass flex flex-col items-center gap-1.5 rounded-2xl px-4 py-5">
              <stat.icon className="mb-1 h-5 w-5 text-accent" />
              <span className="font-mono text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
