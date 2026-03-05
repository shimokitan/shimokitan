# Neon MCP & CLI Authentication Guide

This document tracks how to manage and troubleshoot authentication for Neon database tools in this environment.

## 1. Neon MCP Server (IDE/Cursor/Claude)
The Neon MCP server uses OAuth tokens to authenticate with your Neon account. even if you uninstall the server, these tokens persist in your local profile.

### How to Logout / Force Re-authentication
To completely clear the MCP server's session, delete the hidden authentication cache directory:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force "$HOME\.mcp-auth"
```

**Location:** `C:\Users\<YourUser>\.mcp-auth\`

---

## 2. Neon CLI (`neonctl`)
The Neon CLI stores credentials in a separate configuration folder.

### How to Logout
To logout of the CLI tool, delete its local credentials file:

**Windows (PowerShell):**
```powershell
Remove-Item "$HOME\.config\neonctl\credentials.json"
```

**Location:** `C:\Users\<YourUser>\.config\neonctl\credentials.json`

---

## 3. Revoking Access via Neon Console
If you think your credentials have been compromised or want to revoke access globally:

1. **API Keys:** Go to [Project Settings > API Keys](https://console.neon.tech/app/settings/api-keys).
2. **Authorized Applications (OAuth):** Check the "Authorized Applications" section (if available) to revoke tokens used by the MCP server.
3. **Check .env files:** Ensure no `NEON_API_KEY` or `DATABASE_URL` is leaked in `.env.local` or other local environment files.

---

## Troubleshooting
- **Still Logged In?** If you deleted the items above and are STILL logged in, check if `NEON_API_KEY` is set as a System Environment Variable in Windows.
- **MCP Server Not Found:** If you get a 'server not found' error, ensure the MCP server is installed and enabled in your IDE settings.
