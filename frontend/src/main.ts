// main.ts
import { createApp } from 'vue';
import './assets/index.css';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import { initializeMessages, getDefaultLocale, getLocalizedMessages } from './components/ui/localepicker/localesService';
import { TranslationMessages } from './lib/types';
import router from './router';

async function initApp() {
  const route = router.currentRoute.value;
  await initializeMessages(route);
  const messages: Record<string, TranslationMessages> = getLocalizedMessages();

  const i18n = createI18n({
    legacy: false,
    locale: getDefaultLocale(),   // Use detected locale
    fallbackLocale: 'en',         // Fallback locale
    messages,
    // Supress missing and falback translations warnings
    silentTranslationWarn: true, 
    missingWarn: false, 
    fallbackWarn: false
  });

  const app = createApp(App);
  app.use(i18n);
  app.use(router);
  app.mount('#app');
}

initApp();
