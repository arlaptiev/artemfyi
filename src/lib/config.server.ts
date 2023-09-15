
export const appConfig = {
    notion: {
        token: String(import.meta.env.VITE_NOTION_TOKEN || process['env']['NOTION_TOKEN'] )
    },
    baseUrl: String(import.meta.env.VITE_APP_URL || process['env']['APP_URL'] || ''),
}
