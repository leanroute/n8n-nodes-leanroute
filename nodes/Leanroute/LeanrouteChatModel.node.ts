import type {
  INodeType,
  INodeTypeDescription,
  ISupplyDataFunctions,
  SupplyData,
  NodeConnectionType,
} from 'n8n-workflow';
import { ChatOpenAI } from '@langchain/openai';

export class LeanrouteChatModel implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Leanroute Chat Model',
    name: 'leanrouteChatModel',
    icon: 'file:leanroute.png',
    group: ['transform'],
    version: 1,
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
    outputs: ['ai_languageModel' as unknown as NodeConnectionType],
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
            name: 'DeepSeek V4.1 Flash (Fast & Cheap)',
            value: 'deepseek/deepseek-v4-1-flash',
          },
          {
            name: 'DeepSeek Reasoner (Math & Reasoning)',
            value: 'deepseek/deepseek-reasoner',
          },
          {
            name: 'Claude 3.5 Sonnet (Anthropic)',
            value: 'anthropic/claude-sonnet-4-6',
          },
          {
            name: 'GPT-4o Mini (OpenAI)',
            value: 'openai/gpt-4o-mini',
          },
          {
            name: 'GPT-4o (OpenAI Flagship)',
            value: 'openai/gpt-4o',
          },
          {
            name: 'Gemini 2.5 Flash (Google)',
            value: 'google/gemini-2.5-flash',
          },
          {
            name: 'Qwen Plus (Alibaba)',
            value: 'qwen/qwen-plus',
          },
          {
            name: 'Custom Model ID (provider/model)',
            value: 'custom',
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
        placeholder: 'e.g. meta/muse-spark-1.2',
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
            description: 'Maximum tokens to generate.',
          },
          {
            displayName: 'Disable Gateway Model Swaps',
            name: 'explicitRouting',
            type: 'boolean',
            default: false,
            description: 'If enabled, sends x-gateway-routing: explicit to prevent cheaper-model substitutions.',
          },
        ],
      },
    ],
  };

  async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
    const credentials = await this.getCredentials('leanrouteApi');
    const modelSelection = this.getNodeParameter('model', itemIndex) as string;
    const customModel = this.getNodeParameter('customModel', itemIndex, '') as string;
    const options = this.getNodeParameter('options', itemIndex, {}) as {
      temperature?: number;
      maxTokens?: number;
      explicitRouting?: boolean;
    };

    const modelName = modelSelection === 'custom' ? customModel : modelSelection;

    const customHeaders: Record<string, string> = {};
    if (options.explicitRouting) {
      customHeaders['x-gateway-routing'] = 'explicit';
    }

    const model = new ChatOpenAI({
      apiKey: credentials.apiKey as string,
      configuration: {
        baseURL: (credentials.baseUrl as string) || 'https://api.leanroute.dev/v1',
        defaultHeaders: customHeaders,
      },
      modelName,
      temperature: options.temperature ?? 0.7,
      maxTokens: options.maxTokens,
    });

    return {
      response: model,
    };
  }
}
