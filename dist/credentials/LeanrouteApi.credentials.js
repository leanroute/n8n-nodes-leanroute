"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeanrouteApi = void 0;
class LeanrouteApi {
    constructor() {
        this.name = 'leanrouteApi';
        this.displayName = 'Leanroute API';
        this.documentationUrl = 'https://leanroute.dev/docs/api';
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
                description: 'Your Leanroute API Key starting with gw_live_* from https://leanroute.dev',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.leanroute.dev/v1',
                required: true,
                description: 'The Leanroute OpenAI-compatible API gateway endpoint',
            },
        ];
    }
}
exports.LeanrouteApi = LeanrouteApi;
