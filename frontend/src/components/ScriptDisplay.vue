<template>
    <Accordion type="single" collapsible class="mb-4">
        <AccordionItem value="script">
            <AccordionTrigger class="text-lg font-semibold">
                {{ t('install.viewScript') }}
            </AccordionTrigger>
            <AccordionContent>
                <Card class="overflow-y-auto max-h-64 rounded-lg border 
                    bg-gray-900 text-white m-2 border-gray-700">
                    <CardContent class="p-4">
                        <pre class="whitespace-pre-wrap">{{ maskedScriptContent }}</pre>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    <div class="flex justify-between">
        <Button @click="emit('copyScript')" class="mb-4">
            {{ t('install.copyScript') }}
        </Button>
        <Button variant="default" @click="emit('downloadScript')">
            {{ t('wizard.downloadScript') }}
        </Button>
    </div>
</template>
  
<script setup lang="ts">
    import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
    import { Card, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { computed } from 'vue';
    import { isDefined } from '@vueuse/core';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    const emit = defineEmits(['copyScript', 'downloadScript']);
  
    const props = defineProps<{
        scriptContent: string;
        sensitiveVariables: string[];
    }>();

    const maskedScriptContent = computed(() => {
        if(!isDefined(props.scriptContent) || !props.scriptContent) {
            return ''; 
        }
        if (!isDefined(props.sensitiveVariables) || !props.sensitiveVariables || !props.sensitiveVariables.length) {
            return props.scriptContent || ''; 
        }
        
        let maskedScript = props.scriptContent;

        props.sensitiveVariables.forEach((variableName: string) => {
            const regex = new RegExp(`(export ${variableName}=')([^']*)(')`, 'g');
            maskedScript = maskedScript.replace(regex, (_match, p1, _p2, p3) => {
                return `${p1}********${p3}`; // Mask the value
            });
        });
    
        return maskedScript;
    });
</script>
  