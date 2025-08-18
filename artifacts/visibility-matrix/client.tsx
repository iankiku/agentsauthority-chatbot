import { VisibilityMatrix } from '@/components/artifacts/geo-artifacts/visibility-matrix';
import type { VisibilityAnalysisResult } from '@/lib/ai/tools/types';

export const visibilityMatrixArtifact = {
  kind: 'visibility-matrix' as const,
  title: 'Visibility Matrix',
  description: 'Brand visibility analysis across AI models',
  icon: '📊',
  color: 'blue',
  component: ({ content }: { content: VisibilityAnalysisResult }) => {
    return <VisibilityMatrix data={content} />;
  },
  preview: ({ content }: { content: VisibilityAnalysisResult }) => {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Brand Visibility Analysis: {content.brandName}
        </h3>
        <div className="text-sm text-blue-700">
          <p>Overall Score: {content.overallVisibility}/100</p>
          <p>Models Analyzed: {content.metadata.modelsQueried.length}</p>
          <p>Analysis Time: {content.metadata.executionTime}ms</p>
        </div>
      </div>
    );
  },
};
