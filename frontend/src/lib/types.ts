import { computed, ComputedRef } from "vue";

// src/lib/types.ts
export interface Field {
    name: string;
    label: string | ComputedRef<string>;
    type?: 'text' | 'number' | 'checkbox' | 'password' | 'multiline';
    description?: string;
    default?: any;
    multiplier?: number;
    sensitive?: boolean;
    obligatory?: boolean;
    configurable?: boolean;
}
  
export interface Step {
    id: number;
    title: string | ComputedRef<string>;
    description: string | ComputedRef<string>;
    fields: Field[];
    script?: string;
    icon?: string;
    multiplier?: number;
    configurable?: boolean;
}

export interface Setting {
    name: string;
    label: string;
    value: string | number | boolean;
    sensitive: boolean;
}

export type TranslationMessages = Record<string, any>;
export type LocaleModule = { default: TranslationMessages };

// Type utils
export const isFieldRequired = (field: Field) => field.obligatory === true;
export const isFieldValid = (field: Field, records: Record<string, any>) => {
    if (field.obligatory !== true) return true;
    const value = records[field.name];
    if (field.type == 'checkbox') return !!value;
    return value !== undefined && value !== null && value !== '';
};
export const getDynamicMultipliedTranslation = (initKey: any, additionalKey: string, 
    i: number, t: (key: string) => string, te: (key: string) => boolean) : ComputedRef<string> => {
    return computed(() => {
        if(typeof initKey == 'string') {
            return te(`${initKey}_${additionalKey}${i}`) ? 
                `${t(initKey + '_' + additionalKey + i)}` : 
                `${t(initKey)} ${additionalKey}${i}`;
        }
        return `${t('wizard.warn.unexpected.translation_type')} ${additionalKey}${i}`;
    });
};
export const computeType: ComputedRef<string> = computed( () => "computedRefString" );
export const getDynamicTranslation = (initKey: any, t: (key: string) => string) : ComputedRef<string> => {
    return computed(() => {
        if(typeof initKey == 'string') {
            return t(initKey)
        }
        if(typeof initKey == typeof computeType) {
            return t(initKey.value);
        }
        return t('wizard.warn.unexpected.translation_type');
    });
};