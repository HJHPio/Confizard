<template>
    <div v-if="!isLastStep && step">
        <h2 class="text-xl font-semibold pt-10">{{ getDynamicTranslation(step.title, t) }}</h2>
        <p class="mb-4">{{ getDynamicTranslation(step.description, t) }}</p>
        <div v-if="step.configurable">
            <ConfigurableInput :id="'STEP_' + step.id + '_CS_TITLE'" type="string"
            :form-data="formData" :label="'step.config.set.title'"  />
            <ConfigurableInput :id="'STEP_' + step.id  + '_CS_DESCRIPTION'" type="string"
            :form-data="formData" :label="'step.config.set.description'"  />
            <ConfigurableInput :id="'STEP_' + step.id  + '_CS_ICON'" type="string"
            :form-data="formData" :label="'step.config.set.icon'"  />
            <ConfigurableInput :id="'STEP_' + step.id  + '_CS_MULTIPLIER'" type="number"
            :form-data="formData" :label="'step.config.set.multiplier'"  />
            <ConfigurableCheckbox :id="'STEP_' + step.id  + '_CS_CONFIGURABLE'" 
            :form-data="formData" :label="'step.config.set.isConfigurable'" />
            <!-- TODO: add on edit event -> put configurable default steps into steps and reset,
             add ability to remove step from steps in navigation bar-->
            <ConfigurableInput :id="'STEP_' + step.id  + '_CS_LOCAL_STEPS_NUMBER'" type="number"
            :form-data="formData" :label="'step.config.set.stepsNumber'"  :show-apply="true" @apply="applyStepsNumberChange"/>
            <ConfigurableInput :id="'STEP_' + step.id  + '_CS_LOCAL_FIELDS_NUMBER'" type="number"
            :form-data="formData" :label="'step.config.set.fieldsNumber'" :show-apply="true" @apply="applyFieldsNumberChange"/>
            <Textarea v-model="formData['STEP_' + step.id + '_CS_SCRIPT']" class="w-full"
                :id="'STEP_' + step.id  + '_CS_SCRIPT'" :placeholder="t('step.config.placeholders.script')"/>
        </div>
        <div v-for="field in step.fields" :key="field.name" class="mb-4">
            <FormField :field="field" :form-data="formData" />
        </div>
    </div>
    <div v-else>
        <ScriptDisplay :script-content="scriptContent" :sensitiveVariables="sensitiveList || []" 
            @copyScript="emit('copyScript')" @downloadScript="emit('downloadScript')" />
        <SettingsTable :settings="settingsList"/>
    </div>
</template>
  
<script setup lang="ts">
    import { Field, Step, getDynamicMultipliedTranslation, getDynamicTranslation, } from '@/lib';
    import { ScriptDisplay, SettingsTable, FormField, ConfigurableInput, ConfigurableCheckbox, Textarea } from '@/components'
    import { computed, ComputedRef, toRaw, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t, te } = useI18n();
    const emit = defineEmits(['copyScript', 'downloadScript']);
  
    const props = defineProps<{
        step: Step;
        steps: Step[];
        isLastStep: boolean;
        formData: Record<string, any>;
        scriptContent: string;
        settingsList: any[];
    }>();

    const computedAddedFields: ComputedRef<Field[]> = computed( () => {
        let tmpList: Field[] = [];
        const fieldsLn = props.step.fields.length;
        for(let i = 0; i < fieldsLn; i++) {
            if(!props.step.fields[i]) continue;
            props.step.fields[i].name.endsWith("_CS_LOCAL_FIELD") ? 
                tmpList.push(props.step.fields[i]) : null;
        }
        return tmpList;
    });

    const computedDefaultFields: ComputedRef<Field[]> = computed( () => {
        let tmpList: Field[] = [];
        const fieldsLn = props.step.fields.length;
        for(let i = 0; i < fieldsLn; i++) {
            if(!props.step.fields[i]) continue;
            props.step.fields[i].name.endsWith("_CS_LOCAL_FIELD") ? 
                null : tmpList.push(props.step.fields[i]) ;
        }
        return tmpList;
    });

    const applyStepsNumberChange = ( () => {
        const newStepsNumber = props.formData['STEP_' + props.step.id  + '_CS_LOCAL_STEPS_NUMBER'];
        if(newStepsNumber == null || newStepsNumber == undefined || newStepsNumber === 0) return;
        let newStepsList: Step[] = [];
        const currentStepId = props.step.id;
        for(let i = 1; i < newStepsNumber + 1; ++i) {
            const newStep: Step = {
                id: currentStepId + i,
                title: 'step.config.placeholders.added.step',
                description: 'step.config.placeholders.added.desc',
                fields: [],
                configurable: true
            }
            newStepsList.push(newStep);
        }
        props.steps.splice(currentStepId + 1, 0, ...newStepsList);
        const lastStepId = props.steps.length;
        for(let i = currentStepId + newStepsNumber; i < lastStepId; ++i) {
            props.steps[i].id = i;
        }
        props.formData['STEP_' + props.step.id  + '_CS_LOCAL_STEPS_NUMBER'] = 0;
    });

    const applyFieldsNumberChange = (() => {
        const newFieldsNumber = props.formData['STEP_' + props.step.id  + '_CS_LOCAL_FIELDS_NUMBER'];
        if(newFieldsNumber == null || newFieldsNumber == undefined) return;
        const currentlyAddedFields = computedAddedFields.value;
        if(!!currentlyAddedFields && currentlyAddedFields.length > 0) {
            for(let i = 0; i < currentlyAddedFields.length; i++) {
                delete props.formData[currentlyAddedFields[i].name];
            }
            props.step.fields = computedDefaultFields.value;
        }
        let newFields = [];
        for(let i = 0; i < newFieldsNumber; i++) {
            const newField: Field = {
                name: 'STEP_' + props.step.id  + '_FIELD_' + i + '_CS_LOCAL_FIELD',
                label: 'field.configurable.label',
                configurable: true
            }
            newFields.push(newField);
        }
        props.step.fields = props.step.fields.concat(newFields);
    });

    const computedStep: ComputedRef<Step> = computed(() => props.step);
    watch(
        computedStep,
        (newStep) => {
            let multipliedFields: Field[] = [];
            newStep.fields.forEach( (field: Field) => {
                // Step will consist of original field (with multiplier = 0)  
                let originalField = { ...toRaw(field) };
                originalField.multiplier = 0;
                multipliedFields.push(originalField);
                // and (i - 1) deep copies of that field (if its multiplier != 0)
                if(field.multiplier && field.multiplier !== 0) {
                    const fieldMultiplier = field.multiplier;
                    field.multiplier = 0;
                    for(let i = 0; i < fieldMultiplier - 1; i++) {
                        let multipliedField: Field = {
                            ...toRaw(field),
                            name: `${field.name}_MF${i}`,
                            label: getDynamicMultipliedTranslation(field.label, 'MF', i, t, te),
                        };
                        multipliedFields.push(multipliedField);
                    }
                }
            });
            props.step.fields = multipliedFields;
        },
        { immediate: true }
    );

    const sensitiveList = computed(() => {
        const list: any[] = [];
        let sensitiveInitList = props.settingsList.filter((setting) => {
            return setting.sensitive;
        })
        sensitiveInitList.forEach( (setting: Field) => {
            list.push(setting.name)
        })
        return list;
    });
</script>
  