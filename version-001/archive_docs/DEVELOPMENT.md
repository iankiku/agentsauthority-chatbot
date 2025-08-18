# Development Documentation

This document consolidates all development-related documentation for Agents Authority.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)

---

# Getting Started

This guide covers the development workflow for the Agents Authority project using our Makefile-based command system.

## 🚀 Quick Start

```bash
# Complete setup (first time)
make setup

# Start development
make dev
```

## 📋 Command Reference

### Essential Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make setup` | Complete project setup (first time) |
| `make dev` | Start all applications |
| `make info` | Show project status and URLs |

### Development Workflow

```bash
# 1. Initial setup (once)
make setup

# 2. Daily development
make dev-auth        # Start auth service (port 3003)
make dev-dashboard   # Start dashboard (port 3001) 
make dev-web         # Start web app (port 3000)

# 3. Code quality
make lint            # Check code style
make format          # Fix formatting
make test            # Run tests

# 4. Database operations
make db-migrate      # Apply schema changes
make db-studio       # Visual database editor
make db-seed         # Add sample data
```

## 🗄️ Database Workflow

### Schema Changes

1. **Edit schema**: Modify `packages/database/src/schema.ts`
2. **Generate migration**: `make db-migrate`
3. **Test changes**: `make db-studio`

### Common Database Tasks

```bash
# Check database status
make db-status

# Reset database (⚠️ destructive)
make db-reset

# Seed with sample data
make db-seed
```

## 🏗️ Project Structure

```
agentsauthority/
├── Makefile                    # Command orchestration
├── packages/database/          # Centralized database
│   ├── src/schema.ts          # Database schema
│   ├── src/queries.ts         # Common queries
│   └── drizzle.config.ts      # Drizzle configuration
├── apps/
│   ├── auth/                  # Authentication service
│   ├── dashboard/             # Main dashboard
│   └── web/                   # Marketing website
└── scripts/                   # Setup and utility scripts
    ├── initial-setup.sh       # Complete project setup
    ├── db-migrate.sh          # Database migrations
    └── check-make.sh          # Make availability check
```

## 🛠️ Make Installation

### macOS
```bash
# Using Homebrew
brew install make

# Or install Xcode Command Line Tools
xcode-select --install
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# CentOS/RHEL/Fedora
sudo dnf groupinstall 'Development Tools'
```

### Windows
```bash
# Using Chocolatey
choco install make

# Or use WSL
wsl --install
```

### Alternative (without make)
```bash
# Check if make is available
./scripts/check-make.sh

# Run scripts directly
./scripts/initial-setup.sh
./scripts/db-migrate.sh
```

## 🚦 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Web App** | http://localhost:3000 | Marketing website |
| **Dashboard** | http://localhost:3001 | Main application |
| **Auth Service** | http://localhost:3003 | Authentication API |

## 🔍 Troubleshooting

### Common Issues

**Make not found**
```bash
./scripts/check-make.sh  # Get installation instructions
```

**Database connection failed**
```bash
make check-env          # Validate configuration
make db-status          # Test connection
```

**Dependencies not installing**
```bash
make clean              # Clean everything
make install            # Reinstall dependencies
```

**Port already in use**
```bash
# Find and kill process using port
lsof -ti:3000 | xargs kill -9
```

### Getting Help

```bash
make help               # All commands
make help-setup         # Setup help
make help-dev           # Development help
make help-db            # Database help
make info               # Project status
```

## 🎯 Best Practices

### Development Workflow

1. **Start with setup**: Always run `make setup` for new environments
2. **Use individual dev commands**: Start services separately for easier debugging
3. **Check status regularly**: Use `make info` to see what's running
4. **Validate environment**: Run `make check-env` if issues arise

### Database Management

1. **Backup before reset**: Always backup data before `make db-reset`
2. **Test migrations**: Use `make db-studio` to verify schema changes
3. **Use version control**: Commit schema changes with code changes
4. **Seed consistently**: Use `make db-seed` for reproducible test data

### Code Quality

1. **Lint before commit**: Run `make lint` before pushing code
2. **Format automatically**: Use `make format` to fix style issues
3. **Test regularly**: Run `make test` to catch issues early
4. **Clean builds**: Use `make clean && make build` for fresh builds

## 📚 Additional Resources

- **Drizzle ORM**: https://orm.drizzle.team/
- **Better Auth**: https://better-auth.com/
- **Next.js**: https://nextjs.org/
- **pnpm**: https://pnpm.io/

---

**Happy coding!** 🚀

For questions or issues, check the troubleshooting section or run `make help` for available commands.

---

# Environment Setup

## Centralized Environment Configuration

This project uses a centralized environment configuration system where all apps and packages read directly from the root environment files.

## How It Works

All environment variables are defined in the **root `.env` and `.env.local` files** and automatically loaded by each app and package at build time using a custom environment loader (`scripts/load-root-env.js`).

## Key Benefits

- ✅ **Single source of truth**: All environment variables are defined in one place
- ✅ **Consistency**: All apps and packages have the same environment configuration
- ✅ **Easy maintenance**: Update variables in one place, available everywhere instantly
- ✅ **No duplication**: No need for multiple `.env` files across apps
- ✅ **Automatic loading**: Environment variables are loaded automatically at build time
- ✅ **Real-time updates**: Changes take effect immediately when you restart dev servers

## Usage

### Adding New Environment Variables

1. Add the new variable to the **root `.env.local` file**
2. Restart your development server or rebuild the app
3. The variable will be automatically available in all apps and packages

### Updating Environment Variables

1. Update the variable in the **root `.env.local` file**
2. Restart your development server or rebuild the app
3. The updated variable will be automatically available everywhere

## File Structure

```text
.env.local                    # 🎯 Master environment file (edit this one)
.env                          # 🎯 Global environment file (optional)
├── apps/
│   ├── auth/                # ✅ Reads from root automatically
│   ├── dashboard/           # ✅ Reads from root automatically  
│   └── web/                 # ✅ Reads from root automatically
└── packages/
    ├── database/            # ✅ Reads from root automatically
    └── ui/                  # ✅ Reads from root automatically
```

## Required Files

Create `.env.local` in the workspace root:

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
DIRECT_URL="postgresql://user:pass@localhost:5432/db"

# Authentication
BETTER_AUTH_SECRET="your-secret-here"
NEXT_PUBLIC_AUTH_URL="http://localhost:3003"

# Application URLs
NEXT_PUBLIC_WEB_URL="http://localhost:3000"
NEXT_PUBLIC_FRAGMENT_URL="http://localhost:3001"
```

## Prerequisites

- **Node.js 20+**
- **pnpm** (`npm install -g pnpm`)
- **PostgreSQL** database
- **make** (see installation above)

## Important Notes

- **Only edit the root `.env` and `.env.local` files** - these are the single source of truth
- **No individual app `.env` files needed** - apps load directly from root
- **Changes take effect on restart** - restart dev servers or rebuild to pick up changes
- **Automatic discovery**: The loader automatically finds the project root

## Environment Loader Features

- 🔍 **Auto-discovery**: Automatically finds project root directory
- 📁 **Dual file support**: Loads both `.env` and `.env.local` (local overrides global)
- 🔄 **Smart parsing**: Handles quoted values and comments correctly
- ✅ **Safe operation**: Won't override existing environment variables
- 🎨 **Build-time loading**: Integrates seamlessly with Next.js build process

## Environment Variables Structure

The root `.env.local` file is organized into sections:

- **Authentication & Security**: Better Auth, API keys
- **Database Configuration**: PostgreSQL, connection strings
- **API Configuration**: Service URLs, endpoints
- **Third-party Services**: Stripe, Resend, AI providers
- **Development Settings**: Debug flags, local URLs

## Technical Implementation

Each app's `next.config.js/ts/mjs` file includes:

```javascript
// Load environment variables from project root
require('../../scripts/load-root-env.js').loadRootEnv();
```

This ensures that all environment variables from the root are available during the build process.

## Troubleshooting

If you encounter issues:

1. **Check file permissions**: Ensure the loader script is accessible
2. **Verify root file exists**: Make sure `.env.local` exists in the project root
3. **Check syntax**: Ensure the root `.env.local` file has valid syntax
4. **Restart services**: Always restart dev servers after environment changes
5. **Check build logs**: Look for "✅ Loaded X environment variables from root" message

---

# Development Workflow

## 🔄 Daily Development Process

### 1. **Environment Setup**

```bash
# Start your development session
cd agentsauthority

# Pull latest changes
git pull origin main

# Install any new dependencies
pnpm install

# Start all services
make dev
```

### 2. **Feature Development**

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... development work ...

# Test your changes
make test
make lint

# Commit your work
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 3. **Database Changes**

```bash
# Make schema changes in packages/database/src/schema.ts

# Generate migration
pnpm --filter @workspace/database db:generate

# Apply migration locally
pnpm --filter @workspace/database db:push

# Test with fresh data
make db-reset
make db-seed

# Verify in Drizzle Studio
make db-studio
```

## 🧪 Testing Workflow

### Unit Testing

```bash
# Run all tests
make test

# Run tests for specific package
pnpm --filter @workspace/database test
pnpm --filter @workspace/ui test

# Run tests in watch mode
pnpm --filter apps/dashboard test:watch
```

### Integration Testing

```bash
# Start test database
make test-db-start

# Run integration tests
make test-integration

# Clean up
make test-db-stop
```

### End-to-End Testing

```bash
# Start all services
make dev

# Run E2E tests
make test-e2e

# Run specific E2E test
pnpm --filter apps/dashboard test:e2e -- --grep "company creation"
```

## 🔧 Code Quality

### Linting and Formatting

```bash
# Run linter
make lint

# Fix linting issues
make lint-fix

# Format code
make format

# Type checking
make type-check
```

### Pre-commit Hooks

```bash
# Install pre-commit hooks
pnpm install

# Hooks will automatically run:
# - ESLint
# - Prettier
# - TypeScript checking
# - Test validation
```

### Code Review Checklist

- [ ] **Functionality**: Feature works as expected
- [ ] **Tests**: Adequate test coverage
- [ ] **Documentation**: Updated relevant documentation
- [ ] **Performance**: No performance regressions
- [ ] **Security**: No security vulnerabilities
- [ ] **Accessibility**: Meets accessibility standards
- [ ] **Mobile**: Works on mobile devices
- [ ] **Browser**: Cross-browser compatibility

## 🗄️ Database Workflow

### Schema Changes

1. **Update Schema**: Modify `packages/database/src/schema.ts`
2. **Generate Migration**: `pnpm --filter @workspace/database db:generate`
3. **Review Migration**: Check generated SQL in `migrations/` folder
4. **Test Migration**: Apply locally and verify
5. **Update Seed Data**: If needed, update seed scripts
6. **Document Changes**: Update database documentation

### Data Migration

```bash
# For complex data migrations, create custom scripts
# packages/database/src/migrations/custom/migrate-data.ts

export async function migrateData() {
  // Custom data migration logic
  console.log("Starting data migration...");
  
  // Perform migration
  await db.transaction(async (tx) => {
    // Migration operations
  });
  
  console.log("Data migration completed");
}
```

## 🚀 Deployment Workflow

### Staging Deployment

```bash
# Deploy to staging
git push origin staging

# Verify deployment
make verify-staging

# Run smoke tests
make test-staging
```

### Production Deployment

```bash
# Create release branch
git checkout -b release/v1.2.3

# Update version numbers
pnpm version patch

# Create release PR
# ... review and merge ...

# Deploy to production
git tag v1.2.3
git push origin v1.2.3

# Monitor deployment
make monitor-production
```

## 🔍 Debugging Workflow

### Local Debugging

```bash
# Debug specific service
make debug-dashboard  # Starts with debugger
make debug-auth      # Starts with debugger

# View logs
make logs-dashboard
make logs-auth
make logs-web

# Database debugging
make db-studio       # Visual database explorer
make db-logs         # Database logs
```

### Production Debugging

```bash
# View production logs
make logs-production

# Connect to production database (read-only)
make db-production-readonly

# Performance monitoring
make monitor-performance
```

## 📊 Performance Monitoring

### Local Performance

```bash
# Bundle analysis
make analyze-bundle

# Performance testing
make test-performance

# Memory profiling
make profile-memory
```

### Production Monitoring

- **Application Performance**: Monitor response times and error rates
- **Database Performance**: Track query performance and connection health
- **Infrastructure**: Monitor server resources and scaling
- **User Experience**: Track Core Web Vitals and user interactions

## 🤝 Collaboration Workflow

### Branch Strategy

```
main
├── develop
├── feature/feature-name
├── bugfix/bug-description
├── hotfix/critical-fix
└── release/version-number
```

### Pull Request Process

1. **Create Feature Branch**: From `develop` branch
2. **Develop Feature**: Make changes and commit
3. **Create PR**: Against `develop` branch
4. **Code Review**: Team review and feedback
5. **Testing**: Automated and manual testing
6. **Merge**: Squash and merge to `develop`
7. **Deploy**: Deploy to staging for validation

### Communication

- **Daily Standups**: Progress updates and blockers
- **Code Reviews**: Collaborative code improvement
- **Architecture Discussions**: Major technical decisions
- **Documentation**: Keep documentation current

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
make db-status

# Restart database
make db-restart

# Reset database
make db-reset
```

#### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000
lsof -i :3001
lsof -i :3003

# Kill processes if needed
kill -9 <PID>
```

#### Package Issues
```bash
# Clear node_modules and reinstall
make clean
pnpm install

# Clear package manager cache
pnpm store prune
```

#### Build Issues
```bash
# Clean build artifacts
make clean-build

# Rebuild everything
make build

# Check for TypeScript errors
make type-check
```

### Getting Help

1. **Check Documentation**: Review relevant docs first
2. **Search Issues**: Look for similar problems in GitHub issues
3. **Ask Team**: Reach out to team members
4. **Create Issue**: Document the problem for future reference

---

This workflow ensures consistent, high-quality development while maintaining team collaboration and code quality standards.
