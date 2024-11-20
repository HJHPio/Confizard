<template>
    <label :for="id" class="block mb-1">
        {{ getDynamicTranslation(label, t) }}
    </label>
    <Input v-model="formData[id]" :id="id" :type="type" class="w-full"/>
    <Button v-if="showApply" variant="default" @click="emit('apply')">
        <div>
            {{ t('wizard.apply') }}
        </div>
    </Button>
</template>

<script setup lang="ts">
    import { getDynamicTranslation } from '@/lib';
    import { Button, Input } from '@/components';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const emit = defineEmits(['apply']);
    defineProps<{
        id: string,
        label: string,
        type: string,
        formData: Record<string, any>;
        showApply?: boolean;
    }>();
</script>