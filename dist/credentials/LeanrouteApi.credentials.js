"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeanrouteApi = void 0;
class LeanrouteApi {
    constructor() {
        this.name = 'leanrouteApi';
        this.displayName = 'Leanroute API';
        this.icon = { light: 'file:leanroute.svg', dark: 'file:leanroute.dark.svg' };
        this.documentationUrl = 'https://leanroute.dev/docs/integrations/n8n';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your Leanroute API key (starts with gw_live_), from https://leanroute.dev/dashboard/keys',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.leanroute.dev/v1',
                required: true,
                description: 'The Leanroute OpenAI-compatible API endpoint',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/models',
            },
        };
    }
}
exports.LeanrouteApi = LeanrouteApi;
//# sourceMappingURL=LeanrouteApi.credentials.js.map