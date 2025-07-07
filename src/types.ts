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