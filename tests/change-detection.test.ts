import { describe, expect, it } from 'vitest';
import { changeDetectionTool } from '../lib/ai/tools/change-detection-tool';

describe('Change Detection Tool', () => {
  it('should detect text changes correctly', async () => {
    const baselineSnapshot = {
      content: {
        text: 'This is the old content with some text.',
        html: '<p>This is the old content with some text.</p>',
        structuredData: {
          headings: [{ level: 1, text: 'Old Title', id: 'title' }],
          links: [{ text: 'Old Link', url: '/old', title: 'Old' }],
          images: [{ src: '/old.jpg', alt: 'Old Image', title: 'Old' }],
        },
        contentHash: 'old-hash-123',
      },
      metadata: {
        title: 'Old Page Title',
        description: 'Old page description',
        keywords: ['old', 'page', 'content'],
      },
      timestamp: '2024-01-01T00:00:00Z',
      hash: 'baseline-hash-123',
    };

    const currentSnapshot = {
      content: {
        text: 'This is the new content with updated text.',
        html: '<p>This is the new content with updated text.</p>',
        structuredData: {
          headings: [{ level: 1, text: 'New Title', id: 'title' }],
          links: [{ text: 'New Link', url: '/new', title: 'New' }],
          images: [{ src: '/new.jpg', alt: 'New Image', title: 'New' }],
        },
        contentHash: 'new-hash-456',
      },
      metadata: {
        title: 'New Page Title',
        description: 'New page description',
        keywords: ['new', 'page', 'content'],
      },
      timestamp: '2024-01-02T00:00:00Z',
      hash: 'current-hash-456',
    };

    const result = await changeDetectionTool.execute({
      baselineSnapshot,
      currentSnapshot,
      detectionMode: 'comprehensive',
      changeThreshold: 0.1,
      includeContext: true,
    });

    expect(result).toBeDefined();
    expect(result.baselineTimestamp).toBe('2024-01-01T00:00:00Z');
    expect(result.currentTimestamp).toBe('2024-01-02T00:00:00Z');
    expect(result.detectionMode).toBe('comprehensive');
    expect(result.changes.length).toBeGreaterThan(0);
    expect(result.summary.totalChanges).toBeGreaterThan(0);
    expect(result.metadata.success).toBe(true);
  });

  it('should handle no changes gracefully', async () => {
    const baselineSnapshot = {
      content: {
        text: 'Same content',
        html: '<p>Same content</p>',
        structuredData: {
          headings: [{ level: 1, text: 'Same Title', id: 'title' }],
          links: [{ text: 'Same Link', url: '/same', title: 'Same' }],
          images: [{ src: '/same.jpg', alt: 'Same Image', title: 'Same' }],
        },
        contentHash: 'same-hash',
      },
      metadata: {
        title: 'Same Title',
        description: 'Same description',
        keywords: ['same', 'content'],
      },
      timestamp: '2024-01-01T00:00:00Z',
      hash: 'same-hash',
    };

    const currentSnapshot = {
      content: {
        text: 'Same content',
        html: '<p>Same content</p>',
        structuredData: {
          headings: [{ level: 1, text: 'Same Title', id: 'title' }],
          links: [{ text: 'Same Link', url: '/same', title: 'Same' }],
          images: [{ src: '/same.jpg', alt: 'Same Image', title: 'Same' }],
        },
        contentHash: 'same-hash',
      },
      metadata: {
        title: 'Same Title',
        description: 'Same description',
        keywords: ['same', 'content'],
      },
      timestamp: '2024-01-02T00:00:00Z',
      hash: 'same-hash',
    };

    const result = await changeDetectionTool.execute({
      baselineSnapshot,
      currentSnapshot,
      detectionMode: 'comprehensive',
    });

    expect(result).toBeDefined();
    expect(result.changes.length).toBe(0);
    expect(result.summary.totalChanges).toBe(0);
    expect(result.metadata.success).toBe(true);
  });

  it('should apply custom filters correctly', async () => {
    const baselineSnapshot = {
      content: {
        text: 'Old content',
        html: '<p>Old content</p>',
        structuredData: {
          headings: [{ level: 1, text: 'Old Title', id: 'title' }],
          links: [{ text: 'Old Link', url: '/old', title: 'Old' }],
        },
        contentHash: 'old-hash',
      },
      metadata: {
        title: 'Old Title',
        description: 'Old description',
        keywords: ['old'],
      },
      timestamp: '2024-01-01T00:00:00Z',
      hash: 'old-hash',
    };

    const currentSnapshot = {
      content: {
        text: 'New content',
        html: '<p>New content</p>',
        structuredData: {
          headings: [{ level: 1, text: 'New Title', id: 'title' }],
          links: [{ text: 'New Link', url: '/new', title: 'New' }],
        },
        contentHash: 'new-hash',
      },
      metadata: {
        title: 'New Title',
        description: 'New description',
        keywords: ['new'],
      },
      timestamp: '2024-01-02T00:00:00Z',
      hash: 'new-hash',
    };

    const result = await changeDetectionTool.execute({
      baselineSnapshot,
      currentSnapshot,
      detectionMode: 'comprehensive',
      customFilters: ['title'],
    });

    expect(result).toBeDefined();
    expect(result.changes.length).toBeGreaterThan(0);
    expect(result.metadata.filtersApplied).toEqual(['title']);

    // All changes should be related to title
    const titleChanges = result.changes.filter(
      (change) =>
        change.path.includes('title') ||
        change.description.toLowerCase().includes('title'),
    );
    expect(titleChanges.length).toBeGreaterThan(0);
  });
});
