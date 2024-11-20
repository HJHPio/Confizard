/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EXTERNAL_CONFIG_URL_BASE: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}