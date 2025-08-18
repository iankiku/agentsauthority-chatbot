# End-to-End Flow Testing Guide

## 🎯 Complete User Journey Test

### Prerequisites
1. **Both servers running**:
   ```bash
   # Terminal 1: Web app
   cd apps/web && npm run dev
   
   # Terminal 2: Fragment app  
   cd apps/fragment && npm run dev
   ```

2. **Database setup**:
   - ✅ Better Auth tables created
   - ✅ Company/analysis tables available
   - ✅ Demo user can be created via API

### Test Steps

#### 1. Homepage → Analysis Start
- **URL**: `http://localhost:3000`
- **Action**: Click "Start Analysis" button
- **Expected**: Modal opens with URL/email form

#### 2. Onboarding Flow
- **Input**: 
  - URL: `example.com`
  - Email: `test@example.com`
- **Action**: Click "Start Analysis"
- **Expected**: 
  - User account created automatically
  - Analysis starts with real-time progress
  - 6 stages shown with progress indicators

#### 3. Analysis Progress (SSE)
- **Expected stages**:
  1. Brand Discovery (15%)
  2. Competitor Research (30%)
  3. Visibility Scanning (50-80%)
  4. Trend Analysis (80%)
  5. Audience Insights (90%)
  6. Report Generation (95-100%)

#### 4. Analysis Completion
- **Expected**: 
  - Progress reaches 100%
  - Redirect to dashboard with auth
  - URL: `http://localhost:3001/dashboard?userId=...&sessionToken=...&jobId=...&newUser=true`

#### 5. Welcome Flow
- **Expected**:
  - 3-step welcome tour
  - Analysis results preview
  - Feature highlights
  - "Enter Dashboard" button

#### 6. Dashboard Access
- **Expected**:
  - Full dashboard with analysis data
  - User authenticated and session active
  - Analysis results displayed

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check Better Auth secret is valid hex string
   - Verify session cookies are set correctly
   - Ensure CORS headers allow cross-origin requests

2. **Analysis API Errors**:
   - Check service imports are correct
   - Verify database connection
   - Ensure user has valid session

3. **SSE Connection Issues**:
   - Check jobId is valid
   - Verify SSE endpoint returns proper headers
   - Ensure EventSource connection established

### Debug Commands

```bash
# Check if user was created
curl -X GET "http://localhost:3001/api/auth/session" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Test analysis API directly
curl -X POST "http://localhost:3001/api/brand-monitor/analyze" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"companyName":"Example","companyUrl":"example.com","industry":"general","timeframe":"30d"}'

# Test SSE endpoint
curl -N "http://localhost:3001/api/agent-status/YOUR_JOB_ID"
```

## ✅ Success Criteria

- [ ] User account created automatically
- [ ] Analysis starts and shows real-time progress
- [ ] SSE updates work correctly
- [ ] Authentication flows seamlessly
- [ ] Welcome tour displays properly
- [ ] Dashboard loads with analysis data
- [ ] No console errors or failed requests

## 🚀 Next Steps

After successful testing:
1. Add error handling for edge cases
2. Implement retry logic for failed analyses
3. Add loading states for better UX
4. Optimize SSE connection management
5. Add analytics tracking for user journey
