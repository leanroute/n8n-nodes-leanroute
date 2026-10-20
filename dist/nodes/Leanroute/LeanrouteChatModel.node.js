"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeanrouteChatModel = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const openai_1 = require("@langchain/openai");
class LeanrouteChatModel {
    constructor() {
        this.description = {
            displayName: 'Leanroute Chat Model',
            name: 'leanrouteChatModel',
            icon: { light: 'file:leanroute.svg', dark: 'file:leanroute.dark.svg' },
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["model"] === "custom" ? $parameter["customModel"] : $parameter["model"]}}',
            description: 'Use 100+ models with smart routing & caching in n8n AI Agents',
            defaults: {
                name: 'Leanroute Chat Model',
            },
            codex: {
                categories: ['AI'],
                subcategories: {
                    AI: ['Language Models'],
                },
            },
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.AiLanguageModel],
            outputNames: ['Model'],
            credentials: [
                {
                    name: 'leanrouteApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Model',
                    name: 'model',
                    type: 'options',
                    description: 'Choose a model or select custom to specify any model from the Leanroute catalog',
                    default: 'deepseek/deepseek-v4-1-flash',
                    options: [
                        {
                            name: 'Claude Sonnet 5 (Anthropic)',
                            value: 'anthropic/claude-sonnet-5',
                        },
                        {
                            name: 'Custom Model ID (Provider/Model)',
                            value: 'custom',
                        },
                        {
                            name: 'DeepSeek V4 Pro (DeepSeek)',
                            value: 'deepseek/deepseek-v4-pro',
                        },
                        {
                            name: 'DeepSeek V4.1 Flash (DeepSeek)',
                            value: 'deepseek/deepseek-v4-1-flash',
                        },
                        {
                            name: 'Gemini 3.8 Flash (Google)',
                            value: 'google/gemini-3.8-flash',
                        },
                        {
                            name: 'GPT-5.6 Luna (OpenAI)',
                            value: 'openai/gpt-5.6-luna',
                        },
                        {
                            name: 'GPT-5.6 Terra (OpenAI)',
                            value: 'openai/gpt-5.6-terra',
                        },
                        {
                            name: 'Qwen 3.8 Flash (Alibaba)',
                            value: 'qwen/qwen3.8-flash',
                        },
                    ],
                },
                {
                    displayName: 'Custom Model ID',
                    name: 'customModel',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            model: ['custom'],
                        },
                    },
                    placeholder: 'e.g. meta/muse-spark-1.3',
                    description: 'Canonical model ID with provider prefix from https://leanroute.dev/docs/models',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Temperature',
                            name: 'temperature',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                                maxValue: 2,
                                numberPrecision: 1,
                            },
                            default: 0.7,
                            description: 'Controls randomness. Lower values make responses more focused and deterministic.',
                        },
                        {
                            displayName: 'Max Tokens',
                            name: 'maxTokens',
                            type: 'number',
                            default: 4096,
                            description: 'Maximum tokens to generate',
                        },
                        {
                            displayName: 'Disable Gateway Model Swaps',
                            name: 'explicitRouting',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to send x-gateway-routing: explicit so the gateway never substitutes a cheaper model',
                        },
                    ],
                },
            ],
        };
    }
    async supplyData(itemIndex) {
        var _a;
        const credentials = await this.getCredentials('leanrouteApi');
        const modelSelection = this.getNodeParameter('model', itemIndex);
        const customModel = this.getNodeParameter('customModel', itemIndex, '');
        const options = this.getNodeParameter('options', itemIndex, {});
        const modelName = modelSelection === 'custom' ? customModel : modelSelection;
        const customHeaders = {};
        if (options.explicitRouting) {
            customHeaders['x-gateway-routing'] = 'explicit';
        }
        const model = new openai_1.ChatOpenAI({
            apiKey: credentials.apiKey,
            configuration: {
                baseURL: credentials.baseUrl || 'https://api.leanroute.dev/v1',
                defaultHeaders: customHeaders,
            },
            modelName,
            temperature: (_a = options.temperature) !== null && _a !== void 0 ? _a : 0.7,
            maxTokens: options.maxTokens,
        });
        return {
            response: model,
        };
    }
}
exports.LeanrouteChatModel = LeanrouteChatModel;
//# sourceMappingURL=LeanrouteChatModel.node.js.map