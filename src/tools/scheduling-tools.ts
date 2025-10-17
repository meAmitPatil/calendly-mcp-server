import { CalendlyClient } from '../calendly-client.js';
import { EventTypeAvailabilityParams, ScheduleEventParams } from '../types.js';

export class SchedulingTools {
  constructor(private client: CalendlyClient) {}

  async listEventTypes(params: { user?: string; organization?: string; count?: number } = {}) {
    const data = await this.client.listEventTypes(params);
    
    const eventTypes = data.collection || [];
    const formattedEventTypes = eventTypes.map((eventType: any) => ({
      uri: eventType.uri,
      name: eventType.name,
      duration: eventType.duration,
      description: eventType.description_plain || eventType.description_html,
      scheduling_url: eventType.scheduling_url,
      active: eventType.active,
      kind: eventType.kind,
      pooling_type: eventType.pooling_type,
    }));

    return {
      content: [
        {
          type: 'text' as const,
          text: `Available Event Types (${formattedEventTypes.length} found):

${formattedEventTypes.map((et: any, index: number) => 
  `${index + 1}. ${et.name} (${et.duration} minutes)
   - URI: ${et.uri}
   - Type: ${et.kind}
   - Status: ${et.active ? 'Active' : 'Inactive'}
   - Scheduling URL: ${et.scheduling_url}
   ${et.description ? `- Description: ${et.description}` : ''}`
).join('\n\n')}

${formattedEventTypes.length === 0 ? 
  'No event types found.' : 
  ''
}`,
        },
      ],
    };
  }

  async getEventTypeAvailability(params: EventTypeAvailabilityParams) {
    const data = await this.client.getEventTypeAvailability(params);
    
    const availableTimes = data.collection || [];
    const groupedByDate: { [date: string]: string[] } = {};
    
    availableTimes.forEach((slot: any) => {
      const startTime = new Date(slot.start_time);
      const date = startTime.toISOString().split('T')[0];
      const timeString = startTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      });
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(`${timeString} (${slot.start_time})`);
    });

    const formattedDates = Object.entries(groupedByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, times]) => {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        return `${formattedDate}:
${times.map(time => `  - ${time}`).join('\n')}`;
      })
      .join('\n\n');

    return {
      content: [
        {
          type: 'text' as const,
          text: `Available Time Slots for Event Type:

${availableTimes.length > 0 ? formattedDates : 'No available time slots found.'}

Total slots: ${availableTimes.length}`,
        },
      ],
    };
  }

  async scheduleEvent(params: any) {
    try {
      const scheduleParams: ScheduleEventParams = {
        event_type: params.event_type,
        start_time: params.start_time,
        invitee: {
          email: params.invitee_email,
          timezone: params.invitee_timezone,
        },
      };
      if (params.invitee_name) {
        scheduleParams.invitee.name = params.invitee_name;
      } else if (params.invitee_first_name || params.invitee_last_name) {
        scheduleParams.invitee.first_name = params.invitee_first_name;
        scheduleParams.invitee.last_name = params.invitee_last_name;
      }

      if (params.invitee_phone) {
        scheduleParams.invitee.text_reminder_number = params.invitee_phone;
      }

      if (params.location_kind) {
        scheduleParams.location = {
          kind: params.location_kind,
        };
        if (params.location_details) {
          scheduleParams.location.location = params.location_details;
        }
      }

      if (params.event_guests && params.event_guests.length > 0) {
        scheduleParams.event_guests = params.event_guests;
      }

      if (params.questions_and_answers && params.questions_and_answers.length > 0) {
        scheduleParams.questions_and_answers = params.questions_and_answers;
      }
      if (params.utm_source || params.utm_campaign || params.utm_medium) {
        scheduleParams.tracking = {
          utm_campaign: params.utm_campaign || null,
          utm_source: params.utm_source || null,
          utm_medium: params.utm_medium || null,
          utm_content: null,
          utm_term: null,
          salesforce_uuid: null,
        };
      }

      const result = await this.client.scheduleEvent(scheduleParams);
      const invitee = result.resource;

      const startTime = new Date(params.start_time);
      const formattedTime = startTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: `Meeting scheduled successfully.

Invitee: ${invitee.name} (${invitee.email})
Time: ${formattedTime}
Status: ${invitee.status}

Cancel: ${invitee.cancel_url}
Reschedule: ${invitee.reschedule_url}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Failed to schedule meeting.

Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  }
}