<template>
    <div class="items-top flex gap-x-2">
            <Checkbox :id="id" v-model:checked="formData[id]"/>
            <div class="grid gap-1.5 leading-none">
                <label :for="id" 
                    class="text-sm font-medium leading-none 
                        peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {{ t(label) }}
                </label>
            </div>
        </div>
</template>

<script setup lang="ts">
    import { Checkbox } from '@/components';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    defineProps<{
        id: string,
        label: string,
        formData: Record<string, any>;
    }>();
</script>