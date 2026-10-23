# GdeSanek Web

[![CI](https://github.com/saymonuel52-cpu/gdesanek-web/actions/workflows/ci.yml/badge.svg)](https://github.com/saymonuel52-cpu/gdesanek-web/actions/workflows/ci.yml)

PWA проектирования электрики жилых помещений по ГОСТ (Next.js 14 + TypeScript + Konva.js).

## Монорепо

- apps/web - Next.js приложение (планируется)
- packages/core - бизнес-логика: каталог и калькуляторы (готово)
- packages/canvas - графический редактор планов (планируется)
- packages/ui - общие компоненты (планируется)

## Ядро @gdesanek/core

Портировано из Android-проекта GdeSanek (commit 2cd04b3):

- Каталог: 25 позиций (розетки, выключатели, свет, щиты, слаботочка)
- Калькуляторы: powerOf, calculateCurrent, selectCable, selectBreaker
- Тесты: 11 unit-тестов vitest (данные сверены с PDF ЭОМ лист 2.1)

## Разработка

    pnpm install
    pnpm --filter @gdesanek/core test

## Roadmap

- [x] Phase 0: монорепо Turborepo
- [x] Phase 1: @gdesanek/core + 11 тестов
- [x] CI: GitHub Actions на каждый пуш
- [ ] Phase 2: packages/canvas (Konva.js редактор планов)
- [ ] Phase 3: apps/web (Next.js)
- [ ] Phase 4: PDF-экспорт 9 листов (jsPDF + svg2pdf)
- [ ] Phase 5: Supabase (облако, шаринг)
- [ ] Phase 6: PWA офлайн

Лицензия: MIT