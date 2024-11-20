<template>
    <div class="w-full flex justify-between px-10">
        <Button variant="default" @click="emit('prevStep')" :disabled="(currentStep ?? 0) === 0">
            {{ t('wizard.previous') }}
        </Button>
        <Button variant="default" @click="emit('nextStep')"
            :disabled="(!(areFieldsValid ?? false)) || ((currentStep ?? 0) >= ((totalSteps ?? 1) - 1))">
            <div v-if="(currentStep ?? 0) >= ((totalSteps ?? 1) - 2)">
                {{ t('wizard.last') }}
            </div>
            <div v-else>
                {{ t('wizard.next') }}
            </div>
        </Button>
    </div>
</template>
  
<script setup lang="ts">
    import { Button } from '@/components/ui/button';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const emit = defineEmits(['prevStep', 'nextStep']);
    defineProps({
        currentStep: {
            type: Number,
            required: true,  
        },
        totalSteps: {
            type: Number,
            required: true,
        },
        areFieldsValid: {
            type: Boolean,
            required: true,
        },
    });
</script>
  