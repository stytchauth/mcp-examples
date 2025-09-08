# Stytch Connected Apps Examples

A comprehensive collection of example applications demonstrating how to integrate [Stytch](https://stytch.com/) authentication with various frameworks and build AI-accessible applications using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

## Overview

This repository contains examples for both **Consumer** and **B2B** authentication flows, with implementations across multiple frameworks and deployment platforms. Each example demonstrates how to build applications that can be extended for AI agent use through MCP integration.

## Repository Structure

```
connected-apps-examples
├── consumer-integrated         # Consumer auth with MCP integration
│   ├── tasklist-frontend       # React frontend (works with all backends)
│   ├── tasklist-python-fastmcp-backend
│   ├── tasklist-express-mcpsdk-backend
│   ├── tasklist-cfworkers-mcpsdk-backend
│   └── tasklist-nextjs-vercelsdk-fullstack
├── consumer-standalone         # Consumer auth without MCP
│   └── supabase-nextjs-user-management
├── b2b-integrated              # B2B auth with MCP integration
│   ├── okrmanager-frontend     # React frontend (works with all backends)
│   ├── okrmanager-python-fastmcp-backend
│   ├── okrmanager-express-mcpsdk-backend
│   ├── okrmanager-cfworkers-mcpsdk-backend
│   └── okrmanager-nextjs-vercelsdk-fullstack
└── b2b-standalone              # B2B auth without MCP
    └── firebase-express-access-management
```

## What's Included

### Consumer Authentication Examples

- **Task List Application** - A todo list application demonstrating Consumer auth
- **Frameworks**: React frontend with Python (FastMCP), Express.js, Cloudflare Workers, and Next.js backends
- **Features**: User registration, OAuth flows, task management, MCP integration

### B2B Authentication Examples

- **OKR Manager Application** - An objectives and key results management application
- **Frameworks**: React frontend with Python (FastMCP), Express.js, Cloudflare Workers, and Next.js backends
- **Features**: Organization management, team collaboration, goal tracking, MCP integration

### Standalone Examples

- Simple user management applications without MCP integration
- Demonstrates pure Stytch authentication flows

## Key Technologies

- **Authentication**: [Stytch Consumer](https://stytch.com/b2c) and [Stytch B2B](https://stytch.com/b2b)
- **AI Integration**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **Frameworks**: React, Next.js, Express.js, Python FastAPI, Cloudflare Workers
- **Platforms**: Vercel, Cloudflare, Supabase, Firebase

## Getting Started

### Prerequisites

1. Create a [Stytch account](https://stytch.com/)
2. Choose **Consumer Authentication** or **B2B Authentication** based on your needs
3. Enable [Connected Apps](https://stytch.com/dashboard/connected-apps) for MCP integration
4. Node.js 18+ and Yarn 3

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/stytchauth/mcp-examples.git
   cd mcp-examples
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Choose an example to run**

   For the Consumer Task List with Cloudflare Workers:

   ```bash
   cd consumer-integrated/tasklist-cfworkers-mcpsdk-backend
   ```

   For B2B OKR Manager with Next.js:

   ```bash
   cd b2b-integrated/okrmanager-nextjs-vercelsdk-fullstack
   ```

4. **Follow the setup instructions** in each example's README

## Development Commands

```bash
# Build all examples
yarn build

# Lint all examples
yarn lint

# Run a specific example
yarn workspace @mcp-examples/[example-name] dev
```

## MCP Integration

The integrated examples demonstrate how to:

- Expose application functionality through MCP tools
- Implement OAuth Protected Resource discovery
- Support multiple MCP transports (SSE, HTTP Streaming)
- Provide AI agents with authenticated access to user data

### Testing MCP Servers

```bash
# Install MCP Inspector
yarn dlx @modelcontextprotocol/inspector@latest

# Test any MCP-enabled backend
# Navigate to inspector URL and use: http://localhost:3001/mcp
```

## Authentication Flows

### Consumer Authentication

- **Use case**: Consumer-facing applications, personal productivity tools
- **Features**: Email/SMS auth, OAuth providers, guest users
- **Example**: Personal task management application

### B2B Authentication

- **Use case**: Business applications, team collaboration tools
- **Features**: Organization management, SSO, member invitations, RBAC
- **Example**: Team OKR management application

## Architecture Patterns

Each integrated example follows a consistent pattern:

- **Frontend**: React application with Stytch SDK integration
- **Backend**: REST API + MCP server with user-scoped data access
- **Authentication**: OAuth 2.0 with PKCE and JWT tokens
- **AI Integration**: MCP tools and resources for agent interaction

## Support and Documentation

- **Stytch Docs**: [https://stytch.com/docs](https://stytch.com/docs)
- **MCP Docs**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Community**: [Stytch Slack](https://stytch.com/docs/resources/support/overview)
- **Issues**: [GitHub Issues](https://github.com/stytchauth/connected-apps-examples/issues)

## Contributing

We welcome contributions! Please see individual example READMEs for specific setup instructions and contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
