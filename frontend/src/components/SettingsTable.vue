<template>
    <div class="mb-4 flex space-x-4">
      <Input v-model="filterLabel" :placeholder="t('wizard.filterBySettingName')" class="w-1/2" />
      <Input v-model="filterValue" :placeholder="t('wizard.filterBySettingValue')" class="w-1/2" />
    </div>
    <div class="overflow-y-auto max-h-64">
      <Table class="min-w-full divide-y divide-gray-700">
        <TableHeader>
          <TableRow>
            <TableHead>{{ t('settings.setting') }}</TableHead>
            <TableHead>{{ t('settings.value') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="setting in filteredSettings"
            :key="setting.name" class="bg-transparent hover:bg-gray-800">
            <TableCell class="px-4 py-2">{{ t(setting.label) }}</TableCell>
            <TableCell class="px-4 py-2 flex items-center">
                <span class="mr-2">
                    {{ (setting.sensitive && !sensitiveFieldVisibility[setting.name]) ?  '********' : String(setting.value) }}
                </span>
                <Button v-if="setting.sensitive" variant="ghost" class="ml-2"
                    :aria-label="sensitiveFieldVisibility[setting.name] ? t('hide') : t('show')"
                    @click="toggleSensitiveField(setting.name)">
                    <component :is="sensitiveFieldVisibility[setting.name] ? EyeSlashIcon : EyeIcon" class="h-5 w-5 text-gray-400"/>
                </Button>
            </TableCell>
          </TableRow>
          <!-- No Results Found -->
          <TableRow v-if="filteredSettings.length === 0">
            <TableCell colspan="2" class="text-center py-4">
              {{ t('settings.noResults') }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
</template>
  
<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { Input } from '@/components/ui/input';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
    import { Setting } from '@/lib/types';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

    const props = defineProps<{
        settings: Setting[];
    }>();
  
    // Track sensitive field visibility (default false, toggle if needed)
    const sensitiveFieldVisibility = ref<Record<string, boolean>>({});
    const toggleSensitiveField = (fieldName: string) => {
        sensitiveFieldVisibility.value[fieldName] = !sensitiveFieldVisibility.value[fieldName];
    };
  
    // Filtering settings by comparing labels AND values - if both are '' then both are displayed
    const filterLabel = ref('');
    const filterValue = ref('');
    const filteredSettings = computed(() =>
        props.settings.filter((setting) => {
            // Only filter by value if the field is not sensitive
            // sensitive fields should be shown always
            // TODO: make this behaviour configurable - if a lot of fields (or all) are sensitive it wont be usefull
            const matchesValue = setting.sensitive ? true : String(setting.value).toLowerCase().includes(filterValue.value.toLowerCase());
            const matchesLabel = t(setting.label).toLowerCase().includes(filterLabel.value.toLowerCase());
            return matchesValue && matchesLabel;
        })
    );
</script>
  