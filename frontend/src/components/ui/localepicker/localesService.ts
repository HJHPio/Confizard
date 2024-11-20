import { getDynamicConfigBaseUrl } from "@/lib";
import { TranslationMessages, LocaleModule } from "@/lib/types";
import axios from 'axios';
import { useRoute } from "vue-router";
// Initialize an empty messages object
const messages: Record<string, TranslationMessages> = {}; // e.g., 'en'
let availableLocales: string[] = [];
let defaultLocale = 'en';

// Function to load external translations from public/steps-data
const loadExternalLocales = async (route: ReturnType<typeof useRoute>) => {
    try {
        const urlBase = getDynamicConfigBaseUrl(route);
        const supportedLocalesResponse = await axios.get(`${urlBase}/steps-data/supportedLocales.json`);
        const supportedLocales: string[] = supportedLocalesResponse.data;

        await Promise.all(
            supportedLocales.map(async (locale) => {
                try {
                const urlBase = getDynamicConfigBaseUrl(route);
                const res = await axios.get(`${urlBase}/steps-data/${locale}.json`);
                messages[locale] = { ...messages[locale], ...res.data };
                } catch (error) {
                console.warn(`External locale file for '${locale}' not found.`);
                }
            })
        );
    } catch (error) {
        console.warn('No external general locales found or error loading them.');
    }
};
  
export async function initializeMessages(route: ReturnType<typeof useRoute>) {
    // Load default application translations
    const baseLocales = import.meta.glob<LocaleModule>('../../../locales/*.json', { eager: true });
    for (const path in baseLocales) {
      const localeMatch = path.match(/\/locales\/([A-Za-z0-9-_]+)\.json$/);
      if (localeMatch && localeMatch[1]) {
        const locale = localeMatch[1];
        const module = baseLocales[path];
        messages[locale] = module.default;
      }
    }

    await loadExternalLocales(route);
    availableLocales = Object.keys(messages);
    const userLocale = navigator.language.split('-')[0];
    defaultLocale = availableLocales.includes(userLocale) ? userLocale : 'en';

    if (Object.keys(messages).length === 0) {
        console.error('No locale files found.');
    }
}

export function getDefaultLocale(): string {
    return defaultLocale;
}

export function getLocalizedMessages(): Record<string, TranslationMessages> {
    return messages;
}

export function getAvailableLocales(): string[] {
    return availableLocales;
}