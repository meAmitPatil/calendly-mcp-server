#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { CalendlyConfig } from './types.js';
import { CalendlyClient } from './calendly-client.js';
import { OAuthTools } from './tools/oauth-tools.js';
import { ApiTools } from './tools/api-tools.js';
import { oauthToolDefinitions, apiToolDefinitions } from './tools/tool-definitions.js';

class CalendlyMCPServer {
  private server: Server;
  private config: CalendlyConfig;
  private client: CalendlyClient;
  private oauthTools: OAuthTools;
  private apiTools: ApiTools;

  constructor() {
    this.config = {
      apiKey: process.env.CALENDLY_API_KEY,
      accessToken: process.env.CALENDLY_ACCESS_TOKEN,
      refreshToken: process.env.CALENDLY_REFRESH_TOKEN,
      clientId: process.env.CALENDLY_CLIENT_ID,
      clientSecret: process.env.CALENDLY_CLIENT_SECRET,
      baseUrl: 'https://api.calendly.com',
      authUrl: 'https://auth.calendly.com'
    };

    this.client = new CalendlyClient(this.config);
    this.oauthTools = new OAuthTools(this.client);
    this.apiTools = new ApiTools(this.client);

    this.server = new Server(
      {
        name: 'calendly-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...oauthToolDefinitions,
          ...apiToolDefinitions,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;
        switch (name) {
          // OAuth Tools
          case 'get_oauth_url':
            result = await this.oauthTools.getOAuthUrl(args?.redirect_uri as string, args?.state as string);
            break;
          case 'exchange_code_for_tokens':
            result = await this.oauthTools.exchangeCodeForTokens(args?.code as string, args?.redirect_uri as string);
            break;
          case 'refresh_access_token':
            result = await this.oauthTools.refreshAccessToken(args?.refresh_token as string);
            break;
          
          // API Tools
          case 'get_current_user':
            result = await this.apiTools.getCurrentUser();
            break;
          case 'list_events':
            result = await this.apiTools.listEvents(args);
            break;
          case 'get_event':
            result = await this.apiTools.getEvent(args?.event_uuid as string);
            break;
          case 'list_event_invitees':
            result = await this.apiTools.listEventInvitees(args?.event_uuid as string, args);
            break;
          case 'cancel_event':
            result = await this.apiTools.cancelEvent(args?.event_uuid as string, args?.reason as string);
            break;
          case 'list_organization_memberships':
            result = await this.apiTools.listOrganizationMemberships(args);
            break;
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        
        return result;
      } catch (error) {
        throw new Error(`Calendly API error: ${error}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Calendly MCP server running on stdio');
  }
}

const server = new CalendlyMCPServer();
server.run().catch(console.error);