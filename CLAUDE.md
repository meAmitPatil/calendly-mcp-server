# Calendly MCP Server

## Common Commands
- `npm run build`: Build TypeScript to JavaScript
- `npm run dev`: Run in development mode with tsx
- `npm start`: Run the built server
- `npm install`: Install dependencies

## Testing the Server
- Use MCP Inspector: `npx @modelcontextprotocol/inspector node dist/index.js`
- Test with Claude Desktop: Add to config file
- Direct testing: `node dist/index.js` (requires MCP client)

## Project Structure
```
src/
├── index.ts                    # Main MCP server entry point
├── types.ts                    # TypeScript interfaces and types
├── calendly-client.ts          # Calendly API client class
└── tools/
    ├── oauth-tools.ts          # OAuth authentication tools
    ├── api-tools.ts            # Calendly API tools
    ├── scheduling-tools.ts     # Scheduling API tools
    └── tool-definitions.ts     # MCP tool schema definitions
```

## Code Style
- Use ES modules (import/export), not CommonJS
- Use TypeScript with strict type checking
- Use `as const` for literal types in MCP responses
- Destructure imports when possible
- Keep tool classes focused on single responsibility

## Environment Variables

### Calendly API (Required)
- `CALENDLY_API_KEY`: Personal Access Token (for simple auth)
- `CALENDLY_CLIENT_ID` + `CALENDLY_CLIENT_SECRET`: OAuth credentials
- `CALENDLY_ACCESS_TOKEN` + `CALENDLY_REFRESH_TOKEN`: OAuth tokens

### Calendly Optional (Recommended)
- `CALENDLY_USER_URI`: User URI for automatic defaults (e.g., `https://api.calendly.com/users/your_user_id`)
- `CALENDLY_ORGANIZATION_URI`: Organization URI for automatic defaults


## Development Workflow
1. Make changes to TypeScript files in `src/`
2. Run `npm run build` to compile
3. Test with MCP Inspector or Claude Desktop
4. **IMPORTANT**: Always test authentication before committing
5. Run `npm run build` again if there are TypeScript errors
6. Use conventional commit messages (see Git Guidelines below)

## Git Guidelines (Conventional Commits)
Use this format: `<type>[optional scope]: <description>`

**Types:**
- `feat:` - New features
- `fix:` - Bug fixes  
- `docs:` - Documentation only
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance (dependencies, build, etc.)
- `style:` - Code formatting
- `ci:` - CI/CD changes

**Examples:**
- `feat: add event cancellation support`
- `fix: handle OAuth token expiration`
- `docs: update API authentication guide`
- `refactor: extract tool definitions to separate file`
- `test: add integration tests for OAuth flow`
- `chore: update dependencies to latest versions`

**Breaking Changes:** Add `!` after type: `feat!: redesign authentication API`

**IMPORTANT:** 
- Do NOT include "Co-Authored-By: Claude" in commit messages
- Do NOT include "🤖 Generated with [Claude Code]" footer in commit messages
- Keep commit messages clean and professional

## MCP Server Details
- **Transport**: STDIO (communicates via stdin/stdout)
- **Tools Available**: 12 total (3 OAuth + 6 API + 3 Scheduling tools)
- **Authentication**: Supports both Personal Access Tokens and OAuth 2.0
- **Scheduling API**: Direct meeting booking with paid Calendly plans
- **Error Handling**: Wraps Calendly API errors in MCP error format

## Calendly API Limitations
- Scheduling API requires paid Calendly plan (Standard or higher)
- Cannot reschedule events (only cancel)
- Cannot create new event types via API
- Access tokens expire after 2 hours (use refresh tokens)

## Available Tools (12 Total)

### OAuth Tools (3)
- `get_oauth_url` - Generate OAuth authorization URLs
- `exchange_code_for_tokens` - Exchange auth codes for access tokens
- `refresh_access_token` - Refresh expired access tokens

### API Tools (6)
- `get_current_user` - Get authenticated user information
- `list_events` - List scheduled events with filtering options
- `get_event` - Get detailed information about specific events
- `list_event_invitees` - List invitees for specific events
- `cancel_event` - Cancel scheduled events
- `list_organization_memberships` - List organization memberships

### Scheduling Tools (3) - **NEW!**
- `list_event_types` - List available event types for scheduling
- `get_event_type_availability` - Get available time slots for event types
- `schedule_event` - Book meetings directly (requires paid plan)

## Scheduling API Features
- **Direct Meeting Booking**: Schedule meetings programmatically without redirects
- **Real-Time Availability**: Check available time slots for any event type
- **Complete Integration**: Calendar sync, notifications, and management links
- **Location Support**: Zoom, Google Meet, Teams, physical locations
- **Paid Plan Requirement**: Standard or higher Calendly subscription needed

## Example Scheduling Workflows

### Check Event Types and Schedule
```
# List available event types
list_event_types

# Check availability for specific event type
get_event_type_availability event_type="https://api.calendly.com/event_types/ABC123"

# Schedule a meeting
schedule_event event_type="https://api.calendly.com/event_types/ABC123" start_time="2025-10-21T19:00:00Z" invitee_email="client@company.com" invitee_name="John Smith" invitee_timezone="America/New_York"
```

## Common Issues
- **"No authentication token available"**: Set `CALENDLY_API_KEY` environment variable
- **400 errors on `list_events`**: Set `CALENDLY_USER_URI` environment variable or provide `user_uri` parameter
- **403 Forbidden on `schedule_event`**: Requires paid Calendly plan (Standard or higher)
- **TypeScript errors**: Check that all imports use `.js` extensions
- **404 errors**: Verify event UUIDs exist (use `list_events` first)
- **Permission errors**: Ensure API key has correct permissions
- **Invalid time slot**: Use `get_event_type_availability` to verify availability first

## When Adding New Tools
1. Add to `tool-definitions.ts` with proper schema
2. Add method to appropriate tool class (`oauth-tools.ts`, `api-tools.ts`, or `scheduling-tools.ts`)
3. Add case to switch statement in `index.ts`
4. Update README with new tool documentation
5. Test thoroughly with MCP Inspector