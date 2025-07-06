export const oauthToolDefinitions = [
  {
    name: 'get_oauth_url',
    description: 'Generate OAuth authorization URL for user authentication',
    inputSchema: {
      type: 'object',
      properties: {
        redirect_uri: {
          type: 'string',
          description: 'The redirect URI for your OAuth application',
        },
        state: {
          type: 'string',
          description: 'Optional state parameter for security',
        },
      },
      required: ['redirect_uri'],
    },
  },
  {
    name: 'exchange_code_for_tokens',
    description: 'Exchange authorization code for access and refresh tokens',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The authorization code from OAuth callback',
        },
        redirect_uri: {
          type: 'string',
          description: 'The redirect URI used in authorization',
        },
      },
      required: ['code', 'redirect_uri'],
    },
  },
  {
    name: 'refresh_access_token',
    description: 'Refresh access token using refresh token',
    inputSchema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description: 'The refresh token to use',
        },
      },
      required: ['refresh_token'],
    },
  },
];

export const apiToolDefinitions = [
  {
    name: 'get_current_user',
    description: 'Get the current authenticated user information',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_events',
    description: 'List scheduled events for the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        user_uri: {
          type: 'string',
          description: 'URI of the user whose events to list',
        },
        organization_uri: {
          type: 'string',
          description: 'URI of the organization to filter events',
        },
        status: {
          type: 'string',
          enum: ['active', 'canceled'],
          description: 'Filter events by status',
        },
        max_start_time: {
          type: 'string',
          description: 'Maximum start time for events (ISO 8601 format)',
        },
        min_start_time: {
          type: 'string',
          description: 'Minimum start time for events (ISO 8601 format)',
        },
        count: {
          type: 'number',
          description: 'Number of events to return (default 20, max 100)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_event',
    description: 'Get details of a specific event',
    inputSchema: {
      type: 'object',
      properties: {
        event_uuid: {
          type: 'string',
          description: 'UUID of the event to retrieve',
        },
      },
      required: ['event_uuid'],
    },
  },
  {
    name: 'list_event_invitees',
    description: 'List invitees for a specific event',
    inputSchema: {
      type: 'object',
      properties: {
        event_uuid: {
          type: 'string',
          description: 'UUID of the event',
        },
        status: {
          type: 'string',
          enum: ['active', 'canceled'],
          description: 'Filter invitees by status',
        },
        email: {
          type: 'string',
          description: 'Filter invitees by email',
        },
        count: {
          type: 'number',
          description: 'Number of invitees to return (default 20, max 100)',
        },
      },
      required: ['event_uuid'],
    },
  },
  {
    name: 'cancel_event',
    description: 'Cancel a specific event',
    inputSchema: {
      type: 'object',
      properties: {
        event_uuid: {
          type: 'string',
          description: 'UUID of the event to cancel',
        },
        reason: {
          type: 'string',
          description: 'Reason for cancellation',
        },
      },
      required: ['event_uuid'],
    },
  },
  {
    name: 'list_organization_memberships',
    description: 'List organization memberships for the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        user_uri: {
          type: 'string',
          description: 'URI of the user',
        },
        organization_uri: {
          type: 'string',
          description: 'URI of the organization',
        },
        email: {
          type: 'string',
          description: 'Filter by email',
        },
        count: {
          type: 'number',
          description: 'Number of memberships to return (default 20, max 100)',
        },
      },
      required: [],
    },
  },
];