import { tool } from 'ai';
import { diff_match_patch } from 'diff-match-patch';
import { JSDOM } from 'jsdom';
import { z } from 'zod';

export interface ChangeDetectionResult {
  baselineTimestamp: string;
  currentTimestamp: string;
  detectionMode: 'text' | 'html' | 'structure' | 'comprehensive';
  changes: Array<{
    id: string;
    type: 'added' | 'removed' | 'modified' | 'moved';
    category: 'text' | 'html' | 'structure' | 'metadata' | 'performance';
    path: string;
    oldValue: string;
    newValue: string;
    diff: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    timestamp: string;
    context: {
      before: string;
      after: string;
      location: string;
    };
    affectedAreas: string[];
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  summary: {
    totalChanges: number;
    criticalChanges: number;
    highPriorityChanges: number;
    mediumPriorityChanges: number;
    lowPriorityChanges: number;
    changeCategories: Record<string, number>;
    mostAffectedAreas: string[];
    changeTrend: 'increasing' | 'decreasing' | 'stable';
  };
  changeAnalysis: {
    totalChanges: number;
    severityDistribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    changeTypes: {
      text: number;
      structure: number;
      metadata: number;
      performance: number;
    };
    affectedAreas: string[];
    changeVelocity: number;
  };
  metadata: {
    executionTime: number;
    category: 'change-detection';
    changeThreshold: number;
    filtersApplied: string[];
    success: boolean;
  };
}

interface BaselineSnapshot {
  content: any;
  metadata: any;
  timestamp: string;
  hash: string;
}

interface CurrentSnapshot {
  content: any;
  metadata: any;
  timestamp: string;
  hash: string;
}

interface ContentChange {
  id: string;
  type: 'added' | 'removed' | 'modified' | 'moved';
  category: 'text' | 'html' | 'structure' | 'metadata' | 'performance';
  path: string;
  oldValue: string;
  newValue: string;
  diff: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: string;
  context: {
    before: string;
    after: string;
    location: string;
  };
  affectedAreas: string[];
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface ChangeSummary {
  totalChanges: number;
  criticalChanges: number;
  highPriorityChanges: number;
  mediumPriorityChanges: number;
  lowPriorityChanges: number;
  changeCategories: Record<string, number>;
  mostAffectedAreas: string[];
  changeTrend: 'increasing' | 'decreasing' | 'stable';
}

interface SeverityWeights {
  text: number;
  structure: number;
  metadata: number;
  performance: number;
}

export const changeDetectionTool = tool({
  description: 'Sophisticated website change detection with diff analysis',
  inputSchema: z.object({
    baselineSnapshot: z.object({
      content: z.any(),
      metadata: z.any(),
      timestamp: z.string(),
      hash: z.string(),
    }),
    currentSnapshot: z.object({
      content: z.any(),
      metadata: z.any(),
      timestamp: z.string(),
      hash: z.string(),
    }),
    detectionMode: z
      .enum(['text', 'html', 'structure', 'comprehensive'])
      .default('comprehensive'),
    changeThreshold: z.number().min(0).max(1).default(0.1),
    customFilters: z.array(z.string()).optional(),
    includeContext: z.boolean().default(true),
    severityWeights: z
      .object({
        text: z.number().min(0).max(1).default(0.3),
        structure: z.number().min(0).max(1).default(0.4),
        metadata: z.number().min(0).max(1).default(0.2),
        performance: z.number().min(0).max(1).default(0.1),
      })
      .optional(),
  }),
  execute: async (args: any) => {
    const {
      baselineSnapshot,
      currentSnapshot,
      detectionMode,
      changeThreshold,
      customFilters,
      includeContext,
      severityWeights,
    } = args;

    const startTime = Date.now();

    try {
      // Debug logging
      console.log('Change detection tool called with:', {
        baselineSnapshot: !!baselineSnapshot,
        currentSnapshot: !!currentSnapshot,
        detectionMode,
        baselineContent: !!baselineSnapshot?.content,
        currentContent: !!currentSnapshot?.content,
      });

      // Step 1: Validate snapshots and prepare comparison
      const comparisonConfig = await prepareComparisonConfig({
        baselineSnapshot,
        currentSnapshot,
        detectionMode,
        severityWeights,
      });

      // Step 2: Perform content comparison
      const contentChanges = await compareContent(
        baselineSnapshot?.content,
        currentSnapshot?.content,
        detectionMode,
      );

      // Step 3: Compare metadata
      const metadataChanges = await compareMetadata(
        baselineSnapshot?.metadata,
        currentSnapshot?.metadata,
      );

      // Step 4: Analyze structural changes
      const structuralChanges = await analyzeStructuralChanges(
        baselineSnapshot?.content,
        currentSnapshot?.content,
      );

      // Step 5: Calculate change severity
      const changesWithSeverity = await calculateChangeSeverity(
        [...contentChanges, ...metadataChanges, ...structuralChanges],
        comparisonConfig.severityWeights,
      );

      // Step 6: Apply custom filters
      const filteredChanges = await applyCustomFilters(
        changesWithSeverity,
        customFilters,
      );

      // Step 7: Generate change summary
      const changeSummary = await generateChangeSummary(filteredChanges);

      // Step 8: Add context to changes
      const changesWithContext = includeContext
        ? await addChangeContext(
            filteredChanges,
            baselineSnapshot,
            currentSnapshot,
          )
        : filteredChanges;

      const executionTime = Date.now() - startTime;

      return {
        baselineTimestamp: baselineSnapshot?.timestamp || 'unknown',
        currentTimestamp: currentSnapshot?.timestamp || 'unknown',
        detectionMode,
        changes: changesWithContext,
        summary: changeSummary,
        changeAnalysis: {
          totalChanges: changesWithContext.length,
          severityDistribution:
            calculateSeverityDistribution(changesWithContext),
          changeTypes: calculateChangeTypeDistribution(changesWithContext),
          affectedAreas: identifyAffectedAreas(changesWithContext),
          changeVelocity: calculateChangeVelocity(
            baselineSnapshot,
            currentSnapshot,
          ),
        },
        metadata: {
          executionTime,
          category: 'change-detection',
          changeThreshold,
          filtersApplied: customFilters || [],
          success: true,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      console.error('Change detection error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        baselineSnapshot: !!baselineSnapshot,
        currentSnapshot: !!currentSnapshot,
      });

      throw new Error(
        `Change detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});

async function prepareComparisonConfig(config: {
  baselineSnapshot: BaselineSnapshot;
  currentSnapshot: CurrentSnapshot;
  detectionMode: string;
  severityWeights?: SeverityWeights;
}): Promise<{
  baselineSnapshot: BaselineSnapshot;
  currentSnapshot: CurrentSnapshot;
  detectionMode: string;
  severityWeights: SeverityWeights;
}> {
  const defaultWeights: SeverityWeights = {
    text: 0.3,
    structure: 0.4,
    metadata: 0.2,
    performance: 0.1,
  };

  return {
    baselineSnapshot: config.baselineSnapshot,
    currentSnapshot: config.currentSnapshot,
    detectionMode: config.detectionMode,
    severityWeights: config.severityWeights || defaultWeights,
  };
}

async function compareContent(
  baselineContent: any,
  currentContent: any,
  mode: string,
): Promise<ContentChange[]> {
  const changes: ContentChange[] = [];

  // Add null checks
  if (!baselineContent || !currentContent) {
    console.warn('Content comparison skipped: missing content data');
    return changes;
  }

  switch (mode) {
    case 'text':
      if (baselineContent.text && currentContent.text) {
        changes.push(
          ...compareTextContent(baselineContent.text, currentContent.text),
        );
      }
      break;
    case 'html':
      if (baselineContent.html && currentContent.html) {
        changes.push(
          ...compareHtmlContent(baselineContent.html, currentContent.html),
        );
      }
      break;
    case 'structure':
      if (baselineContent.structuredData && currentContent.structuredData) {
        changes.push(
          ...compareStructuredData(
            baselineContent.structuredData,
            currentContent.structuredData,
          ),
        );
      }
      break;
    case 'comprehensive':
      if (baselineContent.text && currentContent.text) {
        changes.push(
          ...compareTextContent(baselineContent.text, currentContent.text),
        );
      }
      if (baselineContent.html && currentContent.html) {
        changes.push(
          ...compareHtmlContent(baselineContent.html, currentContent.html),
        );
      }
      if (baselineContent.structuredData && currentContent.structuredData) {
        changes.push(
          ...compareStructuredData(
            baselineContent.structuredData,
            currentContent.structuredData,
          ),
        );
      }
      break;
  }

  return changes;
}

function compareTextContent(
  baselineText: string,
  currentText: string,
): ContentChange[] {
  const changes: ContentChange[] = [];

  // Add comprehensive null checks
  if (!baselineText || !currentText) {
    console.warn('Text comparison skipped: missing text data');
    return changes;
  }

  if (baselineText === currentText) {
    return changes;
  }

  try {
    // Use diff-match-patch for text comparison
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(baselineText, currentText);
    dmp.diff_cleanupSemantic(diffs);

    let addedText = '';
    let removedText = '';

    diffs.forEach(([type, text]) => {
      if (type === 1) {
        // Added text
        addedText += text;
      } else if (type === -1) {
        // Removed text
        removedText += text;
      }
    });

    if (addedText || removedText) {
      const changeType: 'added' | 'removed' | 'modified' =
        addedText && removedText ? 'modified' : addedText ? 'added' : 'removed';

      changes.push({
        id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: changeType,
        category: 'text',
        path: 'text-content',
        oldValue: removedText || `${baselineText.substring(0, 100)}...`,
        newValue: addedText || `${currentText.substring(0, 100)}...`,
        diff: generateTextDiff(baselineText, currentText),
        severity: calculateTextChangeSeverity(addedText, removedText),
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        context: {
          before: `${baselineText.substring(0, 200)}...`,
          after: `${currentText.substring(0, 200)}...`,
          location: 'main content',
        },
        affectedAreas: ['content'],
        impact: 'neutral',
        description: `Text ${changeType}: ${addedText ? 'Added content' : ''}${removedText ? 'Removed content' : ''}`,
      });
    }
  } catch (error) {
    console.warn('Text comparison failed:', error);
    // Return empty changes array instead of crashing
  }

  return changes;
}

function compareHtmlContent(
  baselineHtml: string,
  currentHtml: string,
): ContentChange[] {
  const changes: ContentChange[] = [];

  if (baselineHtml === currentHtml) {
    return changes;
  }

  try {
    const baselineDom = new JSDOM(baselineHtml);
    const currentDom = new JSDOM(currentHtml);
    const baselineDoc = baselineDom.window.document;
    const currentDoc = currentDom.window.document;

    // Compare HTML structure
    const baselineBody = baselineDoc.body?.innerHTML || '';
    const currentBody = currentDoc.body?.innerHTML || '';

    if (baselineBody !== currentBody) {
      changes.push({
        id: `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'modified',
        category: 'html',
        path: 'html-structure',
        oldValue: `${baselineBody.substring(0, 100)}...`,
        newValue: `${currentBody.substring(0, 100)}...`,
        diff: generateHtmlDiff(baselineHtml, currentHtml),
        severity: 'medium',
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        context: {
          before: `${baselineBody.substring(0, 200)}...`,
          after: `${currentBody.substring(0, 200)}...`,
          location: 'HTML body',
        },
        affectedAreas: ['structure'],
        impact: 'neutral',
        description: 'HTML structure modified',
      });
    }
  } catch (error) {
    console.warn('HTML comparison failed:', error);

    // Fallback to simple string comparison
    if (baselineHtml !== currentHtml) {
      changes.push({
        id: `html-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'modified',
        category: 'html',
        path: 'html-content',
        oldValue: `${baselineHtml.substring(0, 100)}...`,
        newValue: `${currentHtml.substring(0, 100)}...`,
        diff: 'HTML content changed (detailed diff unavailable)',
        severity: 'medium',
        confidence: 0.6,
        timestamp: new Date().toISOString(),
        context: {
          before: `${baselineHtml.substring(0, 200)}...`,
          after: `${currentHtml.substring(0, 200)}...`,
          location: 'HTML content',
        },
        affectedAreas: ['content'],
        impact: 'neutral',
        description: 'HTML content modified',
      });
    }
  }

  return changes;
}

function compareStructuredData(
  baselineData: any,
  currentData: any,
): ContentChange[] {
  const changes: ContentChange[] = [];

  if (!baselineData || !currentData) {
    return changes;
  }

  // Compare headings
  if (baselineData.headings && currentData.headings) {
    const baselineHeadings = baselineData.headings;
    const currentHeadings = currentData.headings;

    if (baselineHeadings.length !== currentHeadings.length) {
      changes.push({
        id: `headings-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'modified',
        category: 'structure',
        path: 'structure.headings',
        oldValue: `Found ${baselineHeadings.length} headings`,
        newValue: `Found ${currentHeadings.length} headings`,
        diff: `Heading count changed from ${baselineHeadings.length} to ${currentHeadings.length}`,
        severity: 'low',
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        context: {
          before: JSON.stringify(baselineHeadings.slice(0, 3)),
          after: JSON.stringify(currentHeadings.slice(0, 3)),
          location: 'page headings',
        },
        affectedAreas: ['structure'],
        impact: 'neutral',
        description: 'Heading structure modified',
      });
    }
  }

  // Compare links
  if (baselineData.links && currentData.links) {
    const baselineLinks = baselineData.links;
    const currentLinks = currentData.links;

    if (baselineLinks.length !== currentLinks.length) {
      changes.push({
        id: `links-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'modified',
        category: 'structure',
        path: 'structure.links',
        oldValue: `Found ${baselineLinks.length} links`,
        newValue: `Found ${currentLinks.length} links`,
        diff: `Link count changed from ${baselineLinks.length} to ${currentLinks.length}`,
        severity: 'medium',
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        context: {
          before: JSON.stringify(baselineLinks.slice(0, 3)),
          after: JSON.stringify(currentLinks.slice(0, 3)),
          location: 'page links',
        },
        affectedAreas: ['structure'],
        impact: 'neutral',
        description: 'Link structure modified',
      });
    }
  }

  // Compare images
  if (baselineData.images && currentData.images) {
    const baselineImages = baselineData.images;
    const currentImages = currentData.images;

    if (baselineImages.length !== currentImages.length) {
      changes.push({
        id: `images-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'modified',
        category: 'structure',
        path: 'structure.images',
        oldValue: `Found ${baselineImages.length} images`,
        newValue: `Found ${currentImages.length} images`,
        diff: `Image count changed from ${baselineImages.length} to ${currentImages.length}`,
        severity: 'low',
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        context: {
          before: JSON.stringify(baselineImages.slice(0, 3)),
          after: JSON.stringify(currentImages.slice(0, 3)),
          location: 'page images',
        },
        affectedAreas: ['structure'],
        impact: 'neutral',
        description: 'Image structure modified',
      });
    }
  }

  return changes;
}

async function compareMetadata(
  baselineMetadata: any,
  currentMetadata: any,
): Promise<ContentChange[]> {
  const changes: ContentChange[] = [];

  if (!baselineMetadata || !currentMetadata) {
    return changes;
  }

  // Compare title
  if (baselineMetadata.title !== currentMetadata.title) {
    changes.push({
      id: `title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'modified',
      category: 'metadata',
      path: 'metadata.title',
      oldValue: baselineMetadata.title || '',
      newValue: currentMetadata.title || '',
      diff: `Title changed from "${baselineMetadata.title || ''}" to "${currentMetadata.title || ''}"`,
      severity: 'high',
      confidence: 0.95,
      timestamp: new Date().toISOString(),
      context: {
        before: baselineMetadata.title || '',
        after: currentMetadata.title || '',
        location: 'page title',
      },
      affectedAreas: ['seo', 'metadata'],
      impact: 'neutral',
      description: 'Page title modified',
    });
  }

  // Compare description
  if (baselineMetadata.description !== currentMetadata.description) {
    changes.push({
      id: `description-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'modified',
      category: 'metadata',
      path: 'metadata.description',
      oldValue: baselineMetadata.description || '',
      newValue: currentMetadata.description || '',
      diff: `Description changed from "${baselineMetadata.description || ''}" to "${currentMetadata.description || ''}"`,
      severity: 'medium',
      confidence: 0.95,
      timestamp: new Date().toISOString(),
      context: {
        before: baselineMetadata.description || '',
        after: currentMetadata.description || '',
        location: 'page description',
      },
      affectedAreas: ['seo', 'metadata'],
      impact: 'neutral',
      description: 'Page description modified',
    });
  }

  // Compare keywords
  if (
    JSON.stringify(baselineMetadata.keywords) !==
    JSON.stringify(currentMetadata.keywords)
  ) {
    changes.push({
      id: `keywords-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'modified',
      category: 'metadata',
      path: 'metadata.keywords',
      oldValue: (baselineMetadata.keywords || []).join(', '),
      newValue: (currentMetadata.keywords || []).join(', '),
      diff: `Keywords changed from [${(baselineMetadata.keywords || []).join(', ')}] to [${(currentMetadata.keywords || []).join(', ')}]`,
      severity: 'low',
      confidence: 0.9,
      timestamp: new Date().toISOString(),
      context: {
        before: (baselineMetadata.keywords || []).join(', '),
        after: (currentMetadata.keywords || []).join(', '),
        location: 'page keywords',
      },
      affectedAreas: ['seo', 'metadata'],
      impact: 'neutral',
      description: 'Page keywords modified',
    });
  }

  return changes;
}

async function analyzeStructuralChanges(
  baselineContent: any,
  currentContent: any,
): Promise<ContentChange[]> {
  const changes: ContentChange[] = [];

  if (!baselineContent || !currentContent) {
    return changes;
  }

  // Compare content hash
  if (baselineContent.contentHash !== currentContent.contentHash) {
    changes.push({
      id: `hash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'modified',
      category: 'structure',
      path: 'content.hash',
      oldValue: baselineContent.contentHash || 'unknown',
      newValue: currentContent.contentHash || 'unknown',
      diff: 'Content hash changed, indicating structural modifications',
      severity: 'medium',
      confidence: 0.8,
      timestamp: new Date().toISOString(),
      context: {
        before: 'Previous content hash',
        after: 'Current content hash',
        location: 'content structure',
      },
      affectedAreas: ['structure'],
      impact: 'neutral',
      description: 'Content structure modified',
    });
  }

  return changes;
}

async function calculateChangeSeverity(
  changes: ContentChange[],
  weights: SeverityWeights,
): Promise<ContentChange[]> {
  return changes.map((change) => {
    let severityScore = 0;

    // Ensure change has required properties
    if (!change || !change.type || !change.category) {
      console.warn('Invalid change object:', change);
      return {
        ...change,
        severity: 'low' as const,
        category: change?.category || 'text',
        type: change?.type || 'modified',
      };
    }

    // Base severity from change type
    switch (change.type) {
      case 'added':
        severityScore += 0.3;
        break;
      case 'removed':
        severityScore += 0.5;
        break;
      case 'modified':
        severityScore += 0.4;
        break;
      case 'moved':
        severityScore += 0.2;
        break;
      default:
        severityScore += 0.4; // Default for unknown types
        break;
    }

    // Adjust based on category weights
    switch (change.category) {
      case 'text':
        severityScore *= weights.text;
        break;
      case 'structure':
        severityScore *= weights.structure;
        break;
      case 'metadata':
        severityScore *= weights.metadata;
        break;
      case 'performance':
        severityScore *= weights.performance;
        break;
      case 'html':
        severityScore *= weights.structure;
        break;
      default:
        severityScore *= weights.text; // Default for unknown categories
        break;
    }

    // Determine severity level
    let severity: 'low' | 'medium' | 'high' | 'critical';
    if (severityScore < 0.25) severity = 'low';
    else if (severityScore < 0.5) severity = 'medium';
    else if (severityScore < 0.75) severity = 'high';
    else severity = 'critical';

    return {
      ...change,
      severity,
    };
  });
}

async function applyCustomFilters(
  changes: ContentChange[],
  filters?: string[],
): Promise<ContentChange[]> {
  if (!filters || filters.length === 0) {
    return changes;
  }

  return changes.filter((change) => {
    // Ensure change has required properties
    if (
      !change ||
      !change.path ||
      !change.description ||
      !change.category ||
      !change.affectedAreas
    ) {
      console.warn('Invalid change object for filtering:', change);
      return false;
    }

    return filters.some((filter) => {
      const filterLower = filter.toLowerCase();
      return (
        change.path.toLowerCase().includes(filterLower) ||
        change.description.toLowerCase().includes(filterLower) ||
        change.category.toLowerCase().includes(filterLower) ||
        change.affectedAreas.some((area) =>
          area.toLowerCase().includes(filterLower),
        )
      );
    });
  });
}

async function generateChangeSummary(
  changes: ContentChange[],
): Promise<ChangeSummary> {
  const totalChanges = changes.length;
  const criticalChanges = changes.filter(
    (c) => c?.severity === 'critical',
  ).length;
  const highPriorityChanges = changes.filter(
    (c) => c?.severity === 'high',
  ).length;
  const mediumPriorityChanges = changes.filter(
    (c) => c?.severity === 'medium',
  ).length;
  const lowPriorityChanges = changes.filter(
    (c) => c?.severity === 'low',
  ).length;

  const changeCategories = changes.reduce(
    (acc, change) => {
      if (change?.category) {
        acc[change.category] = (acc[change.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const mostAffectedAreas = identifyMostAffectedAreas(changes);
  const changeTrend = calculateChangeTrend(changes);

  return {
    totalChanges,
    criticalChanges,
    highPriorityChanges,
    mediumPriorityChanges,
    lowPriorityChanges,
    changeCategories,
    mostAffectedAreas,
    changeTrend,
  };
}

async function addChangeContext(
  changes: ContentChange[],
  baselineSnapshot: BaselineSnapshot,
  currentSnapshot: CurrentSnapshot,
): Promise<ContentChange[]> {
  return changes.map((change) => {
    if (!change) return change;

    const context: any = {
      baselineValue: null,
      currentValue: null,
      changeContext: '',
    };

    // Add context based on change type and path
    if (change.path && change.type) {
      try {
        switch (change.type) {
          case 'text':
            if (
              baselineSnapshot?.content?.text &&
              currentSnapshot?.content?.text
            ) {
              context.baselineValue = `${baselineSnapshot.content.text.substring(0, 100)}...`;
              context.currentValue = `${currentSnapshot.content.text.substring(0, 100)}...`;
            }
            break;
          case 'structure':
            if (
              baselineSnapshot?.content?.structuredData &&
              currentSnapshot?.content?.structuredData
            ) {
              context.baselineValue = `${JSON.stringify(baselineSnapshot.content.structuredData).substring(0, 100)}...`;
              context.currentValue = `${JSON.stringify(currentSnapshot.content.structuredData).substring(0, 100)}...`;
            }
            break;
          case 'metadata':
            if (baselineSnapshot?.metadata && currentSnapshot?.metadata) {
              context.baselineValue = `${JSON.stringify(baselineSnapshot.metadata).substring(0, 100)}...`;
              context.currentValue = `${JSON.stringify(currentSnapshot.metadata).substring(0, 100)}...`;
            }
            break;
          case 'performance':
            if (
              baselineSnapshot?.content?.performance &&
              currentSnapshot?.content?.performance
            ) {
              context.baselineValue = `${JSON.stringify(baselineSnapshot.content.performance).substring(0, 100)}...`;
              context.currentValue = `${JSON.stringify(currentSnapshot.content.performance).substring(0, 100)}...`;
            }
            break;
        }
      } catch (error) {
        console.warn('Error adding context for change:', change.path, error);
      }
    }

    return {
      ...change,
      context,
    };
  });
}

function calculateSeverityDistribution(
  changes: ContentChange[],
): Record<string, number> {
  return changes.reduce(
    (acc, change) => {
      if (change?.severity) {
        acc[change.severity] = (acc[change.severity] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}

function calculateChangeTypeDistribution(
  changes: ContentChange[],
): Record<string, number> {
  return changes.reduce(
    (acc, change) => {
      if (change?.type) {
        acc[change.type] = (acc[change.type] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}

function identifyAffectedAreas(changes: ContentChange[]): string[] {
  const areas = new Set<string>();

  changes.forEach((change) => {
    if (change?.affectedAreas) {
      change.affectedAreas.forEach((area) => areas.add(area));
    }
  });

  return Array.from(areas);
}

function calculateChangeVelocity(
  baselineSnapshot: BaselineSnapshot,
  currentSnapshot: CurrentSnapshot,
): number {
  const baselineTime = new Date(baselineSnapshot.timestamp).getTime();
  const currentTime = new Date(currentSnapshot.timestamp).getTime();
  const timeDiff = currentTime - baselineTime;

  if (timeDiff === 0) return 0;

  // Return changes per hour
  return 1 / (timeDiff / (1000 * 60 * 60));
}

function identifyMostAffectedAreas(changes: ContentChange[]): string[] {
  const areaCounts = changes.reduce(
    (acc, change) => {
      if (change?.affectedAreas) {
        change.affectedAreas.forEach((area) => {
          acc[area] = (acc[area] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(areaCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([area]) => area);
}

function calculateChangeTrend(changes: ContentChange[]): string {
  if (changes.length === 0) return 'no-changes';

  const severityScores = changes.map((change) => {
    if (!change?.severity) return 0;
    switch (change.severity) {
      case 'critical':
        return 4;
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  });

  const averageScore =
    severityScores.reduce((sum, score) => sum + score, 0) /
    severityScores.length;

  if (averageScore >= 3.5) return 'increasing';
  if (averageScore >= 2.5) return 'stable';
  return 'decreasing';
}

function generateTextDiff(oldText: string, newText: string): string {
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(oldText, newText);
  dmp.diff_cleanupSemantic(diffs);

  let diff = '';
  diffs.forEach(([type, text]) => {
    if (type === 1) {
      diff += `[+${text}]`;
    } else if (type === -1) {
      diff += `[-${text}]`;
    } else {
      diff += text;
    }
  });

  return diff;
}

function generateHtmlDiff(oldHtml: string, newHtml: string): string {
  // Simplified HTML diff for display
  const oldWords = oldHtml.split(/\s+/);
  const newWords = newHtml.split(/\s+/);

  const added = newWords.filter((word) => !oldWords.includes(word));
  const removed = oldWords.filter((word) => !newWords.includes(word));

  let diff = '';
  if (added.length > 0) {
    diff += `Added: ${added.slice(0, 10).join(' ')}${added.length > 10 ? '...' : ''}`;
  }
  if (removed.length > 0) {
    diff += `${diff ? '; ' : ''}Removed: ${removed.slice(0, 10).join(' ')}${removed.length > 10 ? '...' : ''}`;
  }

  return diff || 'HTML structure modified';
}

function calculateTextChangeSeverity(
  addedText: string,
  removedText: string,
): 'low' | 'medium' | 'high' | 'critical' {
  const addedLength = addedText.length;
  const removedLength = removedText.length;
  const totalChange = addedLength + removedLength;

  if (totalChange > 1000) return 'critical';
  if (totalChange > 500) return 'high';
  if (totalChange > 100) return 'medium';
  return 'low';
}
