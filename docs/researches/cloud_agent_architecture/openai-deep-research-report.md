# Облачная платформа выполнения AI‑агентов для разработки: ландшафт системы и архитектурные выводы для C4

## Категория продукта и ценность

**Ключевые выводы (коротко):**
- «Cloud agent execution platform» — это не просто чат‑помощник, а управляемая среда, где агент может **действовать**: клонировать репозитории, менять код, собирать/тестировать, создавать PR/MR и возвращать артефакты/диффы для ревью. На это прямо намекают продукты, ориентированные на «agent‑native» процесс: Factory описывает поток “ticket → контекст → решение → PR” с трассируемостью, а Copilot Workspace — цепочку «brainstorm/plan/build/test/run» в рамках task-centric опыта. citeturn2search0turn2search6turn2search14  
- **Конечная ценность для инженерных команд** — сократить цикл “идея/тикет → готовый change-set” и стоимость контекст‑свитчинга за счёт автоматизации рутины (первичная реализация, рефакторинг, миграции, triage) и стандартизации окружений/политик. Это отражается в концепции “Agents … inside short‑lived isolated environments” у Gitpod/Ona и в «Automations» у Cursor для задач техобслуживания/triage/ревью уязвимостей. citeturn1search6turn8search20  
- По сравнению с локальным запуском, облачная модель даёт **параллелизм и независимость от машины разработчика**: Cursor подчёркивает, что cloud agents можно запускать параллельно и они не требуют, чтобы локальная машина была подключена к интернету; кроме того, агент получает «свою виртуальную машину» для build/test. citeturn8search7  
- Важный класс «проблем, которые решает облако, а локальный агент — хуже»: изоляция выполнения (особенно для непроверенного кода/скриптов), единообразие окружения (devcontainer/образ), управляемость и аудит (enterprise‑требования). Признаки этого — наличие audit logs, SSO/SCIM, enterprise‑панелей у Cursor/Devin/Claude/Replit. citeturn5search13turn5search15turn6search3turn5search0  
- Типичный пользовательский путь в «облачных агентах» всё чаще оформляется как **human-in-the-loop**: агент предлагает план/изменения, пользователь редактирует и подтверждает, затем создаётся PR/MR. Copilot Workspace подчёркивает, что всё (план→код) редактируемо, и можно прогнать build/test в Codespaces‑окружении перед PR. citeturn2search14turn2search6  
- «Орг‑ориентированность» — обязательна: Devin прямо строит интеграции с инструментами команды (Slack, Linear, GitLab) и даёт enterprise‑контуры (SSO, аудит). citeturn8search0turn8search12turn8search18turn5search15  

**Ключевые дифференциаторы игроков (что архитектурно важно):**
- **Где исполняется агент и какой “compute envelope”**:  
  - Cursor Cloud Agents — изолированная облачная среда с доступом к собственной VM и артефактами, доступными через API. citeturn8search7turn8search3  
  - Copilot Workspace — compute‑окружение GitHub Codespaces (dev container на VM) для build/run/test внутри Workspace. citeturn2search14turn9search3  
  - Claude Code on the web — web‑сессии, которые можно запускать удалённо и «телепортировать» между вебом и терминалом; отдельно описан режим, когда веб‑интерфейс управляет запуском «на вашей машине вместо cloud infrastructure» (то есть поддерживаются оба подхода). citeturn1search0  
  - Replit Agent — агент поверх браузерного IDE/хостинга Replit, который «берёт действие на себя»: сетап проекта, создание приложения, проверка и исправления. citeturn0search2turn0search18  
- **Как результат “приземляется” в SDLC**: PR/MR как основной артефакт (Cursor Cloud Agents умеют авто‑создавать PR через GitHub App‑модель; Devin в GitLab‑интеграции ориентируется на MR и комментарии; Factory — на PR и трассируемость). citeturn8search17turn8search18turn2search0  
- **Модель триггеров (ручной vs событийный/по расписанию)**: Cursor прямо описывает Automations: запуск cloud agents в фоне по расписанию или событиям из GitHub/Slack и др. citeturn8search20  
- **Enterprise‑границы и доверие**: наличие SOC2/ISO‑программ, аудит‑логов, SSO/SCIM и «trust center» становится дифференциатором (пример: Factory перечисляет SOC 2/ISO 27001/ISO 42001 и интеграцию с мониторингом/аудитом; Cursor публикует доступ к compliance‑документам; Replit сообщает о SOC 2 Type II). citeturn6search2turn6search0turn5search12  
- **Стратегия модели/инфраструктуры**: Poolside позиционирует модели «designed to run within your infrastructure» (то есть смещение вычислений/данных внутрь периметра заказчика), что резко влияет на архитектуру (on‑prem/VPC‑deploy, ограничения по телеметрии, требования к orchestration). citeturn2search1  

**Типичный user journey (практический сценарий end‑to‑end):**
1) **Создание задачи**: из issue/тикета/свободного описания (Copilot Workspace стартует из issues/PRs/ideas; Devin — из интеграций с Linear/Jira/Slack; Factory может триггериться от назначений/упоминаний). citeturn2search6turn8search12turn2search0  
2) **Выбор репозитория/контекста + разрешений**: подключение GitHub/GitLab, выбор ветки/PR, настройка прав и токенов (у Cursor Cloud Agents API видны опции авто‑ветки/PR через GitHub App). citeturn8search17  
3) **Provision окружения**: devcontainer/VM/песочница, клонирование кода, установка зависимостей (аналогия с Codespaces: dev container на VM; у Cursor — собственная VM агента). citeturn9search3turn8search7  
4) **План → исполнение**: агент формирует план, применяет изменения, запускает тесты/сборку (Copilot Workspace подчёркивает “plan/build/test/run”; Cursor — build/test на VM). citeturn2search6turn8search7  
5) **Доставка результата**: PR/MR + отчёт + артефакты (логи, результаты тестов, собранные бинарники, ссылки на артефакты; Cursor Cloud Agents API отдельно оперирует «artifacts»). citeturn8search3turn2search14  
6) **Ревью и мердж**: человек редактирует, принимает/отклоняет, затем мерджит; Copilot Workspace подчёркивает полную редактируемость предложений перед PR. citeturn2search14  

**Архитектурные импликации:**
- Ваш продукт, по сути, должен быть **SaaS‑оркестратором вычислимых “рабочих капсул”** (sandbox/workspace) + системой доставки артефактов и интеграций SDLC (PR/MR, тикеты, чат‑ops). Это диктует отделение control plane (задачи/политики/тенанты) от data plane (исполнение/артефакты/логи). Подход «pool/silo/bridge» из SaaS Lens даёт словарь, как проектировать tenancy и изоляцию. citeturn3search3turn3search7  
- User journey «plan→код→PR» подразумевает, что контейнеры C4 должны явно поддерживать **дифф‑центричный review surface**, а не только чат. Поэтому вам нужны: хранилище артефактов, сервис PR/MR‑операций, и «activity timeline»/event stream на каждую сессию. citeturn2search14turn8search3  

**Известные trade-offs:**
- **Автономность vs контролируемость**: чем больше агент может делать сам, тем выше требования к политике разрешений, аудит‑логам и песочнице. Практика Copilot Workspace (“всё редактируемо”) иллюстрирует стратегию «human control by default». citeturn2search14turn2search6  
- **Скорость vs изоляция**: контейнеры быстрее/дешевле, microVM/VM дают сильнее изоляцию, но добавляют накладные расходы (см. раздел про sandboxing). citeturn3search4turn3search5turn3search2  

## Карта обязательной функциональности

**Ключевые выводы (коротко):**
- Must‑have ядро: **task intake → orchestrated execution → PR/MR + артефакты → review** (подтверждается ориентацией на PR/MR у Cursor/Devin/Factory и compute‑loop у Copilot Workspace). citeturn8search17turn8search18turn2search0turn2search14  
- Обязателен «workspace management»: изолированное окружение, базовые шаблоны (образ/devcontainer), доступ к файловой системе, возможность запускать команды/тесты, возврат артефактов (Cursor: VM агента + artifacts API; Codespaces: dev container на VM). citeturn8search7turn8search3turn9search3  
- Интеграции — не «nice to have», а часть UX: Devin делает акцент на инструменты команды (Slack, Linear, GitLab); Cursor Automations — на события GitHub/Slack и расписания; Factory — на триггеры из workflow (назначения/упоминания). citeturn8search0turn8search12turn8search18turn8search20turn2search0  
- Для организаций must‑have: **SSO (SAML/OIDC), provisioning (SCIM), audit logs, роли и политики**. Это видно в enterprise‑документации Devin (SSO OIDC/SAML), Replit (SAML SSO для Enterprise), Cursor (SSO/SCIM + audit log), Claude (экспорт audit logs). citeturn5search15turn5search0turn5search21turn5search1turn5search13turn6search3  
- Широкая автоматизация (background/scheduled/event‑driven агенты) становится стандартом для зрелых платформ: Cursor документирует Automations (по расписанию или событиям GitHub/Slack). citeturn8search20  

**Практическая функциональная декомпозиция (группы фич):**
- **Agent execution**: управление сессиями/задачами, прогресс, логирование шагов, останов/возобновление, параллельные запуски (Cursor подчёркивает параллелизм). citeturn8search7  
- **Workspace & runtime**: шаблоны окружений (образы/devcontainers), управление зависимостями, кэширование, артефакты и скачивание (Cursor artifacts + presigned URL). citeturn8search3  
- **SDLC delivery**: ветки, PR/MR, комментарии, статусы проверок (Devin GitLab умеет MR + ответы на комментарии; Cursor — опции авто‑PR через GitHub App). citeturn8search18turn8search17  
- **Collaboration**: shared задачи/сессии, review workflow, уведомления (Slack/Teams), «handoff» между вебом и локальным IDE/CLI (Claude Code on the web описывает “teleport” между вебом и терминалом). citeturn1search0turn8search0turn8search6  
- **Org governance**: пользователи/команды, роли, политики, бюджеты/лимиты, аудит и экспорт (audit logs у Cursor/Devin/Claude/GitHub). citeturn5search13turn2search3turn6search3turn5search14  
- **Billing & cost controls**: учёт токенов/минут/CPU‑часов, бюджеты по тэнанту, алерты. Связанный факт: LLM‑лимиты измеряются не только запросами, но и токенами (RPM/TPM и др. у OpenAI). citeturn4search1  
- **Analytics & observability**: метрики, трассировки, логи, customer analytics, экспорт событий (см. раздел Observability). citeturn4search3turn10search3  

**Архитектурные импликации:**
- Уже на C4 Container уровне стоит отделить «интеграционные адаптеры» (GitHub/GitLab/Linear/Slack) от ядра orchestration: разные протоколы (webhooks, OAuth apps, SAML/SCIM), разные SLA и разные модельки ошибок/ретраев. Пример: GitHub отдельно подчёркивает, что audit log можно стримить во внешнюю систему, а webhooks могут быть альтернативой для некоторых задач. citeturn10search3  
- «Орг‑контуры» (SSO/SCIM/audit) нельзя «прикрутить потом»: они влияют на модель данных (tenant context в каждой сущности), на политику доступов и на аудит‑ивенты почти всех контейнеров. citeturn5search21turn5search1turn5search13turn2search3  

**Известные trade-offs:**
- **Единый универсальный runtime vs специализированные runtimes** (языки/стэки): универсальность повышает стоимость и сложность, но снижает friction для команд.  
- **PR‑ориентированная доставка vs “patch artifact”**: PR даёт встроенный audit/review, но требует интеграции и прав в VCS; патч проще и безопаснее для некоторых клиентов, но хуже встраивается в SDLC. (Практика рынка — сильный перекос в PR/MR). citeturn8search18turn8search17turn2search0  

## Архитектурные паттерны

**Ключевые выводы (коротко):**
- Multi‑tenant SaaS для таких платформ обычно строится как комбинация **pool/silo/bridge** (общие сервисы + выделенные ресурсы для чувствительных клиентов). AWS SaaS Lens прямо описывает эти модели и их зависимость от требований регуляторики/стоимости/стратегии. citeturn3search3turn3search7turn3search19  
- В Kubernetes‑мире multi‑tenancy — это «слои изоляции» с trade‑offs по уровню доверия/стоимости: Kubernetes официально подчёркивает, что есть разные подходы и гибридные архитектуры. citeturn7search0  
- Sandboxing исполнения (ключевой технический выбор):  
  - **OCI‑контейнеры** (+ seccomp/AppArmor/Pod Security Standards) — минимум накладных расходов, но общий kernel повышает риск при запуске непроверенного кода. Kubernetes Pod Security Standards “Restricted” нацелены на строгие best practices ценой совместимости. citeturn7search1  
  - **gVisor** — «application kernel» в userspace для сильной изоляции между workload и host OS (не гипервизор). citeturn3search5turn3search1  
  - **microVM (Firecracker)** — лёгкие VM для усиленной изоляции при скорости/эффективности ближе к контейнерам; Firecracker создавался для Lambda/Fargate. citeturn3search4turn3search8turn3search0  
  - **Kata Containers** — «контейнеры, которые внутри VM», то есть container UX + аппаратная виртуализация как второй рубеж. citeturn3search2turn3search6turn3search14  
- Типовой поток данных “submission → execution → delivery” требует асинхронности и событий: задачи долгие, зависят от внешних API и часто требуют ретраев/восстановления. Для durable state и recovery хорошо подходят workflow‑движки: Temporal прямо заявляет, что workflow execution «полностью восстанавливаем» после сбоев и возобновляется с последнего состояния. citeturn4search6  
- Очереди/ивент‑стриминг — не деталь реализации, а способ масштабировать и изолировать нагрузки: KEDA позволяет «масштабировать любой контейнер в Kubernetes по числу событий», а AWS показывает референс‑паттерн «SQS queue → KEDA → HPA». citeturn7search3turn7search11  

**Референсная схема data flow (в терминах контейнеров C4):**
```text
User/UI/Integrations  ->  Task API (Control Plane)  ->  Queue/Workflow Engine  ->  Agent Orchestrator
                                                            |                        |
                                                            v                        v
                                                     Sandbox Provisioner  ->  Runtime (container/microVM/VM)
                                                            |                        |
                                                            v                        v
                                                     Artifact Store / Logs   ->   PR/MR Service (GitHub/GitLab)
                                                            |
                                                            v
                                                     Notifications / Analytics
```

**Как обычно sandbox’ят agent execution (и что это значит для платформы):**
- Если вы делаете ставку на **VM/microVM‑модель, похожую на Cursor Cloud Agents** (“own virtual machine”), то архитектурно у вас появляется отдельный слой “VM fleet manager” (или интеграция с провайдером), плюс контроль egress/ingress и снапшоты/образы. citeturn8search7turn3search4  
- Если вы делаете ставку на **контейнеры в orchestrator’е** (Kubernetes), то усиливайте sandboxing через gVisor/Kata/Pod Security Standards (Restricted) и network policies, понимая trade‑offs по совместимости и производительности. citeturn3search5turn3search2turn7search1  

**Интеграции с внешними сервисами (паттерны):**
- **Git provider интеграции**: модель “GitHub App” (как у Cursor Cloud Agents API, где PR открывается от имени приложения) лучше, чем пользовательские PAT, потому что проще управлять разрешениями и аудитом. citeturn8search17  
- **Compute provider**: Copilot Workspace показывает паттерн «встроить compute через Codespaces», где окружение — dev container на VM. Для вашей архитектуры это вариант «сторонний runtime provider» вместо собственного кластера. citeturn2search14turn9search3  
- **ChatOps**: Devin и Factory документируют Slack‑интеграции как часть рабочего процесса. Это означает вебхуки, интерактивные сообщения, idempotency, лимиты и очереди на processing. citeturn8search0turn8search6  

**Роль очередей, event streaming и async processing:**
- Очередь/стрим отделяет **внешний контур принятия задач** (SLA/UI) от непредсказуемого исполнения (build/test/LLM). KEDA и референс «SQS→KEDA→HPA» демонстрируют, как queue length превращается в autoscaling сигнал. citeturn7search11turn7search3  
- Durable workflow (Temporal‑подход) закрывает классы проблем: «сбой воркера», «частичный прогресс», «повторяемые шаги», «компенсации». Temporal описывает восстановление workflow state после сбоев и возобновление с последнего состояния. citeturn4search6  

**Архитектурные импликации:**
- На C4 Container уровне почти неизбежны отдельные контейнеры: **Orchestrator**, **Sandbox Provisioner**, **LLM Gateway**, **Integrations Hub**, **Artifact/Log storage**, **Policy/Audit** — иначе вы «сольёте» контуры надёжности и безопасности. Компромиссные multi‑tenant модели (pool/silo/bridge) лучше закладывать сразу, иначе enterprise‑клиенты «вытолкнут» вас в большой рефакторинг. citeturn3search3turn7search0  

**Известные trade-offs:**
- **Queue‑based async** снижает связность и повышает устойчивость, но усложняет отладку (нужны correlation IDs, трассировки, idempotency). citeturn4search3turn9search1  
- **Workflow engine (Temporal/аналоги)** даёт восстановление и оркестрацию, но добавляет операционную стоимость (кластер, хранение истории, миграции версий workflow). citeturn4search6  

## Проблемы масштабирования

**Ключевые выводы (коротко):**
- Горизонтальное масштабирование до тысяч одновременных agent sessions обычно ломается не на «API‑сервере», а в:  
  - provisioning окружений (создание VM/контейнера, pull образов, clone repo),  
  - внешних лимитах (LLM rate limits, Git hosting throttling),  
  - “noisy neighbor” эффекте в shared‑инфраструктуре. citeturn4search1turn9search6turn7search0  
- “Noisy neighbor” — известный анти‑паттерн мульти‑тенантных систем: активность одного тенанта ухудшает производительность других. Microsoft/Azure Architecture Center выделяет это как типовую проблему multitenant. citeturn9search6  
- Вертикально «дорогие» компоненты: LLM‑вызовы (токены/сек), сборка/тесты (CPU/RAM/IO), файловые операции (Git checkout, install deps), сетевые зависимости (скачивание пакетов). Практическое подтверждение важности токенов — у OpenAI rate limits измеряются в RPM/TPM и др., то есть «токены» — первичная масштабная единица, а не только запросы. citeturn4search1  
- Multi‑tenancy требует изоляции ресурсов и fairness: Kubernetes multi‑tenancy официально говорит о trade‑offs по уровню изоляции/стоимости; из практики это означает quotas/limits, network policies, pod security, отдельные ноды/кластера для важных клиентов. citeturn7search0turn7search1  
- Управление состоянием сессии: для долгих задач нужны контрольные точки/восстановление (durable execution). Temporal подчёркивает, что workflow execution «полностью recoverable» и возобновляется с последнего состояния. citeturn4search6  
- Стоимость при росте использования обычно растёт по трем осям: **LLM tokens**, **compute time (build/test)**, **storage (артефакты/логи)**. Платформе нужны бюджеты/лимиты и прогнозируемая модель биллинга (организационные лимиты + rate limiting). citeturn4search1turn4search4  

**Архитектурные импликации:**
- Горизонтальный scale почти всегда приводит к необходимости **двухуровневого планировщика**:  
  1) планировщик задач (очередь/воркфлоу) и  
  2) планировщик ресурсов runtime (K8s/VM fleet).  
  KEDA как слой событийного autoscaling показывает, как связывать очередь и HPA. citeturn7search3turn7search11  
- На уровне инфраструктуры для защиты от noisy neighbors нужны: tenant‑квоты, лимиты concurrency, приоритизация очередей, отдельные пулы воркеров/нод для enterprise‑клиентов и/или “silo” модель для особо чувствительных. citeturn9search6turn3search19  
- Для больших сессий вам потребуется стратегия “state externalization”: артефакты/логи/контекст в хранилищах, а исполнитель — как можно более «одноразовый». Durable workflows помогают «склеить» выполнение поверх одноразовых воркеров. citeturn4search6  

**Известные trade-offs:**
- **Stateful sessions (долго живущие воркеры с локальным диском)** упрощают работу с репо/кэшем, но усложняют восстановление и балансировку; **stateless workers + external state** лучше масштабируются, но требуют продуманной модели артефактов/кэшей.  
- **Единый shared cluster (pool)** дешевле, но сложнее доказать изоляцию; **silo per tenant** дороже, но проще для комплаенса и enterprise‑продаж. citeturn3search3turn7search0  

## Зависимости и риски внешних сервисов

**Ключевые выводы (коротко):**
- Критические внешние зависимости почти всегда включают:  
  - LLM провайдеры (Anthropic/OpenAI/Bedrock/и др.),  
  - Git hosting (GitHub/GitLab),  
  - Identity provider (Okta/Azure AD и др.),  
  - коммуникации (Slack/Teams),  
  - облачную инфраструктуру (compute/storage/network). Это следует из того, что продукты документируют SSO (Devin, Replit, Cursor), Git‑интеграции (Devin GitLab), Slack‑интеграции (Devin/Factory), и LLM‑ошибки/лимиты (Anthropic API errors, OpenAI rate limits). citeturn5search15turn5search0turn5search21turn8search18turn8search0turn8search6turn4search4turn4search1  
- Типовые failure modes:  
  - **Rate limiting (429)** от LLM: Anthropic прямо предупреждает о 429 из‑за «acceleration limits» при резком росте нагрузки; OpenAI описывает многомерные ограничения (RPM/TPM и др.). citeturn4search4turn4search1  
  - **Partial failures в streaming**: Anthropic отмечает, что при SSE‑стриминге ошибка может произойти «после 200 OK», то есть клиент должен уметь обрабатывать «успешный статус + поздний сбой». citeturn4search4  
  - **Outage LLM UI/продукта**: пример — публично освещённый инцидент, когда Claude.ai и Claude Code испытывали перебои (иллюстрация: даже если API «жив», продуктовый контур может падать, и наоборот). citeturn1news47  
  - Деградация Git provider (webhooks задерживаются, ограничения API), деградация Slack/Teams (уведомления/команды).  
- Для зрелых платформ нужно системно строить “resilience”: circuit breakers, retries/backoff/jitter, очереди и graceful degradation.

**Паттерны снижения риска (и источники):**
- **Circuit breaker**: Fowler описывает, что circuit breaker предотвращает каскадные отказы, “fail fast” при недоступном поставщике и защищает критические ресурсы. citeturn9search0  
- **Exponential backoff + jitter + лимит ретраев**: AWS Well‑Architected рекомендует контролировать ретраи, добавлять backoff и jitter, ограничивать число попыток. citeturn9search1  
- **Очередь как буфер** между приёмом задач и обращениями к провайдерам: сглаживает пики и помогает выдерживать лимиты (концептуально поддерживается тем, что KEDA часто масштабирует обработчики по queue size). citeturn7search3turn7search11  

**Архитектурные импликации:**
- Вам практически необходим **LLM Gateway контейнер**: единая точка для (а) tenant‑aware rate limiting, (б) агрегации метрик токенов, (в) ретраев с jitter, (г) circuit breakers, (д) маршрутизации на нескольких провайдеров/моделей. Наличие многомерных лимитов (TPM/RPM) делает «простые ретраи» опасными. citeturn4search1turn9search1turn9search0  
- Для внешних интеграций (Git, Slack, Jira/Linear) нужен **integration worker tier** с очередями и idempotency ключами: внешние вебхуки могут дублироваться/приходить не по порядку. (GitHub даже отмечает, что webhooks могут быть альтернативой audit log/API polling — это намёк на разные модели доставки событий). citeturn10search3  

**Известные trade-offs:**
- **Multi‑provider LLM стратегия** повышает отказоустойчивость и даёт рычаг цены, но усложняет совместимость (разный формат инструментов/function calling/стриминг, разные лимиты, разные политики данных). Anthropic отдельно подчёркивает особенности ошибок в streaming и 429, что усложняет унификацию. citeturn4search4  
- **Fail fast vs “задержим и попробуем позже”**: fail fast полезен для UX интерактива, но для фоновых задач лучше «очередь + повтор», иначе вы теряете задания. citeturn9search0turn4search6  

## Безопасность и комплаенс

**Ключевые выводы (коротко):**
- Типовая архитектура authN/authZ в enterprise‑контуре:  
  - **SAML SSO** (Replit Enterprise, Cursor Teams SSO, Devin SAML SSO),  
  - **OIDC** (Devin рекомендует OIDC и поддерживает Okta/Azure AD),  
  - **SCIM provisioning** (Cursor показывает ограничения role mapping; GitHub описывает SCIM для управления членством при SAML SSO). citeturn5search0turn5search21turn5search15turn5search3turn5search1turn5search6  
- Audit logging как first‑class: Cursor описывает аудит действий/событий безопасности; Devin имеет enterprise audit logs API; Claude даёт экспорт audit logs за 180 дней; GitHub предоставляет enterprise audit logs и даже стриминг во внешние системы. citeturn5search13turn2search3turn6search3turn5search14turn10search3  
- Песочница исполнения — главный security boundary. Реалистичные варианты: контейнеры + усиление политиками (Pod Security Standards Restricted), gVisor как userspace kernel sandbox, Kata (контейнеры внутри лёгких VM), Firecracker microVM. citeturn7search1turn3search5turn3search2turn3search4  
- Комплаенс‑фреймворки, которые реально «спрашивают закупки»: SOC 2 (Trust Services Criteria), плюс отраслевые (ISO 27001 и др.) и гос‑ориентированные рамки (например, NIST 800‑171 для CUI). AICPA фиксирует, что SOC 2 отчёт — про контроли по security/availability/processing integrity/confidentiality/privacy; Anthropic сообщает об оценке по NIST 800‑171 для Claude.ai/Claude Enterprise/Claude API; Factory и Cursor публикуют материалы по комплаенсу; Replit подтверждает SOC 2 Type II. citeturn10search0turn6search11turn6search2turn6search0turn5search12  
- Data residency/transfer: GDPR накладывает строгие требования на обработку персональных данных и применим к организациям, работающим с данными людей в ЕС; при этом на практике корпоративные пользователи часто требуют региональные контуры хранения/обработки и контроль трансграничных передач. citeturn10search2turn10search14  

**Ключевые security boundaries, которые стоит явно заложить в C4:**
- **Tenant boundary**: изоляция данных организаций (метаданные, логи, артефакты, ключи интеграций), плюс “noisy neighbor” защита. citeturn9search6turn3search3  
- **Execution boundary**: sandbox runtime должен минимизировать возможность выхода на host/соседей (gVisor/Kata/microVM) и ограничивать привилегии (Pod Security Standards Restricted). citeturn3search5turn3search2turn7search1  
- **Integration secrets boundary**: токены GitHub/GitLab, ключи облака, доступ к артефакт‑хранилищам — всё это должно быть в vault/секрет‑менеджере и выдаётся на сессию по принципу наименьших привилегий (практический намёк: Cursor Cloud Agents создаёт PR через GitHub App — это более управляемая модель, чем «пользовательские токены»). citeturn8search17  

**Архитектурные импликации:**
- Вам нужен «Security & Governance слой» как отдельный набор контейнеров/модулей:  
  - Identity (SSO/OIDC) + SCIM provisioning,  
  - Policy engine (RBAC/ABAC; запреты действий, allowlists команд, лимиты),  
  - Audit log pipeline + экспорт (в SIEM/лог‑хранилище). Практическая ориентация на аудит подтверждается и в GitHub (audit log streaming), и в Cursor/Devin/Claude (audit logs). citeturn10search3turn5search13turn2search3turn6search3  
- Модель sandboxing следует выбирать от уровня недоверия к коду: если ваш продукт рассчитан на запуск «чужого/непроверенного» кода, microVM/gVisor/Kata более оправданы, чем чистые контейнеры. Firecracker и Kata прямо позиционируются как усиление изоляции при сохранении эффективности. citeturn3search4turn3search2turn3search5  

**Известные trade-offs:**
- **RBAC vs ABAC**: RBAC проще для большинства команд, ABAC гибче для политик на уровне ресурса/контекста (repo sensitivity, branch protection, env class), но сложнее в реализации и отладке.  
- **Export audit logs (покупатель забирает себе)** повышает доверие, но создаёт расходы на объём данных и требования к неизменяемости/целостности. GitHub подчёркивает модель стриминга audit logs во внешние системы; Claude ограничивает содержимое audit logs и даёт отдельные механики data export. citeturn10search3turn6search3  

## Наблюдаемость и аналитика

**Ключевые выводы (коротко):**
- Для операционного здоровья платформе нужны все 3 сигнала: **traces, metrics, logs** (OpenTelemetry подчёркивает, что приложение должно эмитить эти сигналы, чтобы отвечать на “почему это происходит?”). citeturn4search3  
- Помимо системных метрик (CPU/RAM/IO), специфичные для агент‑платформы KPI:  
  - concurrency активных сессий, время provision окружения, время до «первого полезного результата»,  
  - успех/провал шагов (clone/build/test/PR),  
  - токены/мин и 429‑ошибки по LLM провайдерам,  
  - доля задач, завершённых PR/MR, и «cycle time» до мерджа. Основание: LLM‑лимиты измеряются токенами (OpenAI RPM/TPM и др.), Anthropic описывает 429 и особенности ошибок в streaming. citeturn4search1turn4search4  
- Customer‑facing аналитика для организаций почти всегда опирается на audit/event streams: GitHub предоставляет стриминг audit logs во внешние системы; Cursor/Devin/Claude делают аудит доступным в enterprise‑контуре. citeturn10search3turn5search13turn2search3turn6search3  

**Какие event streams/пайплайны обычно нужны:**
- **Operational event stream**: события оркестрации (TaskCreated/TaskStarted/StepFailed/PRCreated), события runtime (SandboxProvisioned, ArtifactUploaded), события интеграций (WebhookReceived, RateLimitHit).  
- **Security/audit stream**: аутентификация, изменения ролей/политик, доступ к секретам, действия админов. Cursor прямо описывает, что audit logs покрывают аутентификацию, membership changes, permission updates, API key actions и др. citeturn5search13  
- **Usage/billing stream**: счётчики токенов/compute/хранилища по tenant/project/session, лимиты и алерты. Ограничения по токенам как первичный ресурс видны в OpenAI rate limit модели. citeturn4search1  

**Архитектурные импликации:**
- На C4 Container уровне стоит предусмотреть отдельные контейнеры/сервисы:  
  - Telemetry Collector (OTel collector/аналог),  
  - Event Bus (Kafka/PubSub/Kinesis/… или очередь + CDC),  
  - Metrics Store/Tracing Backend/Log Store,  
  - Customer Analytics Store (витрины/агрегации per tenant). Требование «не смешивать tenant данные» тянет за собой tenant‑aware маршрутизацию и фильтрацию. citeturn4search3turn7search0  

**Известные trade-offs:**
- **Единый общий event stream** дешевле, но требует строгой tenant‑фильтрации и контроля доступа; **per‑tenant streams** проще для изоляции, но дороже и сложнее в эксплуатации.  
- **Высокая детализация логов** помогает расследованиям и комплаенсу, но увеличивает стоимость хранения и риск утечки чувствительных данных — особенно если логи содержат фрагменты кода/промптов (поэтому продукты иногда ограничивают содержимое audit logs; Claude отмечает ограничения на title/content в audit logs и отдельные data exports). citeturn6search3  

## Итог для C4

**Рекомендуемый список внешних акторов (C4 Context):**
- **Software Engineer (инициатор задачи)** — создаёт задачи, даёт уточнения, принимает изменения (UX как “task → plan → code → PR”). citeturn2search6turn2search14  
- **Reviewer/Tech Lead** — ревьюит PR/MR, даёт комментарии, принимает мердж (PR/MR как основной артефакт у Devin/Factory/Cursor). citeturn8search18turn2search0turn8search17  
- **Org Admin / IT Admin** — настраивает SSO/SCIM, роли, политики, интеграции. citeturn5search15turn5search21turn5search1  
- **Security/Compliance Officer** — требует audit logs/экспорт, проверяет соответствие SOC 2/ISO/NIST‑контролям. citeturn10search0turn6search2turn6search3turn6search11  
- **Finance/Procurement** — управляет бюджетами, лимитами, контрактами (на практике “token/usage economics” критичны из‑за LLM лимитов и стоимости). citeturn4search1  

**Рекомендуемый список верхнеуровневых контейнеров/сервисов (C4 Container):**
- **Web UI + Public API Gateway** (создание задач, просмотр прогресса, ревью диффов/артефактов).  
- **Identity & Access Service** (OIDC/SAML, session management, RBAC/ABAC) + **SCIM Provisioning Connector**. citeturn5search15turn5search0turn5search1turn5search6  
- **Tenant & Org Management** (пространства команд, проекты/репо, политики, бюджеты).  
- **Integrations Hub**: GitHub/GitLab (Apps/OAuth/webhooks), Jira/Linear, Slack/Teams (ChatOps). citeturn8search18turn8search12turn8search0turn8search6  
- **Task/Workflow Orchestrator** (очереди + durable workflows; Temporal‑класс) для долгих задач и восстановления. citeturn4search6  
- **Queue / Event Bus** (буферизация, backpressure, событийная масштабируемость; KEDA‑совместимый паттерн). citeturn7search3turn7search11  
- **Sandbox Provisioner + Runtime Fleet** (Kubernetes/VM/microVM; варианты: контейнеры+PSS, gVisor, Kata, Firecracker). citeturn7search1turn3search5turn3search2turn3search4  
- **LLM Gateway** (маршрутизация провайдеров, rate limiting по токенам, retries/backoff/jitter, circuit breaker, caching). citeturn4search1turn4search4turn9search0turn9search1  
- **Artifact Store + Session State Store** (объектное хранилище, метаданные, versioning, presigned downloads; аналогично подходу Cursor с artifacts). citeturn8search3  
- **Observability & Audit Pipeline** (OTel collector, log/trace/metrics backends, audit log store + экспорт/стриминг в SIEM). citeturn4search3turn10search3turn5search13turn6search3  
- **Notification Service** (Slack/Email/Webhooks) и **PR/MR Delivery Service** (создание PR/MR, комментарии, статусы). citeturn8search17turn8search18turn8search6  

**Топ архитектурных рисков, которые нужно закрыть в дизайне:**
- **Изоляция исполнения и предотвращение lateral movement** при запуске непроверенного кода/зависимостей: выбор sandboxing технологии (контейнеры vs gVisor vs Kata vs microVM) + политики безопасности (PSS Restricted). citeturn3search5turn3search2turn3search4turn7search1  
- **Noisy neighbor и справедливое распределение ресурсов** в многопользовательской среде (квоты, лимиты concurrency, приоритеты очередей, возможно “silo” для крупных клиентов). citeturn9search6turn3search19turn7search0  
- **Отказы и лимиты LLM провайдеров** (429, нестабильность streaming, частичные сбои): нужны LLM gateway, circuit breakers, backoff+jitter, буферизация/очереди. citeturn4search4turn4search1turn9search0turn9search1turn7search3  
- **Утечка секретов/данных через интеграции и логи**: строгий секрет‑менеджмент, least privilege, аудит действий, политика хранения логов/артефактов. Основание — enterprise‑упор на audit logs и экспорт у Cursor/Devin/Claude/GitHub. citeturn5search13turn2search3turn6search3turn10search3  
- **Восстановление длинных задач и консистентность состояния**: без durable workflow‑слоя вы получите “зависшие” сессии, двойные действия и потерю прогресса; Temporal‑класс движка закрывает recoverability. citeturn4search6turn7search3turn7search11