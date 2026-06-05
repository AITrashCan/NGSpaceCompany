import { createI18n } from 'vue-i18n'

const localeModules = import.meta.glob('./locales/*.json', { eager: true })

const messages = {}

for (const path in localeModules) {
    const matched = path.match(/\.\/locales\/([A-Za-z0-9-_]+)\.json$/)
    if (matched && matched.length > 1) {
        const locale = matched[1]
        messages[locale] = localeModules[path].default
    }
}

const i18n = createI18n({

    locale: 'zh',
    fallbackLocale: 'en',
    messages
})

export default i18n