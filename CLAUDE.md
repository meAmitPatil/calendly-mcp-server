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

### Email Integration (Optional - for booking invitations)
**Choose ONE email provider:**

**Option 1: SendGrid**
- `EMAIL_PROVIDER=sendgrid`
- `SENDGRID_API_KEY`: Your SendGrid API key
- `FROM_EMAIL`: Email address to send from (must be verified in SendGrid)
- `FROM_NAME`: Display name for sender (e.g., "Amit Patil")

**Option 2: Resend**
- `EMAIL_PROVIDER=resend`
- `RESEND_API_KEY`: Your Resend API key
- `FROM_EMAIL`: Email address to send from (must be verified in Resend)
- `FROM_NAME`: Display name for sender

**Option 3: SMTP/Nodemailer (Gmail, Outlook, etc.)**
- `EMAIL_PROVIDER=nodemailer`
- `SMTP_HOST`: SMTP server (e.g., smtp.gmail.com)
- `SMTP_PORT`: SMTP port (usually 587 or 465)
- `SMTP_SECURE=false`: Use TLS (true for port 465, false for 587)
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app-specific password
- `FROM_EMAIL`: Same as SMTP_USER
- `FROM_NAME`: Display name for sender

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
- **Tools Available**: 11 total (3 OAuth + 6 API + 2 Email tools)
- **Authentication**: Supports both Personal Access Tokens and OAuth 2.0
- **Email Integration**: Supports SendGrid, Resend, and SMTP providers
- **Error Handling**: Wraps Calendly API errors in MCP error format

## Calendly API Limitations
- Cannot create new events via API (use embed options)
- Cannot reschedule events (only cancel)
- Some endpoints require paid Calendly subscriptions
- Access tokens expire after 2 hours (use refresh tokens)

## Available Tools (11 Total)

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

### Email Tools (2) - **NEW!**
- `send_booking_invitation` - Send professional booking invitation emails
- `create_and_invite_workflow` - **Complete end-to-end automation:** Create event type + generate booking link + send email invitation

## Email Integration Features
- **Multiple Providers**: SendGrid, Resend, SMTP/Nodemailer support
- **Professional Templates**: Beautiful HTML emails with branding
- **Automatic Personalization**: Host details, meeting info, booking links
- **Error Handling**: Graceful fallback when email not configured
- **Production Ready**: Supports transactional email best practices

## Example Email Workflows

### Create and Invite (Most Popular)
```
create_and_invite_workflow event_name="Client Consultation" duration=60 availability_days=["Monday","Wednesday","Friday"] invitee_email="client@company.com" custom_message="Looking forward to discussing your project needs!"
```

### Send Standalone Invitation
```
send_booking_invitation to_email="prospect@startup.com" event_name="Strategy Session" event_duration=45 available_days=["Tuesday","Thursday"] booking_link="https://calendly.com/amit/strategy"
```

## Common Issues
- **"No authentication token available"**: Set `CALENDLY_API_KEY` environment variable
- **400 errors on `list_events`**: Set `CALENDLY_USER_URI` environment variable or provide `user_uri` parameter
- **"Email functionality not configured"**: Set email provider environment variables (see Email Integration section above)
- **TypeScript errors**: Check that all imports use `.js` extensions
- **404 errors**: Verify event UUIDs exist (use `list_events` first)
- **Permission errors**: Ensure API key has correct permissions
- **Email delivery issues**: Check API keys, sender verification, and rate limits

## When Adding New Tools
1. Add to `tool-definitions.ts` with proper schema
2. Add method to appropriate tool class (`oauth-tools.ts` or `api-tools.ts`)
3. Add case to switch statement in `index.ts`
4. Update README with new tool documentation
5. Test thoroughly with MCP Inspector