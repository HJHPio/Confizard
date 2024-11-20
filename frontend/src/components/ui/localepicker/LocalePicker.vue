<!-- Locale Picker -->
<template>
    <div class="absolute top-4 right-4 z-10">
      <select v-model="locale" class="bg-gray-700 text-white p-2 rounded">
        <option v-for="lang in avLocales" :key="lang" :value="lang">
          {{ lang }}
        </option>
      </select>
    </div>
</template>
<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import { getAvailableLocales } from './localesService';
    const { locale } = useI18n();
    const avLocales = getAvailableLocales();
</script>