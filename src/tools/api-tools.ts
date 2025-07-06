import { CalendlyClient } from '../calendly-client.js';
import { ListEventsParams, ListEventInviteesParams, ListOrganizationMembershipsParams } from '../types.js';

export class ApiTools {
  constructor(private client: CalendlyClient) {}

  async getCurrentUser() {
    const data = await this.client.getCurrentUser();
    return {
      content: [
        {
          type: 'text' as const,
          text: `Current User Information:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async listEvents(params: ListEventsParams = {}) {
    const data = await this.client.listEvents(params);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Scheduled Events:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async getEvent(eventUuid: string) {
    const data = await this.client.getEvent(eventUuid);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Event Details:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async listEventInvitees(eventUuid: string, params: Omit<ListEventInviteesParams, 'event_uuid'> = {}) {
    const data = await this.client.listEventInvitees({ ...params, event_uuid: eventUuid });
    return {
      content: [
        {
          type: 'text' as const,
          text: `Event Invitees:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async cancelEvent(eventUuid: string, reason?: string) {
    const data = await this.client.cancelEvent(eventUuid, reason);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Event Canceled:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async listOrganizationMemberships(params: ListOrganizationMembershipsParams = {}) {
    const data = await this.client.listOrganizationMemberships(params);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Organization Memberships:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }
}