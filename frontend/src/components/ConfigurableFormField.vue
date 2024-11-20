<template>
    <label :for="field.name" class="block mb-1">
        {{ getDynamicTranslation(field.label, t) }}
    </label>
    <ConfigurableInput :id="field.name + '_CF_NAME'" type="string"
    :form-data="formData" :label="'field.config.set.name'"  />
    <ConfigurableInput :id="field.name + '_CF_LABEL'" type="string"
    :form-data="formData" :label="'field.config.set.label'"  />
    <ConfigurableInput :id="field.name + '_CF_TYPE'" type="string"
    :form-data="formData" :label="'field.config.set.type'"  />
    <ConfigurableInput :id="field.name + '_CF_DESCRIPTION'" type="string"
    :form-data="formData" :label="'field.config.set.description'"  />
    <ConfigurableInput :id="field.name + '_CF_DEFAULT'" type="string"
    :form-data="formData" :label="'field.config.set.default'"  />
    <ConfigurableInput :id="field.name + '_CF_MULTIPLIER'" type="number"
    :form-data="formData" :label="'field.config.set.multiplier'"  />
    <ConfigurableCheckbox :id="field.name + '_CF_SENSITIVE'" 
    :form-data="formData" :label="'field.config.isSensitive'" />
    <ConfigurableCheckbox :id="field.name + '_CF_OBLIGATORY'" 
    :form-data="formData" :label="'field.config.isObligatory'" />
    <ConfigurableCheckbox :id="field.name + '_CF_CONFIGURABLE'" 
    :form-data="formData" :label="'field.config.isConfigurable'" /> 
</template>

<script setup lang="ts">
    import { Field, getDynamicTranslation } from '@/lib';
    import { ConfigurableCheckbox, ConfigurableInput } from '@/components';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    defineProps<{
        field: Field,
        formData: Record<string, any>;
    }>();
</script>