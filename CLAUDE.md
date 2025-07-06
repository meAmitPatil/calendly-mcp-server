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
Required for testing:
- `CALENDLY_API_KEY`: Personal Access Token (for simple auth)
- `CALENDLY_CLIENT_ID` + `CALENDLY_CLIENT_SECRET`: OAuth credentials
- `CALENDLY_ACCESS_TOKEN` + `CALENDLY_REFRESH_TOKEN`: OAuth tokens

## Development Workflow
1. Make changes to TypeScript files in `src/`
2. Run `npm run build` to compile
3. Test with MCP Inspector or Claude Desktop
4. **IMPORTANT**: Always test authentication before committing
5. Run `npm run build` again if there are TypeScript errors

## MCP Server Details
- **Transport**: STDIO (communicates via stdin/stdout)
- **Tools Available**: 9 total (3 OAuth + 6 API tools)
- **Authentication**: Supports both Personal Access Tokens and OAuth 2.0
- **Error Handling**: Wraps Calendly API errors in MCP error format

## Calendly API Limitations
- Cannot create new events via API (use embed options)
- Cannot reschedule events (only cancel)
- Some endpoints require paid Calendly subscriptions
- Access tokens expire after 2 hours (use refresh tokens)

## Common Issues
- **"No authentication token available"**: Set `CALENDLY_API_KEY` environment variable
- **TypeScript errors**: Check that all imports use `.js` extensions
- **404 errors**: Verify event UUIDs exist (use `list_events` first)
- **Permission errors**: Ensure API key has correct permissions

## When Adding New Tools
1. Add to `tool-definitions.ts` with proper schema
2. Add method to appropriate tool class (`oauth-tools.ts` or `api-tools.ts`)
3. Add case to switch statement in `index.ts`
4. Update README with new tool documentation
5. Test thoroughly with MCP Inspector