import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';

export default [
	...[configWithoutCloudSupport].flat(),
	{
		// The Leanroute Chat Model plugs into the AI Agent's model input, which
		// expects a LangChain chat model, so @langchain/openai has to ship as a
		// runtime dependency. This package is self-hosted only for that reason
		// (cloud support is disabled above); see README.
		files: ['package.json'],
		rules: {
			'@n8n/community-nodes/no-runtime-dependencies': 'off',
		},
	},
];
