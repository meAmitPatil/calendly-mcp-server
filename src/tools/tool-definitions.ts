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

export const schedulingToolDefinitions = [
  {
    name: 'list_event_types',
    description: 'List available event types for scheduling meetings',
    inputSchema: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
          description: 'URI of the user whose event types to list',
        },
        organization: {
          type: 'string',
          description: 'URI of the organization to filter event types',
        },
        count: {
          type: 'number',
          description: 'Number of event types to return (default 20, max 100)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_event_type_availability',
    description: 'Get available time slots for a specific event type',
    inputSchema: {
      type: 'object',
      properties: {
        event_type: {
          type: 'string',
          description: 'URI of the event type to check availability for',
        },
        start_time: {
          type: 'string',
          description: 'Start time for availability window (ISO 8601 format)',
        },
        end_time: {
          type: 'string',
          description: 'End time for availability window (ISO 8601 format)',
        },
      },
      required: ['event_type'],
    },
  },
  {
    name: 'schedule_event',
    description: 'Schedule a meeting by creating an invitee for a specific event type and time',
    inputSchema: {
      type: 'object',
      properties: {
        event_type: {
          type: 'string',
          description: 'URI of the event type to schedule',
        },
        start_time: {
          type: 'string',
          description: 'Start time for the event (ISO 8601 UTC format, e.g., 2025-10-02T18:30:00Z)',
        },
        invitee_name: {
          type: 'string',
          description: 'Full name of the invitee (alternative to first_name/last_name)',
        },
        invitee_first_name: {
          type: 'string',
          description: 'First name of the invitee',
        },
        invitee_last_name: {
          type: 'string',
          description: 'Last name of the invitee',
        },
        invitee_email: {
          type: 'string',
          description: 'Email address of the invitee',
        },
        invitee_timezone: {
          type: 'string',
          description: 'Timezone of the invitee (e.g., America/New_York)',
        },
        invitee_phone: {
          type: 'string',
          description: 'Phone number for SMS reminders (E.164 format, e.g., +14155551234)',
        },
        location_kind: {
          type: 'string',
          description: 'Type of meeting location (e.g., zoom_conference, google_conference, physical, ask_invitee)',
        },
        location_details: {
          type: 'string',
          description: 'Location details (required for physical meetings or custom locations)',
        },
        event_guests: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of additional email addresses to include (max 10)',
        },
        questions_and_answers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The question text (must match exactly)',
              },
              answer: {
                type: 'string',
                description: 'The answer to the question',
              },
              position: {
                type: 'number',
                description: 'Position of the question',
              },
            },
            required: ['question', 'answer', 'position'],
          },
          description: 'Array of question and answer pairs for booking form',
        },
        utm_source: {
          type: 'string',
          description: 'UTM tracking parameter for source',
        },
        utm_campaign: {
          type: 'string',
          description: 'UTM tracking parameter for campaign',
        },
        utm_medium: {
          type: 'string',
          description: 'UTM tracking parameter for medium',
        },
      },
      required: ['event_type', 'start_time', 'invitee_email', 'invitee_timezone'],
    },
  },
];

