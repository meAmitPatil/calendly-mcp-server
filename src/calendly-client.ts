import axios from 'axios';
import { CalendlyConfig, OAuthTokenResponse, ListEventsParams, ListEventInviteesParams, ListOrganizationMembershipsParams, MCPToolResponse, EventTypeAvailabilityParams, ScheduleEventParams } from './types.js';

export class CalendlyClient {
  private config: CalendlyConfig;

  constructor(config: CalendlyConfig) {
    this.config = config;
  }

  private getAuthToken(): string {
    if (this.config.accessToken) {
      return this.config.accessToken;
    }
    if (this.config.apiKey) {
      return this.config.apiKey;
    }
    throw new Error('No authentication token available. Set CALENDLY_API_KEY or CALENDLY_ACCESS_TOKEN environment variable.');
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const token = this.getAuthToken();
    const response = await axios({
      method,
      url: `${this.config.baseUrl}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    });

    return response.data;
  }

  async getCurrentUser(): Promise<any> {
    return await this.makeRequest('/users/me');
  }

  async listEvents(params: ListEventsParams): Promise<any> {
    const urlParams = new URLSearchParams();
    
    // Use provided user_uri or fall back to config default
    const userUri = params.user_uri || this.config.userUri;
    if (userUri) urlParams.append('user', userUri);
    
    if (params.organization_uri) urlParams.append('organization', params.organization_uri);
    if (params.status) urlParams.append('status', params.status);
    if (params.max_start_time) urlParams.append('max_start_time', params.max_start_time);
    if (params.min_start_time) urlParams.append('min_start_time', params.min_start_time);
    if (params.count) urlParams.append('count', params.count.toString());

    return await this.makeRequest(`/scheduled_events?${urlParams.toString()}`);
  }

  async getEvent(eventUuid: string): Promise<any> {
    return await this.makeRequest(`/scheduled_events/${eventUuid}`);
  }

  async listEventInvitees(params: ListEventInviteesParams): Promise<any> {
    const urlParams = new URLSearchParams();
    
    if (params.status) urlParams.append('status', params.status);
    if (params.email) urlParams.append('email', params.email);
    if (params.count) urlParams.append('count', params.count.toString());

    return await this.makeRequest(`/scheduled_events/${params.event_uuid}/invitees?${urlParams.toString()}`);
  }

  async cancelEvent(eventUuid: string, reason?: string): Promise<any> {
    return await this.makeRequest(`/scheduled_events/${eventUuid}/cancellation`, 'POST', {
      reason: reason || 'Canceled via API'
    });
  }

  async listOrganizationMemberships(params: ListOrganizationMembershipsParams): Promise<any> {
    const urlParams = new URLSearchParams();
    
    // Use provided user_uri or fall back to config default
    const userUri = params.user_uri || this.config.userUri;
    if (userUri) urlParams.append('user', userUri);
    
    if (params.organization_uri) urlParams.append('organization', params.organization_uri);
    if (params.email) urlParams.append('email', params.email);
    if (params.count) urlParams.append('count', params.count.toString());

    return await this.makeRequest(`/organization_memberships?${urlParams.toString()}`);
  }

  async getOAuthUrl(redirectUri: string, state?: string): Promise<string> {
    if (!this.config.clientId) {
      throw new Error('CALENDLY_CLIENT_ID environment variable is required for OAuth');
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
    });

    if (state) {
      params.append('state', state);
    }

    return `${this.config.authUrl}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<OAuthTokenResponse> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('CALENDLY_CLIENT_ID and CALENDLY_CLIENT_SECRET environment variables are required for OAuth');
    }

    const response = await axios({
      method: 'POST',
      url: `${this.config.authUrl}/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
      },
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData: OAuthTokenResponse = response.data;
    
    // Update internal config with new tokens
    this.config.accessToken = tokenData.access_token;
    this.config.refreshToken = tokenData.refresh_token;

    return tokenData;
  }

  async refreshAccessToken(refreshToken?: string): Promise<OAuthTokenResponse> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('CALENDLY_CLIENT_ID and CALENDLY_CLIENT_SECRET environment variables are required for OAuth');
    }

    const tokenToUse = refreshToken || this.config.refreshToken;
    if (!tokenToUse) {
      throw new Error('No refresh token available');
    }

    const response = await axios({
      method: 'POST',
      url: `${this.config.authUrl}/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
      },
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenToUse,
      }),
    });

    const tokenData: OAuthTokenResponse = response.data;
    
    // Update internal config with new tokens
    this.config.accessToken = tokenData.access_token;
    this.config.refreshToken = tokenData.refresh_token;

    return tokenData;
  }

  // Scheduling API Methods
  async listEventTypes(params?: { user?: string; organization?: string; count?: number }): Promise<any> {
    const urlParams = new URLSearchParams();
    
    // Use provided user or fall back to config default
    const userUri = params?.user || this.config.userUri;
    if (userUri) urlParams.append('user', userUri);
    
    if (params?.organization) urlParams.append('organization', params.organization);
    if (params?.count) urlParams.append('count', params.count.toString());

    return await this.makeRequest(`/event_types?${urlParams.toString()}`);
  }

  async getEventType(eventTypeUuid: string): Promise<any> {
    return await this.makeRequest(`/event_types/${eventTypeUuid}`);
  }

  async getEventTypeAvailability(params: EventTypeAvailabilityParams): Promise<any> {
    const urlParams = new URLSearchParams();
    urlParams.append('event_type', params.event_type);
    
    if (params.start_time) urlParams.append('start_time', params.start_time);
    if (params.end_time) urlParams.append('end_time', params.end_time);

    return await this.makeRequest(`/event_type_available_times?${urlParams.toString()}`);
  }

  async scheduleEvent(params: ScheduleEventParams): Promise<any> {
    try {
      return await this.makeRequest('/invitees', 'POST', params);
    } catch (error: any) {
      // Handle 403 error specifically for free plan users
      if (error.response?.status === 403) {
        throw new Error('Scheduling API requires a paid Calendly plan (Standard or higher). Please upgrade your Calendly subscription to access scheduling functionality.');
      }
      throw error;
    }
  }
}