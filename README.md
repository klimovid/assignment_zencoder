# assignment_zencoder



Ка кделалось задание
1. ОБсудили с Клодом как мы понимаем задачу/что требуется/ какие критерии
2. Обсудили как мы ее будем делать в соответствии с предложенными подходами:
3. рисерч подобных систем
3.1 сгенерирован промпт для рисерча архитектуры и продукта
3.2 рисерч архитектуры через gemini
3.3 рисерч архитектуры через openai
3.4 рисерч архитектуры через claude + summary

4. Генерация c4 system context

5. Промпт для рисерча дашборда
5.1 рисерч дашборда через gemini
5.2 рисерч дашборда через openai
5.3 рисерч дашборда через claude + summary

6. Генерация c4 container diagram вся платформа, с учётом результатов research с акцентом на dashboard
7. Cоздания prd для дашборда на основе research + архитектуры
8. Генерация Component diagram — zoom в dashboard container
9. Генерация интерфейса через Figma Make на основе prd
10. проверка всех документов на consistency
11. генерация Technical implementation spec на основе prd
12. расширение Technical implementation о тестировании ( секция 11 )
13. ~~Создание плана имплементации~~ ✅ → [`docs/specs/dashboard-implementation-plan.md`](docs/specs/dashboard-implementation-plan.md)
14. Имплементация
15. Создание mock-сервера
16. Деплой на vercel dashboard и mock-сервера
17. Конец


Approaches
0. deep проработка врхитектуры через C4 модель. от этого шага сильно зависит успех one-shot промптинга
1. использовать клод для генерации промптов
2. Human in the loop / validation
3. use fpf skill for complex tasks of different types
4. use planing mode as step 0 for complex tasks
5. use proper skills and mcp's
6. use figma for ui generation
7. spec-driven development
8. ask claude to recheck itself
