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
  email?: EmailConfig;
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

// Email Configuration Types
export interface EmailConfig {
  provider: 'sendgrid' | 'resend' | 'nodemailer';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  smtpConfig?: NodemailerConfig;
}

export interface NodemailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailInvitation {
  to_email: string;
  to_name?: string;
  subject: string;
  event_name: string;
  event_duration: number;
  available_days: string[];
  booking_link: string;
  custom_message?: string;
  host_name: string;
  host_email: string;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface CreateAndInviteParams {
  event_name: string;
  event_description?: string;
  duration: number;
  availability_days: string[];
  time_slots?: string[];
  invitee_email: string;
  invitee_name?: string;
  custom_message?: string;
}