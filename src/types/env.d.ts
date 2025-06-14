interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_PORT: number
    readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}