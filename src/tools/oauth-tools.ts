import { CalendlyClient } from '../calendly-client.js';

export class OAuthTools {
  constructor(private client: CalendlyClient) {}

  async getOAuthUrl(redirectUri: string, state?: string) {
    const authUrl = await this.client.getOAuthUrl(redirectUri, state);

    return {
      content: [
        {
          type: 'text' as const,
          text: `OAuth Authorization URL:\n${authUrl}\n\nRedirect the user to this URL to begin the OAuth flow.`,
        },
      ],
    };
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const tokenData = await this.client.exchangeCodeForTokens(code, redirectUri);

    return {
      content: [
        {
          type: 'text' as const,
          text: `OAuth Tokens Retrieved:\n${JSON.stringify(tokenData, null, 2)}\n\nStore these tokens securely. The access token expires in ${tokenData.expires_in} seconds.`,
        },
      ],
    };
  }

  async refreshAccessToken(refreshToken?: string) {
    const tokenData = await this.client.refreshAccessToken(refreshToken);

    return {
      content: [
        {
          type: 'text' as const,
          text: `Access Token Refreshed:\n${JSON.stringify(tokenData, null, 2)}\n\nThe new access token expires in ${tokenData.expires_in} seconds.`,
        },
      ],
    };
  }
}