import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class LeanrouteApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        readonly light: "file:leanroute.svg";
        readonly dark: "file:leanroute.dark.svg";
    };
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
