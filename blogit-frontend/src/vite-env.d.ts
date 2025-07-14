/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_INTERACTION_SERVICE_PATH: string
  readonly VITE_POST_SERVICE_PATH: string
  readonly VITE_USER_SERVICE_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 