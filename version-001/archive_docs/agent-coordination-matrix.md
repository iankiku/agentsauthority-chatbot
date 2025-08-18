# Agent Coordination Matrix
## GEO Dashboard Transformation - Multi-Agent Task Assignment

### Matrix Overview
This document provides detailed task assignments, dependencies, and coordination protocols for the 8-day GEO dashboard transformation project.

---

## Agent Capabilities & Assignments

### **Agent 1: frontend-developer**
**Specialization**: UI/UX, Styling, Brand Integration  
**Work Pattern**: Visual-first, design-driven development  
**Peak Performance**: Component design, responsive layouts, accessibility

#### Day 1-2 Tasks (Foundation Phase)
```typescript
interface FrontendTasks {
  priority: "HIGH";
  dependencies: [];
  deliverables: [
    "Brand color integration",
    "Logo and asset updates", 
    "Responsive design system",
    "Component library updates"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/styles/globals.css",
      "apps/geo-dashboard/components/ui/",
      "apps/geo-dashboard/public/",
      "apps/geo-dashboard/app/layout.tsx"
    ];
    secondary: [
      "apps/geo-dashboard/tailwind.config.js",
      "apps/geo-dashboard/lib/constants.ts"
    ];
  };
  handoffs: {
    to: ["react-specialist", "fullstack-developer"];
    assets: ["Component library", "Style guide", "Brand assets"];
  };
}
```

**Specific Tasks**:
1. **Brand Integration** (6 hours)
   - Replace all color variables with AgentsAuthority palette
   - Update logos, icons, and visual assets
   - Implement consistent typography system
   - Create brand-compliant component variants

2. **Responsive Design System** (8 hours)
   - Audit and update breakpoint system
   - Ensure mobile-first approach
   - Test on all target devices
   - Document responsive patterns

3. **Component Library Updates** (6 hours)
   - Update UI components with new branding
   - Implement accessibility improvements
   - Create component documentation
   - Set up component testing

**Acceptance Criteria**:
- [ ] All components use AgentsAuthority colors (#1a73e8, #34a853, #ea4335, #fbbc04)
- [ ] Responsive design works flawlessly 320px-2560px
- [ ] Lighthouse accessibility score > 95
- [ ] No visual artifacts from previous branding

---

### **Agent 2: backend-developer**
**Specialization**: Authentication, API Infrastructure, Server-side Logic  
**Work Pattern**: Security-first, robust architecture  
**Peak Performance**: Auth systems, middleware, API design

#### Day 1-2 Tasks (Foundation Phase)
```typescript
interface BackendTasks {
  priority: "HIGH";
  dependencies: [];
  deliverables: [
    "Better Auth integration",
    "Session management",
    "API route structure",
    "Security middleware"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/lib/auth.ts",
      "apps/geo-dashboard/middleware.ts",
      "apps/geo-dashboard/app/api/auth/",
      "apps/geo-dashboard/lib/session-utils.ts"
    ];
    secondary: [
      "apps/geo-dashboard/lib/api-errors.ts",
      "apps/geo-dashboard/lib/rate-limit.ts"
    ];
  };
  handoffs: {
    to: ["api-designer", "fullstack-developer"];
    assets: ["Auth utilities", "API middleware", "Session management"];
  };
}
```

**Specific Tasks**:
1. **Better Auth Integration** (8 hours)
   - Remove NextAuth dependencies
   - Implement Better Auth client configuration
   - Set up cross-domain session support
   - Test auth flows thoroughly

2. **API Infrastructure** (6 hours)
   - Create standardized API route structure
   - Implement request/response middleware
   - Set up error handling patterns
   - Configure rate limiting

3. **Security Implementation** (4 hours)
   - Implement CSRF protection
   - Set up input validation middleware
   - Configure security headers
   - Audit authentication flows

**Acceptance Criteria**:
- [ ] Better Auth fully functional with dashboard auth service
- [ ] Session persistence across browser restarts
- [ ] All protected routes properly secured
- [ ] Authentication works cross-domain (localhost:3001 ↔ localhost:3003)

---

### **Agent 3: database-administrator**
**Specialization**: Database Schema, Migrations, Data Services  
**Work Pattern**: Data-integrity focused, performance-driven  
**Peak Performance**: Schema design, query optimization, migrations

#### Day 1-2 Tasks (Foundation Phase)
```typescript
interface DatabaseTasks {
  priority: "HIGH";
  dependencies: [];
  deliverables: [
    "GEO schema extensions",
    "Data migration scripts", 
    "Query optimization",
    "Database utilities"
  ];
  files: {
    primary: [
      "packages/database/src/schema.ts",
      "packages/database/src/services/geo.ts",
      "apps/geo-dashboard/lib/db/",
      "apps/geo-dashboard/migrations/"
    ];
    secondary: [
      "packages/database/src/queries.ts",
      "apps/geo-dashboard/lib/db-utils.ts"
    ];
  };
  handoffs: {
    to: ["api-designer", "typescript-pro"];
    assets: ["Database schema", "Query utilities", "Migration scripts"];
  };
}
```

**Specific Tasks**:
1. **GEO Schema Design** (8 hours)
   - Design brand analysis tables
   - Create competitor tracking schema
   - Add visibility score tables
   - Implement audit logging

2. **Migration Strategy** (4 hours)
   - Create safe migration scripts
   - Implement rollback procedures
   - Test data integrity
   - Document schema changes

3. **Query Optimization** (6 hours)
   - Design efficient indexing strategy
   - Optimize common query patterns
   - Implement connection pooling
   - Set up query monitoring

**Schema Extensions**:
```sql
-- Brand Analysis Tables
CREATE TABLE brand_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  brand_name TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  visibility_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competitor Tracking
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- GEO Scores
CREATE TABLE geo_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_analysis_id UUID NOT NULL,
  platform TEXT NOT NULL, -- 'chatgpt', 'claude', 'gemini', 'perplexity'
  score INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Acceptance Criteria**:
- [ ] All GEO tables created and indexed
- [ ] Migration scripts tested and validated
- [ ] Query performance meets < 100ms SLA
- [ ] Database connections stable under load

---

### **Agent 4: api-designer**
**Specialization**: API Architecture, Endpoint Design, Data Validation  
**Work Pattern**: Contract-first, documentation-driven  
**Peak Performance**: API design, schema validation, integration patterns

#### Day 3-4 Tasks (Core Features Phase)
```typescript
interface APIDesignTasks {
  priority: "HIGH";
  dependencies: ["backend-developer.auth", "database-administrator.schema"];
  deliverables: [
    "GEO analysis endpoints",
    "Artifact type definitions",
    "Validation schemas",
    "API documentation"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/app/api/geo/",
      "apps/geo-dashboard/lib/types/geo.ts",
      "apps/geo-dashboard/lib/validation/",
      "apps/geo-dashboard/docs/api.md"
    ];
    secondary: [
      "apps/geo-dashboard/lib/api-client.ts",
      "apps/geo-dashboard/lib/types/artifacts.ts"
    ];
  };
  handoffs: {
    to: ["react-specialist", "typescript-pro"];
    assets: ["API endpoints", "Type definitions", "Validation schemas"];
  };
}
```

**Specific Tasks**:
1. **GEO Analysis Endpoints** (10 hours)
   - `/api/geo/analyze` - Brand analysis endpoint
   - `/api/geo/competitors` - Competitor research endpoint
   - `/api/geo/visibility` - Visibility scoring endpoint
   - `/api/geo/suggestions` - Optimization suggestions endpoint

2. **Type System Design** (6 hours)
   - Create comprehensive TypeScript interfaces
   - Design artifact type definitions
   - Implement discriminated unions for different analysis types
   - Set up type generation from schema

3. **Validation & Documentation** (4 hours)
   - Implement Zod validation schemas
   - Create OpenAPI specification
   - Write endpoint documentation
   - Set up automated testing

**API Endpoints Design**:
```typescript
// Brand Analysis Endpoint
POST /api/geo/analyze
{
  "brand": "string",
  "industry": "string", 
  "competitors": ["string"],
  "platforms": ["chatgpt", "claude", "gemini", "perplexity"]
}

// Competitor Research Endpoint  
POST /api/geo/competitors
{
  "brand": "string",
  "industry": "string",
  "limit": 10
}

// Visibility Scoring Endpoint
POST /api/geo/visibility  
{
  "brand": "string",
  "queries": ["string"],
  "platforms": ["string"]
}

// Optimization Suggestions Endpoint
POST /api/geo/suggestions
{
  "analysisId": "uuid",
  "focusAreas": ["visibility", "sentiment", "ranking"]
}
```

**Acceptance Criteria**:
- [ ] All endpoints functional and tested
- [ ] Type safety maintained throughout
- [ ] Validation catches all edge cases
- [ ] API documentation complete and accurate

---

### **Agent 5: react-specialist**
**Specialization**: React Components, Chart Libraries, Interactive UI  
**Work Pattern**: Component-driven, user-experience focused  
**Peak Performance**: Complex UI components, data visualization, interactivity

#### Day 3-5 Tasks (Core Features Phase)
```typescript
interface ReactTasks {
  priority: "HIGH";
  dependencies: ["frontend-developer.components", "api-designer.types"];
  deliverables: [
    "GEO artifact components",
    "Interactive dashboards",
    "Chart visualizations", 
    "Component testing"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/components/artifacts/brand-visibility-chart.tsx",
      "apps/geo-dashboard/components/artifacts/competitor-analysis.tsx", 
      "apps/geo-dashboard/components/artifacts/geo-score-dashboard.tsx",
      "apps/geo-dashboard/components/artifacts/visibility-trends.tsx"
    ];
    secondary: [
      "apps/geo-dashboard/components/geo/",
      "apps/geo-dashboard/lib/chart-configs.ts",
      "apps/geo-dashboard/hooks/use-geo-data.ts"
    ];
  };
  handoffs: {
    to: ["fullstack-developer", "debugger"];
    assets: ["Artifact components", "Chart configurations", "UI hooks"];
  };
}
```

**Specific Tasks**:
1. **Brand Visibility Chart Component** (8 hours)
   - Multi-platform visibility comparison
   - Interactive timeline with zoom/pan
   - Export functionality (PNG, SVG, PDF)
   - Real-time data updates

2. **Competitor Analysis Dashboard** (8 hours)
   - Competitive positioning matrix
   - Market share visualization
   - Strength/weakness comparison
   - Filterable by industry/platform

3. **GEO Score Dashboard** (6 hours)
   - Real-time score display
   - Historical trend visualization
   - Platform-specific breakdowns
   - Actionable insights panel

4. **Visibility Trends Component** (6 hours)
   - Time-series visualization
   - Multi-metric overlay
   - Predictive trend lines
   - Anomaly detection highlights

**Component Architecture**:
```typescript
// Brand Visibility Chart
interface BrandVisibilityChartProps {
  data: BrandVisibilityData[];
  platforms: Platform[];
  timeRange: TimeRange;
  onExport: (format: ExportFormat) => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

// Competitor Analysis
interface CompetitorAnalysisProps {
  competitors: Competitor[];
  metrics: AnalysisMetric[];
  industry: Industry;
  onCompetitorSelect: (competitor: Competitor) => void;
  onMetricToggle: (metric: AnalysisMetric) => void;
}

// GEO Score Dashboard
interface GEOScoreDashboardProps {
  scores: GEOScore[];
  insights: Insight[];
  trends: TrendData[];
  onScoreClick: (score: GEOScore) => void;
  onInsightExpand: (insight: Insight) => void;
}
```

**Acceptance Criteria**:
- [ ] All components render correctly with test data
- [ ] Interactive features working (zoom, filter, select)
- [ ] Export functionality operational
- [ ] Responsive design maintained across all components

---

### **Agent 6: typescript-pro**
**Specialization**: TypeScript, Algorithm Implementation, Business Logic  
**Work Pattern**: Type-safety focused, performance-oriented  
**Peak Performance**: Complex algorithms, type systems, optimization

#### Day 3-5 Tasks (Core Features Phase)
```typescript
interface TypeScriptTasks {
  priority: "HIGH";
  dependencies: ["api-designer.types", "database-administrator.schema"];
  deliverables: [
    "GEO scoring algorithms",
    "Brand analysis tools",
    "Optimization engine",
    "Type-safe utilities"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/lib/geo/scoring-algorithms.ts",
      "apps/geo-dashboard/lib/geo/brand-analysis.ts",
      "apps/geo-dashboard/lib/geo/competitor-research.ts", 
      "apps/geo-dashboard/lib/geo/optimization-engine.ts"
    ];
    secondary: [
      "apps/geo-dashboard/lib/ai/",
      "apps/geo-dashboard/lib/utils/geo.ts",
      "apps/geo-dashboard/lib/types/algorithms.ts"
    ];
  };
  handoffs: {
    to: ["fullstack-developer", "performance-optimizer"];
    assets: ["Algorithm implementations", "Type definitions", "Utility functions"];
  };
}
```

**Specific Tasks**:
1. **GEO Scoring Algorithms** (10 hours)
   - Platform-specific scoring models
   - Weighted aggregation algorithms  
   - Confidence interval calculations
   - Trend analysis algorithms

2. **Brand Analysis Engine** (8 hours)
   - Sentiment analysis integration
   - Entity recognition and extraction
   - Brand mention detection
   - Competitive positioning analysis

3. **Optimization Engine** (6 hours)
   - Recommendation algorithms
   - A/B testing frameworks
   - Performance prediction models
   - ROI calculation engines

4. **Type System & Utilities** (4 hours)
   - Comprehensive type definitions
   - Type guards and validators
   - Utility functions with proper typing
   - Error handling types

**Algorithm Implementations**:
```typescript
// GEO Scoring Algorithm
interface GEOScoringConfig {
  platforms: PlatformWeight[];
  metrics: MetricWeight[];
  timeDecay: number;
  confidenceThreshold: number;
}

class GEOScoringEngine {
  calculateScore(
    data: PlatformData[], 
    config: GEOScoringConfig
  ): Promise<GEOScore> {
    // Weighted scoring implementation
  }
  
  calculateTrend(
    historicalScores: GEOScore[],
    timeframe: TimeFrame
  ): TrendAnalysis {
    // Trend calculation with statistical significance
  }
}

// Brand Analysis Engine
interface BrandAnalysisResult {
  visibility: VisibilityMetrics;
  sentiment: SentimentAnalysis;
  positioning: CompetitivePositioning;
  recommendations: Recommendation[];
}

class BrandAnalysisEngine {
  async analyze(
    brand: string,
    competitors: string[],
    platforms: Platform[]
  ): Promise<BrandAnalysisResult> {
    // Multi-platform brand analysis
  }
}
```

**Acceptance Criteria**:
- [ ] All algorithms implemented with proper TypeScript types
- [ ] Performance benchmarks met (< 100ms for scoring)
- [ ] Comprehensive error handling
- [ ] Unit test coverage > 95%

---

### **Agent 7: fullstack-developer**
**Specialization**: System Integration, Full-Stack Architecture, Workflow Design  
**Work Pattern**: Integration-focused, end-to-end thinking  
**Peak Performance**: Complex integrations, workflow orchestration, system design

#### Day 6-7 Tasks (Integration Phase)
```typescript
interface FullStackTasks {
  priority: "CRITICAL";
  dependencies: ["react-specialist.components", "typescript-pro.algorithms", "api-designer.endpoints"];
  deliverables: [
    "End-to-end integration",
    "Workflow orchestration",
    "System testing",
    "Performance optimization"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/app/",
      "apps/geo-dashboard/components/layouts/",
      "apps/geo-dashboard/lib/integrations/",
      "apps/geo-dashboard/lib/workflows/"
    ];
    secondary: [
      "apps/geo-dashboard/middleware.ts",
      "apps/geo-dashboard/lib/api-client.ts",
      "apps/geo-dashboard/lib/state-management.ts"
    ];
  };
  handoffs: {
    to: ["debugger", "performance-optimizer"];
    assets: ["Integrated system", "Workflow definitions", "Integration tests"];
  };
}
```

**Specific Tasks**:
1. **Component Integration** (8 hours)
   - Integrate all artifact components with data flow
   - Implement state management across components
   - Set up proper error boundaries
   - Test component interactions

2. **API Integration** (8 hours)
   - Connect frontend components to API endpoints
   - Implement proper loading states
   - Set up error handling and retry logic
   - Optimize API call patterns

3. **Workflow Orchestration** (6 hours)
   - Design user workflows for brand analysis
   - Implement multi-step analysis processes
   - Set up progress tracking
   - Create workflow state persistence

4. **System Testing** (6 hours)
   - End-to-end workflow testing
   - Integration test suite
   - Performance baseline establishment
   - Cross-browser compatibility verification

**Integration Architecture**:
```typescript
// Workflow Orchestration
interface AnalysisWorkflow {
  id: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: Partial<AnalysisResults>;
}

class WorkflowOrchestrator {
  async executeWorkflow(
    workflow: AnalysisWorkflow,
    onProgress: (step: WorkflowStep) => void
  ): Promise<AnalysisResults> {
    // Step-by-step workflow execution
  }
}

// State Management
interface AppState {
  user: UserState;
  analyses: AnalysisState[];
  workflows: WorkflowState[];
  ui: UIState;
}

// API Integration Layer
class GEOApiClient {
  async analyzeBrand(request: BrandAnalysisRequest): Promise<BrandAnalysisResult> {
    // Type-safe API communication
  }
}
```

**Acceptance Criteria**:
- [ ] All components work together seamlessly
- [ ] User workflows complete without errors
- [ ] State management handles all edge cases
- [ ] Integration tests pass with 100% success rate

---

### **Agent 8: debugger**
**Specialization**: Testing, Bug Detection, Quality Assurance  
**Work Pattern**: Quality-first, systematic testing approach  
**Peak Performance**: Bug detection, test automation, quality metrics

#### Day 6-7 Tasks (Integration Phase)
```typescript
interface DebuggerTasks {
  priority: "HIGH";
  dependencies: ["fullstack-developer.integration"];
  deliverables: [
    "Comprehensive testing suite",
    "Bug reports and fixes",
    "Quality metrics",
    "Testing documentation"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/tests/unit/",
      "apps/geo-dashboard/tests/integration/",
      "apps/geo-dashboard/tests/e2e/",
      "apps/geo-dashboard/docs/testing.md"
    ];
    secondary: [
      "apps/geo-dashboard/__tests__/",
      "apps/geo-dashboard/jest.config.js",
      "apps/geo-dashboard/playwright.config.ts"
    ];
  };
  handoffs: {
    to: ["performance-optimizer", "devops-engineer"];
    assets: ["Test suite", "Bug reports", "Quality metrics"];
  };
}
```

**Specific Tasks**:
1. **Unit Testing Suite** (8 hours)
   - Test all utility functions and algorithms
   - Component testing with React Testing Library
   - API endpoint testing with proper mocking
   - Edge case and error condition testing

2. **Integration Testing** (8 hours)
   - End-to-end workflow testing
   - Database integration testing
   - API integration testing
   - Component interaction testing

3. **Bug Detection & Resolution** (6 hours)
   - Systematic bug hunting across all features
   - Cross-browser compatibility testing
   - Mobile responsiveness testing
   - Performance regression testing

4. **Quality Assurance** (6 hours)
   - Code coverage analysis
   - Performance benchmarking
   - Accessibility auditing
   - Security vulnerability scanning

**Testing Strategy**:
```typescript
// Unit Testing Examples
describe('GEO Scoring Algorithm', () => {
  test('calculates correct weighted score', () => {
    // Algorithm testing
  });
  
  test('handles edge cases gracefully', () => {
    // Edge case testing
  });
});

// Integration Testing Examples  
describe('Brand Analysis Workflow', () => {
  test('completes full analysis pipeline', async () => {
    // End-to-end workflow testing
  });
});

// E2E Testing Examples
describe('User Journey: Brand Analysis', () => {
  test('user can complete brand analysis from start to finish', async () => {
    // Full user journey testing
  });
});
```

**Acceptance Criteria**:
- [ ] 90%+ code coverage achieved
- [ ] All critical user paths tested
- [ ] Zero high-priority bugs remaining
- [ ] Performance benchmarks met

---

### **Agent 9: performance-optimizer**
**Specialization**: Performance Engineering, Optimization, Monitoring  
**Work Pattern**: Metrics-driven, performance-focused  
**Peak Performance**: Code optimization, bundle analysis, performance monitoring

#### Day 6-7 Tasks (Integration Phase)
```typescript
interface PerformanceOptimizationTasks {
  priority: "HIGH";
  dependencies: ["fullstack-developer.integration", "debugger.testing"];
  deliverables: [
    "Performance optimizations",
    "Bundle size reduction",
    "Monitoring setup",
    "Performance documentation"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/next.config.js",
      "apps/geo-dashboard/lib/performance/",
      "apps/geo-dashboard/components/lazy/",
      "apps/geo-dashboard/monitoring/"
    ];
    secondary: [
      "apps/geo-dashboard/webpack.config.js",
      "apps/geo-dashboard/lib/optimization/",
      "apps/geo-dashboard/docs/performance.md"
    ];
  };
  handoffs: {
    to: ["devops-engineer"];
    assets: ["Optimized build", "Performance monitoring", "Optimization docs"];
  };
}
```

**Specific Tasks**:
1. **Code Splitting & Lazy Loading** (8 hours)
   - Implement route-based code splitting
   - Lazy load heavy components (charts, artifacts)
   - Optimize bundle sizes with webpack analysis
   - Set up dynamic imports for GEO tools

2. **Performance Optimization** (8 hours)
   - Database query optimization
   - API response caching implementation
   - Image and asset optimization
   - Memory leak detection and fixes

3. **Monitoring & Metrics** (4 hours)
   - Set up performance monitoring
   - Implement Core Web Vitals tracking
   - Create performance dashboards
   - Set up alerting for performance regressions

4. **Build Optimization** (4 hours)
   - Optimize webpack configuration
   - Implement production build optimizations
   - Set up bundle analysis automation
   - Configure CDN integration

**Performance Optimizations**:
```typescript
// Lazy Loading Implementation
const BrandVisibilityChart = lazy(() => 
  import('../components/artifacts/brand-visibility-chart')
    .then(module => ({ default: module.BrandVisibilityChart }))
);

// Performance Monitoring
class PerformanceMonitor {
  trackPageLoad(route: string): void {
    // Core Web Vitals tracking
  }
  
  trackAPIPerformance(endpoint: string, duration: number): void {
    // API performance tracking
  }
  
  trackUserInteraction(action: string, duration: number): void {
    // User interaction performance
  }
}

// Caching Strategy
interface CacheConfig {
  apiCache: {
    duration: number;
    strategy: 'stale-while-revalidate' | 'cache-first';
  };
  assetCache: {
    duration: number;
    strategy: 'cache-first';
  };
}
```

**Acceptance Criteria**:
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Bundle size < 500KB gzipped
- [ ] Lighthouse performance score > 90

---

### **Agent 10: devops-engineer**
**Specialization**: Deployment, Infrastructure, CI/CD, Monitoring  
**Work Pattern**: Reliability-focused, automation-driven  
**Peak Performance**: Production deployments, monitoring systems, infrastructure

#### Day 8 Tasks (Deployment Phase)
```typescript
interface DevOpsTasks {
  priority: "CRITICAL";
  dependencies: ["performance-optimizer.build", "debugger.quality"];
  deliverables: [
    "Production deployment",
    "CI/CD pipeline",
    "Monitoring systems",
    "Documentation"
  ];
  files: {
    primary: [
      "apps/geo-dashboard/Dockerfile",
      "apps/geo-dashboard/.github/workflows/",
      "apps/geo-dashboard/docker-compose.yml",
      "apps/geo-dashboard/docs/deployment.md"
    ];
    secondary: [
      "apps/geo-dashboard/.env.example",
      "apps/geo-dashboard/scripts/deploy.sh",
      "apps/geo-dashboard/monitoring/alerts.yml"
    ];
  };
  handoffs: {
    to: ["project-stakeholders"];
    assets: ["Production deployment", "Monitoring dashboards", "Operations docs"];
  };
}
```

**Specific Tasks**:
1. **Production Deployment** (6 hours)
   - Configure production environment
   - Set up container orchestration
   - Implement blue-green deployment
   - Configure load balancing

2. **CI/CD Pipeline** (4 hours)
   - Set up automated testing pipeline
   - Implement deployment automation
   - Configure environment promotion
   - Set up rollback procedures

3. **Monitoring & Observability** (6 hours)
   - Set up application monitoring
   - Configure alerting systems
   - Implement log aggregation
   - Create operational dashboards

4. **Documentation & Handoff** (4 hours)
   - Complete deployment documentation
   - Create operational runbooks
   - Set up team access and permissions
   - Conduct deployment review

**Infrastructure Configuration**:
```yaml
# Docker Configuration
services:
  geo-dashboard:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - AUTH_URL=${AUTH_URL}
    depends_on:
      - postgres
      - redis

# CI/CD Pipeline
name: Deploy GEO Dashboard
on:
  push:
    branches: [main]
    paths: ['apps/geo-dashboard/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
      - name: Performance audit
      - name: Security scan
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
      - name: Health check
      - name: Notify team
```

**Acceptance Criteria**:
- [ ] Production deployment successful
- [ ] All monitoring systems operational
- [ ] CI/CD pipeline functional
- [ ] Zero downtime deployment achieved

---

## Coordination Protocols

### Daily Communication Schedule

#### **Morning Standup (9:00 AM - 15 minutes)**
**Attendees**: All agents  
**Format**: Round-robin updates  
**Topics**:
- Previous day accomplishments
- Current day priorities  
- Blockers and dependencies
- Resource needs

#### **Midday Sync (1:00 PM - 10 minutes)**
**Attendees**: Active phase agents  
**Format**: Quick status check  
**Topics**:
- Progress against timeline
- Emerging issues
- Coordination needs

#### **End-of-Day Review (5:00 PM - 20 minutes)**
**Attendees**: All agents  
**Format**: Demo and review  
**Topics**:
- Daily deliverable demos
- Quality review
- Next day planning
- Risk assessment

### Conflict Resolution Protocol

#### **File Conflicts**
1. **Prevention**: Check file ownership matrix before editing
2. **Detection**: Automated conflict detection in version control
3. **Resolution**: Owner agent has final decision on conflicts
4. **Escalation**: Project coordinator resolves deadlocks

#### **Dependency Conflicts**
1. **Early Warning**: Agents notify dependencies 4 hours before handoff
2. **Quality Gates**: Acceptance criteria must be met before handoff
3. **Fallback Plans**: Alternative approaches for blocked dependencies
4. **Escalation**: Daily standup addresses all dependency issues

#### **Resource Conflicts**
1. **Shared Resources**: Database testing environments, staging servers
2. **Scheduling**: Time-boxed access to shared resources
3. **Backup Plans**: Local development alternatives
4. **Coordination**: Shared calendar for resource booking

### Quality Gates

#### **Phase Completion Criteria**
Each phase must meet these criteria before proceeding:

**Phase 1 (Foundation)**:
- [ ] All authentication flows working
- [ ] Database schema deployed and tested
- [ ] UI components using correct branding
- [ ] No blocking issues identified

**Phase 2 (Core Features)**:
- [ ] All API endpoints functional
- [ ] Artifact components rendering correctly
- [ ] Algorithm implementations tested
- [ ] Integration points defined

**Phase 3 (Integration)**:
- [ ] End-to-end workflows functional
- [ ] No critical bugs remaining
- [ ] Performance benchmarks met
- [ ] Documentation complete

**Phase 4 (Deployment)**:
- [ ] Production deployment successful
- [ ] Monitoring systems active
- [ ] Team handoff complete
- [ ] Go-live criteria met

### Emergency Procedures

#### **Critical Bug Protocol**
1. **Detection**: Any agent can declare critical bug
2. **Notification**: Immediate team notification
3. **Response**: All relevant agents drop current work
4. **Resolution**: Collaborative debugging session
5. **Prevention**: Root cause analysis and prevention measures

#### **Deployment Issues**
1. **Rollback**: Immediate rollback to last known good state
2. **Assessment**: Quick impact and root cause analysis
3. **Fix**: Hot fix development and testing
4. **Deployment**: Expedited re-deployment process
5. **Post-mortem**: Learning and process improvement

---

## Success Metrics & KPIs

### Agent Performance Metrics

#### **Individual Agent KPIs**
- **Task Completion Rate**: 100% of assigned tasks completed
- **Quality Score**: 95%+ acceptance criteria met
- **Timeline Adherence**: ±2 hours of estimated completion
- **Code Quality**: No critical issues, 90%+ test coverage
- **Collaboration Score**: Effective handoffs and communication

#### **Team Coordination KPIs**
- **Dependencies Met**: 100% of handoffs completed on time
- **Communication Effectiveness**: All blockers resolved within 4 hours
- **Integration Success**: Zero integration failures
- **Knowledge Transfer**: 100% of knowledge documented and shared

### Technical Performance Metrics

#### **Application Performance**
- **Load Time**: First Contentful Paint < 1.5s
- **Interactivity**: Time to Interactive < 3.5s
- **Responsiveness**: Core Web Vitals in "Good" range
- **Reliability**: 99.9% uptime during testing phase

#### **Code Quality Metrics**
- **Test Coverage**: 90%+ across all components
- **Type Safety**: 100% TypeScript strict mode compliance
- **Security**: Zero high/medium security vulnerabilities
- **Maintainability**: Code complexity scores in acceptable range

### Business Success Metrics

#### **Delivery Metrics**
- **Timeline**: Project completed within 8-day timeline
- **Budget**: Stays within allocated resources
- **Scope**: 100% of required features delivered
- **Quality**: Meets all acceptance criteria

#### **User Experience Metrics**
- **Usability**: Users can complete core workflows without assistance
- **Performance**: User-perceived performance meets expectations
- **Accessibility**: WCAG 2.1 AA compliance achieved
- **Functionality**: All GEO tools operational and accurate

---

## Risk Register & Mitigation

### High-Risk Items

#### **Risk 1: Database Migration Failure**
- **Probability**: Medium
- **Impact**: High
- **Mitigation**: Comprehensive backup strategy, staged migration approach
- **Owner**: database-administrator
- **Escalation**: Project coordinator + DevOps team

#### **Risk 2: Authentication Integration Issues**
- **Probability**: Medium  
- **Impact**: High
- **Mitigation**: Parallel development with fallback auth system
- **Owner**: backend-developer
- **Escalation**: Security team consultation

#### **Risk 3: Performance Degradation**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Continuous performance monitoring, optimization buffer time
- **Owner**: performance-optimizer
- **Escalation**: Architecture review board

#### **Risk 4: Component Integration Conflicts**
- **Probability**: Medium
- **Impact**: Medium
- **Mitigation**: Clear interface definitions, early integration testing
- **Owner**: fullstack-developer
- **Escalation**: Technical lead intervention

### Medium-Risk Items

#### **Risk 5: Third-party API Dependencies**
- **Probability**: Medium
- **Impact**: Low
- **Mitigation**: Mock services for development, fallback providers
- **Owner**: api-designer
- **Escalation**: Vendor escalation process

#### **Risk 6: Cross-browser Compatibility Issues**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Early cross-browser testing, progressive enhancement
- **Owner**: frontend-developer
- **Escalation**: QA team augmentation

#### **Risk 7: Team Communication Breakdown**
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Structured communication protocols, daily standups
- **Owner**: All agents
- **Escalation**: Project coordinator intervention

### Contingency Plans

#### **Plan A: Normal Execution**
- All agents work in parallel as planned
- Dependencies met on schedule
- Quality gates passed successfully
- Timeline maintained

#### **Plan B: Minor Delays**
- 1-day buffer activated
- Non-critical features moved to post-launch
- Additional resources allocated to critical path
- Weekend work if necessary

#### **Plan C: Major Issues**
- 2-day timeline extension
- Scope reduction to core features only
- Emergency debugging team assembled
- Stakeholder communication and approval

#### **Plan D: Critical Failure**
- Project pause and assessment
- Root cause analysis
- Revised timeline and scope
- Team restructuring if needed

---

## Conclusion

This agent coordination matrix provides the detailed framework for successful parallel execution of the GEO dashboard transformation. Each agent has clear responsibilities, defined dependencies, and specific deliverables that contribute to the overall project success.

**Key Success Factors**:
1. **Clear Role Definition**: Each agent knows exactly what they're responsible for
2. **Dependency Management**: All handoffs are planned and coordinated
3. **Quality Assurance**: Multiple checkpoints ensure high-quality delivery
4. **Risk Mitigation**: Comprehensive risk management with fallback plans
5. **Communication**: Structured protocols prevent miscommunication
6. **Performance Monitoring**: Continuous tracking of progress and quality

By following this coordination matrix, we ensure that all agents work efficiently in parallel while maintaining system integration and delivering a production-ready GEO dashboard on schedule.