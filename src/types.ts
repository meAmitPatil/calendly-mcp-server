export interface CalendlyConfig {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  baseUrl: string;
  authUrl: string;
  userUri?: string;
  organizationUri?: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  created_at: number;
  scope: string;
  owner: string;
  organization: string;
}

export interface ListEventsParams {
  user_uri?: string;
  organization_uri?: string;
  status?: 'active' | 'canceled';
  max_start_time?: string;
  min_start_time?: string;
  count?: number;
}

export interface ListEventInviteesParams {
  event_uuid: string;
  status?: 'active' | 'canceled';
  email?: string;
  count?: number;
}

export interface ListOrganizationMembershipsParams {
  user_uri?: string;
  organization_uri?: string;
  email?: string;
  count?: number;
}

export interface MCPToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

// Scheduling API Types
export interface EventTypeAvailabilityParams {
  event_type: string;
  start_time?: string;
  end_time?: string;
}

export interface ScheduleEventParams {
  event_type: string;
  start_time: string;
  invitee: {
    name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    timezone: string;
    text_reminder_number?: string;
  };
  location?: {
    kind: string;
    location?: string;
  };
  questions_and_answers?: Array<{
    question: string;
    answer: string;
    position: number;
  }>;
  tracking?: {
    utm_campaign?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    salesforce_uuid?: string | null;
  };
  event_guests?: string[];
}