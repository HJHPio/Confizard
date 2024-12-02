<template>
    <Toaster />
    <div class="gradient-bg">
      <div class="pattern">
        <div class="pattern-mist">
          <div class="mist-overlay" ref="mistOverlay" @mousemove="handleMouseMove"/>
        </div>
      </div>
    </div>
    <div class="min-w-screen h-full w-full text-white flex flex-col items-center relative z-20" @mousemove="handleMouseMove">
              <div class="logo-mist-overlay absolute m-0"></div>
              <LocalePicker />
              <!-- Stepper Navigation -->
              <StepperNavigation :steps="steps" :exCurrentStep="currentStep" @goToStep="goToStep" />
              <!-- Steps -->
              <Card id="botContent" v-if="currentStep != undefined"
                class="w-full max-w-md relative text-white border
                 border-gray-700 backdrop-blur-sm bg-transparent 
                 rounded-lg overflow-x-auto p-2 m-2 mt-40 h-fit">
                <CardContent>
                  <NavigationButtons
                    :currentStep="currentStep"
                    :totalSteps="totalSteps"
                    :areFieldsValid="areFieldsValid"
                    @prevStep="prevStep"
                    @nextStep="nextStep"
                  />
                  <StepContent
                    v-if="steps[currentStep]"
                    :steps="steps"
                    :step="steps[currentStep]"
                    :isLastStep="isLastStep"
                    :formData="formData"
                    :scriptContent="scriptContent"
                    :settingsList="settings"
                    @copyScript="copyScript"
                    @downloadScript="downloadScript"
                  />
                </CardContent>
              </Card>
            </div>
  </template>
  
  <script setup lang="ts">
    import { ref, computed, onMounted, toRaw } from 'vue';
    import StepperNavigation from '@/components/StepperNavigation.vue';
    import NavigationButtons from '@/components/NavigationButtons.vue';
    import StepContent from '@/components/StepContent.vue';
    import { Card, CardContent } from '@/components/ui/card';
    import { Toaster, useToast } from '@/components/ui/toast';
    import { LocalePicker } from '@/components/ui/localepicker';
    import {  Field, getDynamicMultipliedTranslation, isFieldValid, Step } from '../lib/types';
    import axios from 'axios';
    import { DebounceFilterOptions, useDebounceFn } from '@vueuse/core';
    import { useI18n } from 'vue-i18n';  
    import * as yaml from 'yaml';
    import { getDynamicConfigBaseUrl } from '@/lib';
    import { useRoute } from 'vue-router';
  
    const route = useRoute();
    const { t, te } = useI18n();
    const { toast } = useToast();
  
    const steps = ref<Step[]>([]);
    const scriptContent = ref<string>('');
    const formData = ref<Record<string, any>>({});
    const currentStep = ref(0);
    const totalSteps = computed(() => steps.value.length);
    const isLastStep = computed(() => currentStep.value === totalSteps.value - 1);
  
    const multiplySteps = (defaultSteps: Step[]): Step[] => {
      let multipliedSteps: Step[] = [];
      let multipliedIds: number = 0;
  
      defaultSteps.forEach((step: Step) => {
          const originalStep = { ...toRaw(step), fields: [...toRaw(step.fields)] };
          originalStep.id = step.id + multipliedIds;
          multipliedSteps.push(originalStep);
          if (step.multiplier && step.multiplier !== 0) {
              const stepMultiplier = step.multiplier - 1;
              step.multiplier = 0;
  
              for (let i = 0; i < stepMultiplier; i++) {
                  multipliedIds++;
                  let multipliedStep: Step = {
                      ...toRaw(step),
                      id: step.id + multipliedIds,
                      title: getDynamicMultipliedTranslation(step.title, 'MS', i, t, te),
                      description: getDynamicMultipliedTranslation(step.description, 'MS', i, t, te),
                      fields: step.fields.map((field: Field) => {
                          return {
                              ...toRaw(field),
                              name: `${field.name}_MS${i}`,
                              label: getDynamicMultipliedTranslation(field.label, 'MS', i, t, te),
                          };
                      }),
                      script: '',
                  };
                  multipliedSteps.push(multipliedStep);
              }
          }
      });
      return multipliedSteps;
    };
  
    // Load steps data
    const loadSteps = async (stepsFile: string = 'steps.default.yaml') => {
      try {
        const urlBase = getDynamicConfigBaseUrl(route);
        const defaultStepsResponse = await axios.get(`${urlBase}/steps-data/${stepsFile}`);
        const defaultSteps = stepsFile.endsWith('yaml') ? yaml.parse(defaultStepsResponse.data) : defaultStepsResponse.data;
        if (defaultSteps) {
          steps.value = multiplySteps(defaultSteps);
        } else {
          console.error(`Steps file '${stepsFile}' not found.`);
          steps.value = [];
        }
        clearFormData();
      } catch (error) {
        console.error('Error loading steps: ', error);
      }
    };
    onMounted(() => {
      loadSteps();
    });
  
    const clearFormData = () => {
      formData.value = {};
        steps.value.forEach((step) => {
          step.fields.forEach((field) => {
            formData.value[field.name] = field.default || (field.type === 'checkbox' ? false : '');
          });
        });
    }
  
    const areFieldsValid = computed(() => {
      const currentStepData = steps.value[currentStep.value];
      if (!currentStepData) return false;
      return currentStepData.fields.every((field) => isFieldValid(field, formData.value));
    });
  
    // Navigation functions
    const nextStep = () => {
      if (!areFieldsValid) {
        toast({
          title: t('wizard.fillRequiredFields'),
          variant: 'warning',
        });
        return;
      }
      if (currentStep.value < totalSteps.value - 1) {
        currentStep.value++;
        if (isLastStep.value) {
          generateScript();
        }
      }
    };
  
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };
  
    const goToStep = (index: number) => {
      if (index < currentStep.value || areFieldsValid) {
        currentStep.value = index;
        if (isLastStep.value) {
          generateScript();
        }
      } else {
        toast({
          title: t('wizard.fillRequiredFields'),
          variant: 'warning',
        });
      }
    };
  
    // Generate script
    const generateScript = () => {
      let script = '#!/bin/bash\n';
      for (const [key, value] of Object.entries(formData.value)) {
        if( typeof key != 'string' ) continue;
        const typeOfVal = typeof value;
        switch(typeOfVal) {
          case 'string':
            if(value == '') continue;
            script += `export ${key}="${value}"\n`;
            break;
          case 'boolean':
            script += `export ${key}=${value}\n`;
            break;
          case 'number':
            script += `export ${key}=${value}\n`;
            break;
        }
      }
      steps.value.forEach((step) => {
        if (step.script) {
          script += `\n${step.script}\n`;
        }
      });
      scriptContent.value = script;
      toast({
        title: t('install.generatedScript'),
        variant: 'default',
      });
    };
  
    // Function to download the script
    const downloadScript = () => {
      if (scriptContent.value) {
        const blob = new Blob([scriptContent.value], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'setup.sh';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        toast({
          title: t('install.generateScriptFirst'),
          variant: 'warning',
        });
      }
    };
  
    const copyScript = () => {
      if (!scriptContent.value) {
        toast({
          title: t('install.generateScriptFirst'),
          variant: 'warning',
        });
        return;
      }
  
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(scriptContent.value)
          .then(() => {
            toast({
              title: t('install.scriptCopied'),
              variant: 'success',
            });
          })
          .catch(() => {
            toast({
              title: t('install.copyError'),
              variant: 'destructive',
            });
          });
        return;
      }
      
      console.warn("Using deprecated 'document.execCommand('copy')' as fallback");
      const textArea = document.createElement('textarea');
      textArea.value = scriptContent.value;
      textArea.style.position = 'fixed'; 
      document.body.appendChild(textArea);
      textArea.select();
  
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast({
            title: t('install.scriptCopied'),
            variant: 'success',
          });
        } else {
          throw new Error("Copy command was unsuccessful.");
        }
      } catch (error) {
        toast({
          title: t('install.copyError'),
          variant: 'destructive',
        });
        console.error('Fallback copy to clipboard failed', error);
      }
  
      document.body.removeChild(textArea);
    };
  
    // Settings data
    const settings = computed(() => {
      const list: any[] = [];
      steps.value.forEach((step) => {
        step.fields.forEach((field) => {
          if(field.configurable) return;
          list.push({
            name: field.name,
            label: field.label,
            value: formData.value[field.name],
            sensitive: field.sensitive || false,
          });
        });
      });
      return list;
    });
  
    // Mouse move effect
    const mistOverlay = ref<HTMLElement | null>(null);
    const debounceOptions: DebounceFilterOptions = {
      maxWait: 16,
    };
    const handleMouseMove = useDebounceFn((e: MouseEvent) => {
      if (mistOverlay.value) {
        mistOverlay.value.style.setProperty('--mouse-x', `${e.x}px`);
        mistOverlay.value.style.setProperty('--mouse-y', `${e.y}px`);
      } else {
        console.warn('mistOverlay is not available yet');
      }
    }, 16, debounceOptions);
  </script>
  