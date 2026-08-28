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
            findings: "Findings",
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

            hosts: "Hosts",
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

            scanhistory: "Scan history will appear here.",
        },
    },

    ru: {
        translation: {
            scanner: "Сканер",
            csrdpscanner: "CSRDP / Сканер",
            workspace: "Рабочая область",
            system: "Система",

            scanHistory: "История сканирования",
            findings: "Результаты/Уязвимости",
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

            targets: "целей",

            hosts: "Хосты",
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

            scanhistory: "Здесь будет отображаться история сканирования.",
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