import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LeanrouteApi implements ICredentialType {
  name = 'leanrouteApi';
  displayName = 'Leanroute API';
  documentationUrl = 'https://leanroute.dev/docs/api';

  properties: INodeProperties[] = [
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
