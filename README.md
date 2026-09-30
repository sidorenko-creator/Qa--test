# QA Playwright Automation

Автотесты для веб-магазина ([aqa-app.vercel.app](https://aqa-app.vercel.app)) и REST API
([jsonplaceholder](https://jsonplaceholder.typicode.com)) на **Playwright + JavaScript (ES Modules)**.

**Стек:** Playwright Test · JavaScript (ESM) · Faker.js · dotenv · GitHub Actions · Page Object Model

---

## 1. Быстрый старт

```bash
npm ci                          # установить зависимости
npx playwright install chromium # установить браузер (или без chromium — все браузеры)
npm test                        # запустить тесты
npm run report                  # открыть HTML-отчёт
```

`.env` нужен только если меняете адреса или параметры запуска (см. `.env.example`).

---

## 2. Структура проекта — что где лежит

```text
.
├── playwright.config.js     «Пульт управления»: проекты, таймауты, ретраи, воркеры, отчёты, окружение браузера
├── global-teardown.js       Уборка после всех тестов (удаляет сохранённую сессию)
│
├── pages/                   Page Object — по одному классу на страницу сайта
│   ├── RegisterPage.js      регистрация
│   ├── LoginPage.js         вход
│   ├── CatalogPage.js       каталог, добавление в корзину
│   ├── CartPage.js          корзина, проверка суммы
│   ├── CheckoutPage.js      оплата
│   └── MyAccountPage.js     личный кабинет, выход
│
├── fixtures/index.js        Свой `test`: сразу отдаёт page object'ы, карту и сессию в аргументах теста
├── data/
│   ├── testdata.js          Генераторы данных (пользователь, карта) и payload для API
│   └── products.js          ID товаров (вместо «магических» чисел 5 и 6)
├── utils/
│   ├── price.js             Разбор цены из текста в число ("$1,299.00" → 1299)
│   ├── session.js, paths.js Работа с сохранённой сессией
│   └── hooks.js             Общий afterEach: итог теста + URL при падении
│
└── tests/
    ├── setup/auth.setup.js  ШАГ 0: регистрация → вход → сохранить сессию (один раз на весь запуск)
    ├── ui/
    │   ├── registration.spec.js        регистрация → вход → выход (стартует БЕЗ входа)
    │   ├── checkout.spec.js            корзина → оплата → кабинет   (стартует уже залогиненным)
    │   └── browser-environment.spec.js проверка настроек окружения браузера
    ├── api/posts.spec.js    GET / POST / PATCH / DELETE
    └── unit/price.spec.js   проверка разбора цены (без браузера)
```

---

## 3. Как работает один запуск

```text
                      ┌────────────────────┐
                      │   проект  setup    │  регистрирует пользователя, входит,
                      │ (выполняется 1 раз)│  сохраняет playwright/.auth/state.json
                      └─────────┬──────────┘
                                │ от него зависят все UI-проекты
        ┌───────────┬───────────┼───────────┬───────────────┐
    chromium     firefox      webkit    mobile-chrome   mobile-safari
   (все тесты)   (@smoke)     (@smoke)     (@smoke)        (@smoke)
        └─ каждый стартует УЖЕ залогиненным (storageState) ─┘

    api-tests и unit — независимые, браузер не нужен

                      ┌────────────────────┐
                      │  globalTeardown    │  удаляет playwright/.auth
                      └────────────────────┘
```

**Зачем setup и storageState?** Регистрация и вход занимают секунды и нужны почти каждому тесту.
Вместо повторения в каждом тесте мы делаем это один раз, сохраняем состояние браузера
(cookies + localStorage) в файл, а каждый тест открывает браузер уже с этим файлом.

**Зачем Page Object?** Локаторы (`#login-email`) и действия («войти») живут в одном месте.
Если сайт изменит кнопку — правим один файл, а не 20 тестов.

**Зачем fixtures?** Чтобы не писать `new CartPage(page)` в каждом тесте. Тест просто просит
`{ cartPage }` в аргументах, а Playwright создаёт объект сам.

---

## 4. Почему тестов «много»: 13 тестов, а не 41

Тестов в проекте **13** (не считая setup), а строка `Total: 41 tests` раньше появлялась из-за умножения
на браузеры: один и тот же тест запускается в каждом проекте.

| Набор | Тестов | Где запускается |
| --- | --- | --- |
| UI: регистрация, checkout, 5 проверок окружения | 7 | `chromium` (все 7) |
| Те же `@smoke`-тесты (регистрация, checkout) | 2 | `firefox`, `webkit`, `mobile-chrome`, `mobile-safari` |
| API | 5 | `api-tests` |
| Unit (разбор цены) | 2 | `unit` |
| Setup (вход, не считается тестом) | 1 | `setup` |

- `npm test` = 1 setup + 7 UI + 5 API + 2 unit = **15 запусков**
- `npm run test:all` = **23 запуска** (плюс smoke в 4 других браузерах)

Кросс-браузерность нужна, чтобы убедиться «сайт вообще работает в Firefox/Safari/на телефоне»,
для этого хватает smoke. Полный набор гоняется в одном браузере.

---

## 5. Команды

| Команда | Что делает |
| --- | --- |
| `npm test` | Chromium + API + unit (то же, что на CI) |
| `npm run test:all` | все проекты: 3 десктопных браузера + 2 мобильных + API + unit |
| `npm run test:e2e` | UI-тесты в Chromium |
| `npm run test:api` | только API |
| `npm run test:unit` | только unit |
| `npm run test:smoke` | только тесты с тегом `@smoke` |
| `npm run test:firefox` / `test:webkit` / `test:mobile` | отдельный браузер / мобильные |
| `npm run test:headed` | Chromium с видимым окном |
| `npm run test:ui` | режим Playwright UI |
| `npm run test:debug` | отладчик (Inspector) |
| `npm run test:list` | показать список тестов без запуска |
| `npm run report` | открыть последний HTML-отчёт |

Теги: `@smoke`, `@e2e`, `@checkout`, `@auth`, `@api`, `@env`, `@unit`.
Пример: `npx playwright test --grep @auth`.

### Параметры запуска (`.env` или переменные окружения)

| Переменная | Что делает |
| --- | --- |
| `HEADED=true` | показывать окно браузера |
| `SLOW_MO=300` | замедлить каждое действие на 300 мс (удобно смотреть тест глазами) |
| `WORKERS=4` | число параллельных воркеров |
| `KEEP_AUTH=true` | не удалять сессию после прогона (для `--no-deps`) |

---

## 6. Настройки выполнения (playwright.config.js)

| Настройка | Значение | Смысл |
| --- | --- | --- |
| `timeout` | 30 с | один тест целиком (с хуками) |
| `expect.timeout` | 5 с | одна проверка `expect()` с автоповтором |
| `actionTimeout` / `navigationTimeout` | 10 с / 20 с | один клик или ввод / один переход по странице |
| `globalTimeout` | 15 мин на CI | весь прогон |
| `retries` | CI: 2, локально: 0 | упавший тест повторяется только на CI |
| `workers` | CI: 2, локально: авто | сколько тестов идёт одновременно |
| `fullyParallel` | true | тесты внутри файла тоже параллельны |
| `maxFailures` | CI: 10 | остановиться, если сломалось всё подряд |
| на уровне блока | `test.describe.configure(...)` | checkout: 60 с; API: 15 с и 2 повтора |
| на уровне шага | `test.step(..., { timeout })` | шаг оплаты: 15 с |

**Отчёты:** `list` (консоль) · `html` (`playwright-report/`) · `json` (локально, `reports/results.json`) ·
`junit` и `github` (на CI). При падении сохраняются trace, скриншот и видео.
В отчёте каждый тест разбит на **шаги** с русскими названиями и вложениями
(выбранные товары, тело ответа API, email регистрации, последние 4 цифры карты).

---

## 7. Окружение браузера

Задаётся один раз в `playwright.config.js` для всех UI-проектов и проверяется в
`tests/ui/browser-environment.spec.js`:

`locale: en-US` · `timezoneId: Europe/Kiev` · `geolocation` Киев · `permissions: ['geolocation']` ·
`colorScheme: light` · `launchOptions.slowMo`.
Любую настройку можно переопределить для группы тестов: `test.use({ colorScheme: 'dark' })`.

---

## 8. Запуск из VS Code

Поставьте расширение **Playwright Test for VS Code** (`ms-playwright.playwright`), откройте папку проекта
(ту, где `package.json`) и используйте значок **Testing** слева. Выберите проект `chromium`
и оставьте отмеченным `setup`: он запускается перед UI-тестами автоматически.
Для фонового запуска держите **Show Browsers** выключенным.

---

## 9. Как добавить новый тест

1. Нужна новая страница, то создайте класс в `pages/` и подключите его в `fixtures/index.js`.
2. Создайте `tests/ui/<название>.spec.js`, импортируйте `test, expect` из `fixtures/index.js`.
3. Разбейте сценарий на `test.step('Что делаем', ...)`.
4. Если тест должен попасть в быструю проверку во всех браузерах, добавьте тег `{ tag: '@smoke' }`.
5. Тесту нужен пользователь без входа, то добавьте `test.use({ storageState: { cookies: [], origins: [] } })`.

---
