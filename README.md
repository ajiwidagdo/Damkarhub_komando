# DAMKARHUB Komando

Web admin dashboard untuk kepala dinas + koordinator Damkarhub. Desktop-first, data-heavy.

**Status:** scaffold + mock data (tanpa backend).

## Tech Stack

- Vue 3 (`<script setup>`) + Vite 7 + TypeScript (strict)
- Tailwind CSS 4 + Vue Router + Pinia
- shadcn-vue pattern (hand-made primitives) + TanStack Table v8
- ApexCharts (lazy-load per halaman) — tanpa wrapper library
- Design system reuse dari Fireman (`#dc2626`, dark mode default)
- **Fire Toggle**: signature theme toggle (api menyala/padam + asap), di-port dari Fireman

## Halaman

| Route | Halaman |
|---|---|
| `/login` | Login (mock — kredensial apa saja) |
| `/` | Overview (5 stat card + 2 chart) |
| `/reports` | Daftar laporan (filter + sort + pagination) |
| `/reports/:id` | Detail laporan |
| `/personnel` | Data personil |
| `/fleet` | Manajemen armada (CRUD + modal) |
| `/survey` | Survei kepuasan + leaderboard |
| `/settings` | Pengaturan |
| `*` | 404 |

## Dev

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check + build
```

Mock login: isi email + password apa saja → flag `komando_auth` di localStorage.

## Bundle

Total ~380 KB gzip (budget < 500 KB). Initial load ~75 KB gzip — ApexCharts (~287 KB) hanya di-load saat halaman chart dibuka.
