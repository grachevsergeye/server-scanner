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
            workspace: "Workspace",
            system: "System",

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
            duration: "Duration",
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
        },
    },

    ru: {
        translation: {
            scanner: "Сканер",
            csrdpscanner: "CSRDP / Сканер",
            workspace: "Рабочая область",
            system: "Система",

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
            duration: "Продолжительность",
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