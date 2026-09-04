import i18n from "i18next";
import {
    initReactI18next,
} from "react-i18next";

const savedLanguage =
    localStorage.getItem("i18nextLng");

const language =
    savedLanguage ??
    (navigator.language.startsWith("ru")
        ? "ru"
        : "en");

const resources = {
    en: {
        translation: {
            scanner: "Scanner",
            csrdpscanner: "CSRDP / SCANNER",
            csrdpanalysis: "CSRDP / ANALYSIS",
            workspace: "Workspace",
            system: "System",
            analytics: "Analytics",

            scanHistory: "Scan History",
            findings1: "Findings",
            findingsappear: "Findings will appear here.",

            api: "API",
            online: "Online",

            infrastructure:
                "Infrastructure",

            newScan: "New Scan",

            newScanDescription:
                "Scan an IP address, hostname, or network range.",

            target: "Target",

            targetHelp:
                "IPv4, hostname, or CIDR network",

            startScan: "Start Scan",

            scanning: "Scanning...",

            scanProgress: "Scan Progress",

            targets: "targets",
            duration1: "Duration",
            currenttarget: "Current target:",
            etimatedtime: "Estimated time remaining:",
            scantime: "Scan time:",

            hosts: "Hosts",
            host: "Host",
            hostsUp: "Hosts Up",
            openPorts: "Open Ports",

            services: "Services",

            servicesDescription:
                "Network services discovered during the scan.",

            port: "Port",
            protocol: "Protocol",
            state: "State",
            service: "Service",
            product: "Product",
            version: "Version",

            noOpenPorts:
                "No open services were discovered.",

            securityFindings:
                "Security Findings",

            securityDiscovered: "Security findings discovered during your scans.",

            securityFindingsDescription: "Potential security risks identified during analysis.",

            findingsScanning: "Security analysis is still in progress. Findings will appear here when available.",

            noFindings:
                "No security findings were detected.",

            previousscan: "Previous server scans",

            evidence: "Evidence",

            confidence: "Confidence",

            status: {
                queued: "Queued",
                running: "Running",
                scanning: "Scanning",
                inspecting: "Inspecting",
                fingerprinting:
                    "Fingerprinting",
                risk: "Analyzing risk",
                completed: "Completed",
                failed: "Failed",
            },

            severity: {
                info: "Info",
                low: "Low",
                medium: "Medium",
                high: "High",
                critical: "Critical",
            },

            portState: {
                open: "Open",
                closed: "Closed",
                filtered: "Filtered",
                "open|filtered":
                    "Open / Filtered",
                "closed|filtered":
                    "Closed / Filtered",
                unknown: "Unknown",
            },

            hostState: {
                up: "Up",
                down: "Down",
                unknown: "Unknown"
            },

            targetStatus: {
                queued: "Queued",
                running: "Running",
                completed: "Completed",
                failed: "Failed"
            },

            duration: {
                seconds: "{{count}} second",
                seconds_other: "{{count}} seconds",
                minutes: "{{count}} minute",
                minutes_other: "{{count}} minutes"
            },

            findings: {
                exposedTelnet: {
                    title: "Telnet service exposed",
                    description: "A Telnet service is publicly accessible. Telnet transmits authentication and session data without modern transport encryption.",
                    evidence: {
                        portRunningService: "Port {{port}} is running {{service}}."
                    }
                },

                exposedRedis: {
                    title: "Redis service exposed",
                    description: "A Redis service is publicly accessible. Redis should generally not be directly exposed to untrusted networks unless access is properly restricted and secured.",
                    evidence: {
                        portRunningService: "Port {{port}} is running {{service}}.",
                        authenticationNotDetected: "Authentication required: {{required}}."
                    }
                },

                exposedMemcached: {
                    title: "Memcached service exposed",
                    description: "A Memcached service is publicly accessible. Memcached should generally not be directly exposed to untrusted networks.",
                    evidence: {
                        portRunningService: "Port {{port}} is running {{service}}.",
                        authenticationRequired: "Authentication required: {{required}}."
                    }
                },

                exposedMysql: {
                    title: "MySQL exposed without authentication",
                    description: "A MySQL service is publicly accessible without authentication.",
                    evidence: {
                        portRunningService: "Port {{port}} is running {{service}}.",
                        authenticationNotDetected: "MySQL authentication was not detected."
                    }
                },

                exposedPostgresql: {
                    title: "PostgreSQL service exposed",
                    description: "A PostgreSQL database service is publicly accessible. Database services should generally not be directly exposed to untrusted networks.",
                    evidence: {
                        portRunningService: "Port {{port}} is running {{service}}.",
                        authenticationNotDetected: "Authentication required: {{required}}."
                    }
                },

                common: {
                    detectedProduct: "Detected product: {{product}}",
                    detectedVersion: "Detected version: {{version}}"
                },

                missingSecurityHeaders: {
                    title: "Missing security headers",
                    description: "The HTTP service is missing one or more recommended security headers.",
                    evidence: {
                        missing: "Missing: {{headers}}"
                    }
                },

                weakTls: {
                    title: "Weak TLS protocol",
                    description: "The service supports {{protocol}}, which should no longer be used.",
                    evidence: {
                        protocol: "Protocol: {{protocol}}"
                    }
                },

                outdatedSoftware: {
                    title: "Outdated software detected",
                    description: "The detected software version may be outdated and could contain known security vulnerabilities or lack important security fixes.",
                    evidence: {
                        detectedProduct: "Detected product: {{product}}",
                        detectedVersion: "Detected version: {{version}}",
                        recommendedVersion: "Recommended version: {{version}}"
                    }
                }
            },

            dateTime: {
                selectDateTime: "Select date and time",
                year: "Year",
                time: "Time",
                clear: "Clear",

                months: {
                    january: "January",
                    february: "February",
                    march: "March",
                    april: "April",
                    may: "May",
                    june: "June",
                    july: "July",
                    august: "August",
                    september: "September",
                    october: "October",
                    november: "November",
                    december: "December",
                },

                weekdays: {
                    sun: "Sun",
                    mon: "Mon",
                    tue: "Tue",
                    wed: "Wed",
                    thu: "Thu",
                    fri: "Fri",
                    sat: "Sat",
                },
            },

            Searchip: "Search by IP or hostname...",
            statusLabel: "Status",
            created: "Created",
            started: "Started",
            detected: "Detected",
            scan: "Scan",
            viewScan: "View scan",
            viewFinding: "View finding",
            targetId: "Target ID",
            hostState1: "Host state",
            ports: "Ports",
            portsDiscovered: "ports discovered: ",
            unknownTarget: "Unknown target",
            scanTargetsDescription: "Targets included in this scan. Select a target to inspect its discovered services.",
            targetCount_one: "{{count}} target",
            targetCount_other: "{{count}} targets",
            failed: "Failed",
            completed: "Completed",
            scanhistory: "Scan history will appear here.",
            Backhistory: "← Back to scan history",
            Backfindings: "← Back to findings",
            findingdetails: "Finding details",
            Scandetails: "Scan details",
            securityissues: "Security issues discovered across your infrastructure scans.",

            analytics: "Analytics",
            analyticsDescription: "Website traffic and registration analytics",

            viewer: "Viewer",
            admin: "Admin",

            filters: "Filters",
            analyticsFiltersDescription: "Filter analytics records by dataset, source, traffic source, IP address, URL, or date range.",

            clickevents: "Click Events",
            linkclicks: "Link Clicks",

            event: "Event",
            source: "Source",
            trafficsource: "Traffic source",
            ipaddress: "IP address",
            targeturl: "Target URL",
            date: "Date",

            applyFilters: "Apply filters",
            reset: "Reset",
            exportCsv: "Export CSV",

            registrations: "Registrations",
            filteredResults: "Filtered Results",

            dataManagement: "Data Management",
            analyticsDeleteDescription: "Delete analytics records using filters, the latest records, or a date range.",

            delete: "Delete",
            deleteFiltered: "Delete filtered records",
            deleteLast: "Delete latest records",
            deleteDateRange: "Delete by date range",

            processing: "Processing...",
            deleting: "Deleting...",
            confirmDeletion: "Confirm deletion",
            confirmDeletionDescription: "This action will permanently delete {{count}} record(s). Are you sure you want to continue?",
            cancel: "Cancel",
            confirmDelete: "Confirm delete",

            results: "Results",
            noResults: "No results found.",

            eventTariffVps1m: "VPS tariff — 1 month",
            eventTariffVds1mFin: "VDS tariff — 1 month",
            eventLoginClick: "Login button click",
            eventRegisterClick: "Register button click",
            fromDate: "From date",
            toDate: "To date",

        },
    },

    ru: {
        translation: {
            scanner: "Сканер",
            csrdpscanner: "CSRDP / Сканер",
            csrdpanalysis: "CSRDP / Анализ",
            workspace: "Рабочая область",
            system: "Система",
            analytics: "Аналитика",

            scanHistory: "История сканирования",
            findings1: "Результаты/Уязвимости",
            findingsappear: "Результаты/Уязвимости будут опубликованы здесь.",

            api: "API",
            online: "Онлайн",

            infrastructure:
                "Сканер инфраструктуры",

            newScan: "Новое сканирование",

            newScanDescription:
                "Проверьте IP-адрес, домен или сетевой диапазон.",

            target: "Таргет",

            targetHelp:
                "IPv4, hostname или CIDR-сеть",

            startScan: "Начать сканирование",

            scanning: "Сканирование...",

            scanProgress:
                "Прогресс сканирования",

            targets: "Целей",
            duration1: "Продолжительность",
            currenttarget: "Текущая цель:",
            etimatedtime: "Примерно осталось:",
            scantime: "Время сканирования:",

            hosts: "Хосты",
            host: "Хост",
            hostsUp: "Активные хосты",
            openPorts: "Открытые порты",

            services: "Сервисы",

            servicesDescription:
                "Сетевые сервисы, обнаруженные во время сканирования.",

            port: "Порт",
            protocol: "Протокол",
            state: "Состояние",
            service: "Сервис",
            product: "Продукт",
            version: "Версия",

            noOpenPorts:
                "Открытых сервисов не обнаружено.",

            securityFindings:
                "Результаты анализа",

            securityDiscovered: "Проблемы безопасности, выявленные в ходе сканирования.",

            securityFindingsDescription:
                "Потенциальные проблемы безопасности, обнаруженные во время анализа.",

            findingsScanning: "Анализ безопасности все еще продолжается. Результаты будут опубликованы здесь по мере их поступления.",

            noFindings:
                "Проблем безопасности не обнаружено.",

            previousscan: "Предыдущие сканирования",

            evidence: "Доказательства",

            confidence: "Уверенность",

            status: {
                queued: "В очереди",
                running: "Запущено",
                scanning: "Сканирование",
                inspecting: "Проверка",
                fingerprinting:
                    "Определение сервиса",
                risk: "Анализ рисков",
                completed: "Завершено",
                failed: "Ошибка",
            },

            severity: {
                info: "Информация",
                low: "Низкий",
                medium: "Средний",
                high: "Высокий",
                critical: "Критический",
            },

            portState: {
                open: "Открыт",
                closed: "Закрыт",
                filtered: "Фильтруется",
                "open|filtered":
                    "Открыт / фильтруется",
                "closed|filtered":
                    "Закрыт / фильтруется",
                unknown: "Неизвестно",
            },

            hostState: {
                up: "Доступен",
                down: "Недоступен",
                unknown: "Неизвестно"
            },

            targetStatus: {
                queued: "В очереди",
                running: "Выполняется",
                completed: "Завершено",
                failed: "Ошибка"
            },

            duration: {
                seconds_one: "{{count}} секунда",
                seconds_few: "{{count}} секунды",
                seconds_many: "{{count}} секунд",
                seconds_other: "{{count}} секунды",

                minutes_one: "{{count}} минута",
                minutes_few: "{{count}} минуты",
                minutes_many: "{{count}} минут",
                minutes_other: "{{count}} минуты",
            },

            findings: {
                exposedTelnet: {
                    title: "Обнаружен открытый Telnet",
                    description: "Сервис Telnet доступен из публичной сети. Telnet передаёт данные аутентификации и сеанса без современного шифрования транспортного уровня.",
                    evidence: {
                        portRunningService: "Порт {{port}} использует сервис {{service}}."
                    }
                },

                exposedRedis: {
                    title: "Обнаружен открытый Redis",
                    description: "Сервис Redis доступен из публичной сети. Redis, как правило, не должен быть напрямую доступен из ненадёжных сетей без надлежащего ограничения доступа и защиты.",
                    evidence: {
                        portRunningService: "Порт {{port}} использует сервис {{service}}.",
                        authenticationNotDetected: "Требуется аутентификация: {{required}}."
                    }
                },

                exposedMemcached: {
                    title: "Обнаружен открытый Memcached",
                    description: "Сервис Memcached доступен из публичной сети. Memcached, как правило, не должен быть напрямую доступен из ненадёжных сетей.",
                    evidence: {
                        portRunningService: "Порт {{port}} использует сервис {{service}}.",
                        authenticationRequired: "Требуется аутентификация: {{required}}."
                    }
                },

                exposedMysql: {
                    title: "MySQL доступен без аутентификации",
                    description: "Сервис MySQL доступен из публичной сети без аутентификации.",
                    evidence: {
                        portRunningService: "Порт {{port}} использует сервис {{service}}.",
                        authenticationNotDetected: "Аутентификация MySQL не обнаружена."
                    }
                },

                exposedPostgresql: {
                    title: "Обнаружен открытый PostgreSQL",
                    description: "Сервис базы данных PostgreSQL доступен из публичной сети. Сервисы баз данных, как правило, не должны быть напрямую доступны из ненадёжных сетей.",
                    evidence: {
                        portRunningService: "Порт {{port}} использует сервис {{service}}.",
                        authenticationNotDetected: "Требуется аутентификация: {{required}}."
                    }
                },

                common: {
                    detectedProduct: "Обнаруженный продукт: {{product}}",
                    detectedVersion: "Обнаруженная версия: {{version}}"
                },

                missingSecurityHeaders: {
                    title: "Отсутствуют заголовки безопасности",
                    description: "В HTTP-сервисе отсутствует один или несколько рекомендуемых заголовков безопасности.",
                    evidence: {
                        missing: "Отсутствуют: {{headers}}"
                    }
                },

                weakTls: {
                    title: "Небезопасный протокол TLS",
                    description: "Сервис поддерживает {{protocol}}, который больше не рекомендуется использовать.",
                    evidence: {
                        protocol: "Протокол: {{protocol}}"
                    }
                },

                outdatedSoftware: {
                    title: "Обнаружено устаревшее программное обеспечение",
                    description: "Обнаруженная версия программного обеспечения может быть устаревшей, содержать известные уязвимости или не иметь важных обновлений безопасности.",
                    evidence: {
                        detectedProduct: "Обнаруженный продукт: {{product}}",
                        detectedVersion: "Обнаруженная версия: {{version}}",
                        recommendedVersion: "Рекомендуемая версия: {{version}}"
                    }
                }
            },

            dateTime: {
                selectDateTime: "Выбери дату и время",
                year: "Год",
                time: "Время",
                clear: "Очистить",

                months: {
                    january: "Январь",
                    february: "Февраль",
                    march: "Март",
                    april: "Апрель",
                    may: "Май",
                    june: "Июнь",
                    july: "Июль",
                    august: "Август",
                    september: "Сентябрь",
                    october: "Октябрь",
                    november: "Ноябрь",
                    december: "Декабрь",
                },

                weekdays: {
                    sun: "Вс",
                    mon: "Пн",
                    tue: "Вт",
                    wed: "Ср",
                    thu: "Чт",
                    fri: "Пт",
                    sat: "Сб",
                },
            },

            Searchip: "Поиск по IP-адресу или имени хоста...",
            statusLabel: "Статус",
            created: "Создано",
            started: "Начато",
            detected: "Обнаружено",
            scan: "Сканирование",
            viewScan: "Открыть сканирование",
            viewFinding: "Открыть находку",
            targetId: "ID цели",
            hostState1: "Состояние хоста",
            ports: "Порты",
            portsDiscovered: "обнаружено портов: ",
            unknownTarget: "Неизвестная цель",
            scanTargetsDescription: "Цели, включённые в это сканирование. Выбери цель, чтобы посмотреть обнаруженные сервисы.",
            targetCount_one: "{{count}} цель",
            targetCount_few: "{{count}} цели",
            targetCount_many: "{{count}} целей",
            targetCount_other: "{{count}} цели",
            failed: "Ошибки",
            completed: "Завершено",
            scanhistory: "Здесь будет отображаться история сканирования.",
            Backhistory: "← Вернуться к истории сканирования",
            Backfindings: "← Вернуться к находкам/уязвимостям",
            findingdetails: "Детали уязвимости",
            Scandetails: "Детали сканирования",
            securityissues: "Проблемы безопасности, выявленные в ходе сканирования вашей инфраструктуры.",

            analytics: "Аналитика",
            analyticsDescription: "Website трафик и регистрационная аналитика",

            viewer: "Viewer",
            admin: "Админ",

            filters: "Фильтры",
            analyticsFiltersDescription: "Фильтрация записей аналитики по набору данных, источнику, источнику трафика, IP-адресу, URL или диапазону дат.",

            clickevents: "События кликов",
            linkclicks: "Клики по ссылкам",

            event: "Событие",
            source: "Источник",
            trafficsource: "Источник трафика",
            ipaddress: "IP-адрес",
            targeturl: "Целевой URL",
            date: "Дата",

            applyFilters: "Применить фильтры",
            reset: "Сбросить",
            exportCsv: "Экспорт в CSV",

            registrations: "Регистрации",
            filteredResults: "Отфильтрованные результаты",

            dataManagement: "Управление данными",
            analyticsDeleteDescription: "Удаление записей аналитики с использованием фильтров, последних записей или диапазона дат.",

            delete: "Удалить",
            deleteFiltered: "Удалить отфильтрованные записи",
            deleteLast: "Удалить последние записи",
            deleteDateRange: "Удалить по диапазону дат",

            processing: "Обработка...",
            deleting: "Удаление...",
            confirmDeletion: "Подтвердить удаление",
            confirmDeletionDescription: "Это действие навсегда удалит {{count}} запись(и). Вы уверены, что хотите продолжить?",
            cancel: "Отмена",
            confirmDelete: "Подтвердить удаление",

            results: "Результаты",
            noResults: "Результаты не найдены.",

            eventTariffVps1m: "VPS тариф — 1 месяц",
            eventTariffVds1mFin: "VDS тариф — 1 месяц",
            eventLoginClick: "Нажатие на кнопку входа",
            eventRegisterClick: "Нажатие на кнопку регистрации",
            fromDate: "С даты",
            toDate: "По дату",
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,

        lng: language,

        fallbackLng: "en",

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;