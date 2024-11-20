<template>
    <Card class="w-5/6 absolute top-12 mx-1 px-4 pt-4 
        text-white border border-gray-700 backdrop-blur-sm 
        bg-transparent rounded-lg overflow-x-auto z-10">
        <CardContent>
            <Stepper class="w-full" 
                v-bind:linear="false" 
                @update:model-value="updateExCurrentStep" 
                v-bind:model-value="exCurrentStepTrackerRO">
                <StepperItem v-for="(item, index) in stepperSteps"
                    :key="item.id" class="basis-1/4" :step="index + 1" >
                    <StepperTrigger>
                        <StepperIndicator>
                            <component :is="item.icon" class="w-6 h-6" />
                        </StepperIndicator>
                        <div class="flex flex-col text-wrap">
                            <StepperTitle>{{ item.title }}</StepperTitle>
                        </div>
                    </StepperTrigger>
                    <StepperSeparator v-if="index !== stepperSteps.length - 1" class="w-full h-px" />
                </StepperItem>
            </Stepper>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
    import { Card, CardContent } from '@/components/ui/card';
    import { useI18n } from 'vue-i18n';
    import { BookOpenIcon, CheckIcon, CircleStackIcon } from '@heroicons/vue/24/outline';
    import { getDynamicTranslation, Step } from '../lib/types';

    // Translations
    const { t } = useI18n();
    
    const props = defineProps<{
        steps: Step[]; 
        exCurrentStep: number; 
    }>();

    // Keep track of external Step 
    const exCurrentStepTrackerRO = computed(() => {
        return props.exCurrentStep + 1;
    });

    // Emit step change by stepper navigation
    const emit = defineEmits(['goToStep']);
    const updateExCurrentStep = (payload: number | undefined) => {
        if(typeof payload === 'number') emit('goToStep', payload - 1);
    }

    // TODO: Think about dynamic icons
    const iconMap = {
        BookOpenIcon,
        CircleStackIcon,
        CheckIcon,
    };

    // Keep track of Steps
    const stepperSteps = computed(() => 
        props.steps.map((step) => ({
            id: step.id,
            title: getDynamicTranslation(step.title, t),
            icon: step.icon && step.icon in iconMap ? iconMap[step.icon as keyof typeof iconMap] : CheckIcon, // Safety check
        }))
    );
</script>
