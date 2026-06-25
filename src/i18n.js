import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {

    const messages = {}

    const localeFiles = import.meta.glob('./locales/*.json', { eager: true })
    for (const path in localeFiles) {
        const matched = path.match(/([A-Za-z0-9-_]+)\./i)
        if (matched && matched.length > 1) {
            const locale = matched[1]
            messages[locale] = localeFiles[path].default
        }
    }

    return messages
}

const i18n = createI18n({

    locale: 'zh',
    fallbackLocale: 'en',
    messages: loadLocaleMessages()
})

export default i18n
