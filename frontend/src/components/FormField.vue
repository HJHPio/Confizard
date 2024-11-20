<template>
    <div v-if="field.configurable">
        <ConfigurableFormField :field="field" :form-data="formData" />
    </div>
    <div v-else> 
        <label :for="field.name" class="block mb-1" v-if="field.type !== 'checkbox'">
            {{ getDynamicTranslation(field.label, t) }}
            <span v-if="isFieldRequired(field)" class="text-red-500">*</span>
        </label>
        <div v-if="field.type && ['text', 'number', 'password'].includes(field.type)">
            <Input v-model="formData[field.name]" :id="field.name" :type="field.type" class="w-full"
                :class="{ 'border-red-500': !isFieldValid(field, formData) && isFieldRequired(field) }"/>
            <span v-if="!isFieldValid(field, formData) && isFieldRequired(field)" class="text-red-500 text-sm">
                {{ t('wizard.fieldRequired') }}
            </span>
        </div>
        <div v-else-if="field.type === 'multiline'">
            <Textarea v-model="formData[field.name]" class="w-full"
                :class="{ 'border-red-500': !isFieldValid(field, formData) && isFieldRequired(field) }"
                :id="field.name" :placeholder="field.description != null ? t(field.description) : ''"/>
            <span v-if="!isFieldValid(field, formData) && isFieldRequired(field)" class="text-red-500 text-sm">
                {{ t('wizard.fieldRequired') }}
            </span>
        </div>
        <div v-else-if="field.type === 'checkbox'">
            <div class="items-top flex gap-x-2">
                <Checkbox :id="field.name" v-model:checked="formData[field.name]"/>
                <div class="grid gap-1.5 leading-none">
                    <label :for="field.name" 
                        class="text-sm font-medium leading-none 
                            peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {{ getDynamicTranslation(field.label, t) }}
                        <span v-if="isFieldRequired(field)" class="text-red-500">*</span>
                    </label>
                    <p v-if="field.description" class="text-sm text-muted-foreground">
                        {{ t(field.description) }}
                    </p>
                    <span v-if="!isFieldValid(field, formData) && isFieldRequired(field)" class="text-red-500 text-sm">
                        {{ t('wizard.fieldRequired') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Field, getDynamicTranslation, isFieldRequired, isFieldValid } from '@/lib';
    import { Input, Checkbox, Textarea, ConfigurableFormField } from '@/components';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    defineProps<{
        field: Field,
        formData: Record<string, any>;
    }>();
</script>