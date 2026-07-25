# NEXORA — маркетплейс игровых ценностей

Next.js 15 + React 19 + TypeScript + Tailwind + Prisma + PostgreSQL + Auth.js asosidagi loyiha.

## Lokalda ishga tushirish

```bash
npm install
cp .env.example .env   # qiymatlarni to'ldiring
npx prisma migrate dev
npm run dev
```

## GitHub'ga yuklash

```bash
git init
git add .
git commit -m "NEXORA: initial project"
git branch -M main
git remote add origin https://github.com/USERNAME/nexora.git
git push -u origin main
```

> `.env` fayli `.gitignore` ichida — u hech qachon reponi qo'shilmaydi. Faqat `.env.example` yuklanadi, bu xavfsiz.

## Render'da bepul deploy qilish

Bu repoda `render.yaml` fayli bor — Render uni avtomatik o'qib, web-service va bepul PostgreSQL bazasini birga yaratadi.

1. **render.com** ga kiring → **New +** → **Blueprint**.
2. GitHub repongizni ulang va tanlang (`nexora`).
3. Render `render.yaml`ni topadi va quyidagilarni taklif qiladi:
   - `nexora` — web service (bepul reja)
   - `nexora-db` — PostgreSQL (bepul reja)
4. **Apply** tugmasini bosing.
5. Deploy tugagach, Environment sahifasida quyidagilarni qo'lda to'ldiring (`sync: false` bo'lgani uchun avtomatik yaratilmaydi):
   - `AUTH_URL` va `NEXTAUTH_URL` → Render sizga bergan domen, masalan `https://nexora.onrender.com`
   - `PAYMENT_PROVIDER_URL`, `PAYMENT_SHOP_ID`, `PAYMENT_SECRET_KEY` → to'lov provayderingizdan
6. **Manual Deploy → Deploy latest commit** bosing (yangi env o'zgaruvchilar bilan qayta build bo'lishi uchun).

### Agar Blueprint'siz, qo'lda sozlamoqchi bo'lsangiz

1. **New +** → **PostgreSQL** → bepul reja → yarating, `Internal Database URL`ni nusxalang.
2. **New +** → **Web Service** → reponi ulang.
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start Command: `npm run start`
3. Environment bo'limida `.env.example` dagi barcha o'zgaruvchilarni qo'shing, `DATABASE_URL` ga yuqoridagi bazani bering.
4. Deploy.

### Muhim eslatma (Render Free reja)

Bepul reja 15 daqiqa harakatsizlikdan keyin serverni "uxlatib qo'yadi" — birinchi so'rov 30–50 soniya kutishi mumkin. Bu ishlab chiqarish (production) uchun emas, demo/portfolio uchun mos.

To'lov webhook manzili: `https://sizning-domen.onrender.com/api/webhooks/payment` — buni to'lov provayderi kabinetida ko'rsating.
