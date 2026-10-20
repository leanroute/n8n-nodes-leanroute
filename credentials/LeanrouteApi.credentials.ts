import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LeanrouteApi implements ICredentialType {
	name = 'leanrouteApi';

	displayName = 'Leanroute API';

	icon = { light: 'file:leanroute.svg', dark: 'file:leanroute.dark.svg' } as const;

	documentationUrl = 'https://leanroute.dev/docs/integrations/n8n';

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

	// Sends the key as a Bearer token on every request made with
	// httpRequestWithAuthentication.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// "Test" button in the credential dialog: lists the models the key can reach.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/models',
		},
	};
}
