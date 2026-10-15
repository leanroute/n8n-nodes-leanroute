import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestMethods,
} from 'n8n-workflow';

export class Leanroute implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Leanroute',
    name: 'leanroute',
    icon: 'file:leanroute.svg',
    group: ['transform'],
    version: 1,
    description: 'Call 100+ LLMs with smart routing via Leanroute AI Gateway',
    defaults: {
      name: 'Leanroute',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'leanrouteApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Chat',
            value: 'chat',
          },
          {
            name: 'Model',
            value: 'model',
          },
        ],
        default: 'chat',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['chat'],
          },
        },
        options: [
          {
            name: 'Complete',
            value: 'complete',
            description: 'Generate chat completion',
            action: 'Complete a chat prompt',
          },
        ],
        default: 'complete',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['model'],
          },
        },
        options: [
          {
            name: 'Get Many',
            value: 'getAll',
            description: 'List all available models in the Leanroute catalog',
            action: 'List models',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'deepseek/deepseek-v4-1-flash',
        required: true,
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['complete'],
          },
        },
        description: 'Canonical model ID (e.g. deepseek/deepseek-v4-1-flash, anthropic/claude-sonnet-4-6)',
      },
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['complete'],
          },
        },
        description: 'Input prompt message to send to the model',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('leanrouteApi');
    const baseUrl = (credentials.baseUrl as string) || 'https://api.leanroute.dev/v1';

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      if (resource === 'chat' && operation === 'complete') {
        const model = this.getNodeParameter('model', i) as string;
        const prompt = this.getNodeParameter('prompt', i) as string;

        const response = await this.helpers.httpRequest({
          method: 'POST' as IHttpRequestMethods,
          url: `${baseUrl}/chat/completions`,
          headers: {
            Authorization: `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: {
            model,
            messages: [{ role: 'user', content: prompt }],
          },
          json: true,
        });

        returnData.push({ json: response });
      } else if (resource === 'model' && operation === 'getAll') {
        const response = await this.helpers.httpRequest({
          method: 'GET' as IHttpRequestMethods,
          url: `${baseUrl}/models`,
          headers: {
            Authorization: `Bearer ${credentials.apiKey}`,
          },
          json: true,
        });

        returnData.push({ json: response });
      }
    }

    return [returnData];
  }
}
